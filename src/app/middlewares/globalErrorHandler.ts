/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler } from 'express';
import config from '../../config';
import { IGenericErrorMessage } from '../../interfaces/error';
import handleValidationError from '../../errors/handleValidationError';
import ApiError from '../../errors/ApiError';
import { errorLogger } from '../../shared/logger';
import { ZodError } from 'zod';
import handleZodValidationError from '../../errors/handleZodValidationError';
import handleCastError from '../../errors/handleCastError';
import handleDuplicateError from '../../errors/handleDuplicateError';
import handleJWTError from '../../errors/handleJWTError';
import { MulterError } from 'multer';
import handleMulterError from '../../errors/handleMulterError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // config.env === 'development'
  //   ? console.log('globalErrorHandler ~ ', err)
  //   : err instanceof Error
  //   ? errorLogger.error(err.stack)
  //   : errorLogger.error(err)

  if (config.env === 'development') {
    console.log('globalErrorHandler ~ ', err);
  } else {
    if (err?.name === 'ValidationError' || err instanceof ApiError) {
      errorLogger.error(err);
    } else if (err instanceof Error) {
      errorLogger.error(err?.stack || err);
    }
  }

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];

  if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof ZodError) {
    const simplifiedError = handleZodValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = err?.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : [];
  } else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err.name === 'MongoServerError') {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (
    err.name === 'TokenExpiredError' ||
    err.name === 'JsonWebTokenError'
  ) {
    const simplifiedError = handleJWTError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof MulterError) {
    const simplifiedError = handleMulterError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof Error) {
    message;
    errorMessages = message
      ? [
          {
            path: '',
            message: message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    // eslint-disable-next-line no-undefined
    stack: config.env !== 'production' ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
