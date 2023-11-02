import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';

const handleDuplicateError = (err: mongoose.mongo.MongoServerError) => {
  const errors: IGenericErrorMessage[] = [];
  if (err.code === 11000) {
    errors.push({
      path: Object.keys(err.keyPattern)[0],
      message: `Your provided ${
        Object.keys(err.keyPattern)[0]
      } already exists!`,
    });
  }

  const statusCode = err.code === 11000 ? 400 : 500;
  return {
    statusCode,
    message:
      err.code === 11000 ? 'Duplicate Key Error' : 'Something went wrong!',
    errorMessages: errors,
  };
};

export default handleDuplicateError;
