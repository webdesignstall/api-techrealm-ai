import { NextFunction, Request, Response } from 'express';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import ApiError from '../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../shared/catchAsync';

const authVerify = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (!token) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized, Token Not Found'
      );
    }

    token = token.split(' ')[1];
    const verifiedToken: JwtPayload = jwtHelpers.verifyToken(
      token,
      config.jwt_secret as Secret
    );

    const user = await User.findById({ _id: verifiedToken.id }).lean();
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    user.id = user?._id;
    req.auth = user;
    next();
  }
);

export const AuthMiddleware = {
  authVerify,
};
