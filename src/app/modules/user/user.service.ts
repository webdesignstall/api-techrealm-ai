import { IUser } from './user.interface';
import { User } from './user.model';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Types } from 'mongoose';
import { Secret } from 'jsonwebtoken';

const register = async (payload: IUser) => {
  const createdUser = await User.create(payload);

  const accessToken: string = jwtHelpers.createToken(
    {
      id: createdUser?.id as Types.ObjectId,
      email: createdUser?.email as string,
      name: createdUser?.name,
    },
    config?.jwt_secret as Secret,
    config.jwt_expires_in as string
  );
  const refreshToken: string = jwtHelpers.createToken(
    {
      id: createdUser?.id as Types.ObjectId,
      email: createdUser?.email as string,
      name: createdUser?.name,
    },
    config?.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  return User.findOneAndUpdate({ _id: id }, payload, { new: true });
};

export const UserService = {
  getSingleUser,
  updateUser,
  register,
};
