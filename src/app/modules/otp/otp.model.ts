import { Schema, model } from 'mongoose';
import { IOtp, IOtpModel } from './otp.interface';

const otpSchema = new Schema<IOtp, IOtpModel>(
  {
    email: {
      type: String,
    },
    otp: {
      type: Number,
    },
    status: {
      type: Number,
      default: 0,
    },
    expire: {
      type: Date,
    },
    otpExpireIn: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

export const Otp = model<IOtp, IOtpModel>('Otp', otpSchema);
