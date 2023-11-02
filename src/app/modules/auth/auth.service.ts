import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IResetPassword,
  ISetNewPassword,
} from './auth.interface';
import apiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import mongoose, { Types } from 'mongoose';
import { Otp } from '../otp/otp.model';
import { generateOtp } from '../user/user.utils';
import { sendOtp } from '../../../helpers/sendMail';
import bcrypt from 'bcryptjs';
import { IUser } from '../user/user.interface';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const user = new User();
  const isUserExit = await user.isUserExit(email);

  if (!isUserExit) {
    throw new apiError(
      StatusCodes.NOT_FOUND,
      'Login failed: Invalid credentials!'
    );
  }

  if (!isUserExit?.password) {
    throw new apiError(
      StatusCodes.UNAUTHORIZED,
      'Login failed: Invalid credentials!'
    );
  }

  const isMatchPassword = await user.isPasswordMatch(
    password,
    isUserExit?.password
  );

  if (!isMatchPassword) {
    throw new apiError(
      StatusCodes.UNAUTHORIZED,
      'Login failed: Invalid credentials!'
    );
  }

  const accessToken: string = jwtHelpers.createToken(
    {
      id: isUserExit?._id as Types.ObjectId,
      email: isUserExit?.email as string,
      name: isUserExit?.name,
    },
    config?.jwt_secret as Secret,
    config.jwt_expires_in as string
  );
  const refreshToken: string = jwtHelpers.createToken(
    {
      id: isUserExit?._id as Types.ObjectId,
      email: isUserExit?.email as string,
      name: isUserExit?.name,
    },
    config?.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  refresh_token: string
): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      refresh_token,
      config.jwt_refresh_secret as Secret
    );
  } catch (err) {
    throw new apiError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { email } = verifiedToken;

  const user = new User();

  const isUserExit = await user.isUserExit(email);

  if (!isUserExit) {
    throw new apiError(StatusCodes.NOT_FOUND, 'User does not exit!');
  }

  const accessToken: string = jwtHelpers.createToken(
    {
      id: isUserExit?.id as Types.ObjectId,
      email: isUserExit?.email as string,
      role: isUserExit?.name,
    },
    config?.jwt_secret as Secret,
    config.jwt_expires_in as string
  );
  return {
    accessToken: accessToken,
  };
};

const changePassword = async (
  auth: JwtPayload | null,
  payload: IChangePassword
): Promise<IUser | null> => {
  const { oldPassword, password } = payload;

  const userInstant = new User();

  //alternative way
  const isUserExist = await User.findById({ _id: auth?.id }).select(
    '+password'
  );

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await userInstant.isPasswordMatch(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Old Password is incorrect');
  }
  const salt = bcrypt.genSaltSync(Number(config.bcrypt_salt));
  const hashedPassword = bcrypt.hashSync(password, salt);
  return User.findByIdAndUpdate(auth?.id, {
    password: hashedPassword,
    verified: true,
  });
};

const verifyOtp = async (email: string, otp: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const isOtp = await Otp.findOneAndUpdate(
      { email, otp, status: 0 },
      { status: 1 },
      { session }
    ).lean();

    const isExpire =
      isOtp?.expire !== undefined
        ? isOtp?.expire?.getTime() < new Date().getTime()
        : false;

    if (isExpire) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'OTP Expire');
    }

    if (!isOtp) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid OTP');
    }

    await User.findOneAndUpdate({ email }, { verified: true }, { session });
    await session.commitTransaction();
    await session.endSession();
    return {
      email,
      otp,
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const sendResendOtp = async (email: string) => {
  const isUser = await User.findOne({ email }).lean();

  if (!isUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Account not exits!');
  }

  const otpData = generateOtp(email, 0);

  const otpResult = await Otp.findOne({ email }).lean();

  if (otpResult) {
    const isExpire =
      otpResult?.expire !== undefined
        ? otpResult?.expire?.getTime() > new Date().getTime()
        : false;

    if (isExpire) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Please wait for OTP Expire');
    }
  }

  const newOtp = await Otp.findOneAndUpdate({ email }, otpData, {
    new: true,
    upsert: true,
  });

  const mailResult = await sendOtp(
    email,
    'Email Verification',
    `${newOtp?.otp}`,
    newOtp?.otpExpireIn as string
  );

  if (mailResult[0]?.statusCode === 202) {
    return {
      expireIn: newOtp.expire,
      message: 'OTP send successfully',
    };
  }
  return {
    expireIn: null,
    message: 'Something went wrong',
  };
};

const resetPassword = async (payload: IResetPassword) => {
  const isOtpVerify = await Otp.findOne({
    email: payload.email,
    otp: payload.otp,
    status: 1,
  }).lean();

  if (!isOtpVerify) {
    throw new ApiError(404, 'Invalid OTP');
  }

  const isUser = await User.findOne({ email: payload.email }).lean();
  if (!isUser) {
    throw new ApiError(404, 'Account not found');
  }

  const salt = bcrypt.genSaltSync(Number(config.bcrypt_salt));
  const hashedPassword = bcrypt.hashSync(payload.password, salt);

  await User.findOneAndUpdate(
    { email: payload?.email },
    {
      password: hashedPassword,
      confirmationToken: '',
      verified: true,
    }
  );

  await Otp.deleteOne({ email: payload.email });
};

const setNewPassword = async (payload: ISetNewPassword): Promise<void> => {
  const verifiedToken = jwtHelpers.verifyToken(
    payload.token,
    config.jwt_mail_verify_secret as Secret
  );
  const { email } = verifiedToken;

  const isMatch = await User.findOne({
    email: email,
    confirmationToken: payload.token,
  }).select('+password');

  if (!isMatch) {
    throw new apiError(StatusCodes.NOT_FOUND, 'Invalid Token');
  }

  const isExpire =
    verifiedToken?.exp !== undefined
      ? verifiedToken?.exp < Date.now() / 1000
      : false;

  if (isExpire) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Token Expire');
  }

  const salt = bcrypt.genSaltSync(Number(config.bcrypt_salt));
  const hashedPassword = bcrypt.hashSync(payload.password, salt);

  await User.findOneAndUpdate(
    { email: verifiedToken?.email },
    {
      password: hashedPassword,
      confirmationToken: '',
      verified: true,
    }
  );
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  verifyOtp,
  sendResendOtp,
  setNewPassword,
  resetPassword,
};
