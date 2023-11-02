import { Types } from 'mongoose';

export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type ITokenPayload = {
  id: Types.ObjectId;
  email: string;
  role: {
    id: Types.ObjectId | undefined;
    name: string | undefined;
  };
  permissions: {
    id: Types.ObjectId;
    name: string;
  };
};

export type ISetNewPassword = {
  email: string;
  password: string;
  token: string;
};

export type IChangePassword = {
  oldPassword: string;
  password: string;
};
export type IResetPassword = {
  email: string;
  otp: string;
  password: string;
};
