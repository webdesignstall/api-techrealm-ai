import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;
  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refresh_token', refreshToken, cookieOption);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refresh_token } = req.cookies;
  const result = await AuthService.refreshToken(refresh_token);
  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refresh_token', refresh_token, cookieOption);
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const auth = req.auth;
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(auth, passwordData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result ? 'Password change successfully' : 'Account not found',
    data: result,
  });
});

const otpVerify = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.params;
  await AuthService.verifyOtp(email, Number(otp));
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Otp verify successfully',
    data: null,
  });
});

const sendResendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await AuthService.sendResendOtp(email);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result.expireIn,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { ...resetData } = req.body;
  await AuthService.resetPassword(resetData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successfully',
    data: null,
  });
});

const setNewPassword = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;

  await AuthService.setNewPassword(userData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password set successfully',
    data: null,
  });
});
export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  otpVerify,
  sendResendOtp,
  setNewPassword,
  resetPassword,
};
