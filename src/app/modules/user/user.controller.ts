import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import { IUser } from './user.interface';

const register = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req.body;
  const result = await UserService.register(userInfo);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Account register successfully',
    data: result,
  });
});

const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUser(id);

  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '',
    data: result,
  });
});

const employeeUpdate = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateInfo = req.body;

  const result = await UserService.updateUser(id, updateInfo);

  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'profile updated successfully !',
    data: result,
  });
});

export const UserController = {
  getSingle,
  employeeUpdate,
  register,
};
