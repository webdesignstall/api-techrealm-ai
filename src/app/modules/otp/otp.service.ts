import { IOtp } from './otp.interface';
import { Otp } from './otp.model';

const otpCreate = async (payload: IOtp): Promise<IOtp> => {
  return Otp.create(payload);
};

const getSingleOtp = async (email: string): Promise<IOtp | null> => {
  return Otp.findOne({ email }).lean();
};

const updateOtp = async (
  email: string,
  status: number
): Promise<IOtp | null> => {
  return Otp.findOneAndUpdate({ email }, { status });
};

export const OtpService = {
  otpCreate,
  getSingleOtp,
  updateOtp,
};
