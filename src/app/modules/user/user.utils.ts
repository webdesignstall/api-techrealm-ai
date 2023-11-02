import { IOtp } from '../otp/otp.interface';

export const generateOtp = (email: string, status: number): IOtp => {
  const makeOtp = Math.floor(100000 + Math.random() * 900000);
  const expireTime = new Date();
  expireTime.setMinutes(expireTime.getMinutes() + 2);

  return {
    email: email,
    otp: makeOtp,
    status: status,
    expire: expireTime,
    otpExpireIn: '2',
  };
};
