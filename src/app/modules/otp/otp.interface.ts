import { Model } from 'mongoose';

export type IOtp = {
  email: string;
  otp: number;
  status?: number;
  expire?: Date;
  otpExpireIn?: string;
};

export type IOtpModel = Model<IOtp, Record<string, unknown>>;

export type IOtpFilters = {
  searchTerm?: string;
  name?: string;
};
