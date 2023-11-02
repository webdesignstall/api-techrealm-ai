import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';
import { StatusCodes } from 'http-status-codes';
import { MulterError } from 'multer';

const handleMulterError = (err: MulterError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [];

  errors.push({
    path: err.code,
    message: err.message,
  });

  const statusCode = StatusCodes.BAD_REQUEST;
  return {
    statusCode,
    message: 'Multer Error',
    errorMessages: errors,
  };
};

export default handleMulterError;
