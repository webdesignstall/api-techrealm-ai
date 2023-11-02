/* eslint-disable @typescript-eslint/consistent-type-definitions */
import multer, { StorageEngine } from 'multer';
import { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import config from '../../config';
import catchAsync from '../../shared/catchAsync';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

declare module 'express-serve-static-core' {
  interface Request {
    // eslint-disable-next-line no-undef
    file: Express.Multer.File & {
      public_id?: string;
      secure_url?: string;
    };
  }
}

const storageForCloudinary: StorageEngine = multer.diskStorage({});

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage:
    config.file_upload_place === 'local' ? storage : storageForCloudinary,
  fileFilter: (
    req: Request,
    // eslint-disable-next-line no-undef
    file: Express.Multer.File,
    // eslint-disable-next-line no-unused-vars
    cb: multer.FileFilterCallback
  ): void => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cb(new Error('Only images are allowed'), false);
    }
  },
  limits: { fileSize: 500 * 1024 },
});

const uploadToCloudinaryOrMulter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    /*const protocol = req.protocol;
    const domain = req.hostname;
    const port = config.port;
    const fullUrl =
      config.env === 'development'
        ? `${protocol}://${domain}:${port}/`
        : `${protocol}://${domain}/`;*/

    const protocol = req.headers['X-Forwarded-Proto'] || 'https';
    const domain = req.hostname;
    const port = config.port;
    const fullUrl =
      config.env === 'development'
        ? `${protocol}://${domain}:${port}/`
        : `${protocol}://${domain}/`;

    if (!req.file) {
      return next();
    }
    if (config.file_upload_place === 'local') {
      req.file.public_id = req.file.filename;
      req.file.secure_url = fullUrl + req.file.path;
      return next();
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path
    );

    const file = req.file; // Create a non-optional reference

    file.public_id = public_id;
    file.secure_url = secure_url;

    return next();
  }
);

export const UploadMiddleware = {
  upload,
  uploadToCloudinaryOrMulter,
};
