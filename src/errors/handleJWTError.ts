import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const handleJWTError = (err: JsonWebTokenError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [];
  errors.push({
    path: err.name,
    message: err.message,
  });

  const statusCode = StatusCodes.UNAUTHORIZED;
  return {
    statusCode,
    message: 'JWT Error',
    errorMessages: errors,
  };
};

export default handleJWTError;
