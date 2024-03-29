import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProjectService } from './project.service';
import { IProject } from './project.interface';
import _ from 'lodash';
import ApiError from '../../../errors/ApiError';
import mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import axios from 'axios';
import slugify from 'slugify';
// import config from '../../../config';

const createProject = catchAsync(async (req: Request, res: Response) => {
  const projectInfo = req.body;

  const { data } = await axios.post(process.env.API_URL, {
    "short_description": projectInfo.prompt
  });
  projectInfo.image = data?.img;
  projectInfo.liveLink = data?.url;
  projectInfo.link = slugify(projectInfo.projectName, {
    lower: true,
    trim: true
  });
  const itemExist = await ProjectService.getSingleProject(projectInfo.link);
    if(itemExist){
      return sendResponse<IProject>(res, {
        statusCode: StatusCodes.CONFLICT,
        success: false,
        message: 'Item Name already exists',
        data: itemExist,
      });
      
    }





  const result = await ProjectService.createProject(projectInfo);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Project generate successfully',
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { userId, ids } = req.body;

  await ProjectService.updateProject(userId, ids);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '',
    data: '',
  });
});

const getAllProject = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.auth?._id;
  const result = await ProjectService.getProjectsByAuthUser(userId);

  sendResponse<IProject[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '',
    data: result,
  });
});

const getProjectsByLocalStorageProjectIds = catchAsync(
  async (req: Request, res: Response) => {
    const ids = req?.params.ids;
    const array = _.attempt(JSON.parse.bind(null, ids));

    if (_.isError(array)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, array.message);
    }

    const objectIds = array?.reduce((prev: [], current: string) => {
      return [...prev, new ObjectId(current)];
    }, []);
    const result = await ProjectService.getProjectsByLocalStorageProjectIds(
      objectIds
    );

    sendResponse<IProject[]>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: '',
      data: result,
    });
  }
);

const getSingleProject = catchAsync(async (req: Request, res: Response) => {
  const link = req.params.link;
  const result = await ProjectService.getSingleProject(link);

  sendResponse<IProject>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '',
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getSingleProject,
  getAllProject,
  getProjectsByLocalStorageProjectIds,
  updateProject,
};
