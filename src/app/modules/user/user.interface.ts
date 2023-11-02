import { Model, Types } from 'mongoose';

export type Name = {
  firstName: string;
  lastName: string;
};

export type IUserRegister = {
  email: string;
  mobile: string;
  password: string;
  roleId?: Types.ObjectId;
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
};

export type IEmployeeRegister = {
  email: string;
  mobile: string;
  password: string;
  roleId: Types.ObjectId;
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
};

export type ITeacherProfile = {
  name: Name;
  userId: Types.ObjectId;
};

export type IUser = {
  name: {
    firstName: string;
    lastName: string;
  };
  id?: Types.ObjectId;
  email: string;
  password: string;
  confirmPassword: string;
  status?: 'active' | 'inactive' | 'blocked';
  verified?: true | false;
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
};

export type IToken = {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  email: string;
  mobile: string;
  password: string;
  name: string;
};

export type IConfirmationTokenResponse = {
  token: string;
  expireTime: Date;
};

export type IUserMethods = {
  // eslint-disable-next-line no-unused-vars
  isUserExit(email: string): Promise<IToken | null>;
  generateConfirmationToken(): IConfirmationTokenResponse;
  // eslint-disable-next-line no-unused-vars
  isPasswordMatch(
    // eslint-disable-next-line no-unused-vars
    planePassword: string,
    // eslint-disable-next-line no-unused-vars
    hashPassword: string
  ): Promise<boolean>;
};

export type IUserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type IUserFilters = {
  searchTerm?: string;
  name?: string;
};
