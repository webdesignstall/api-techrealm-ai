import { Schema, model } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { IUser, IUserMethods, IUserModel } from './user.interface';
import bcrypt from 'bcryptjs';
import config from '../../../config';
import crypto from 'crypto';

const userSchema = new Schema<IUser, IUserMethods>(
  {
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    confirmationToken: {
      type: String,
    },
    confirmationTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

userSchema.methods.isUserExit = async function (
  email: string
): Promise<Partial<IUser> | null> {
  const user = await User.aggregate([{ $match: { email } }]);
  return user[0];
};

userSchema.methods.isPasswordMatch = async function (
  // eslint-disable-next-line no-unused-vars
  planePassword: string,
  // eslint-disable-next-line no-unused-vars
  hashPassword: string
): Promise<boolean> {
  return bcrypt.compareSync(planePassword, hashPassword);
};

userSchema.pre('save', async function (next) {
  const isExist = await User.findOne({
    email: this.email,
  }).lean();
  if (isExist) {
    throw new ApiError(StatusCodes.CONFLICT, 'account already exist !');
  }

  const salt = bcrypt.genSaltSync(Number(config.bcrypt_salt));
  this.password = bcrypt.hashSync(this.password, salt);

  next();
});

userSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  const date = new Date();
  date.setHours(date.getHours() + 23);

  return { token, expireTime: date };
};

export const User = model<IUser, IUserModel>('User', userSchema);
