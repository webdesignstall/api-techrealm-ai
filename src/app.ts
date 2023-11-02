import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const rfs = require('rotating-file-stream');
/*import path from 'path';
import morgan from 'morgan';*/

/*const accessLogStream = rfs.createStream('', {
  interval: '1d', // rotate daily
  path: path.join(process.cwd(), 'logs', 'api-access.log'),
});*/

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*app.use(
  morgan(':date :method :url :status :response-time :user-agent', {
    stream: accessLogStream,
  })
);*/
// Application routes
app.use('/uploads', express.static('uploads'));

app.use('/api/v1', routes);

app.get('/', async (req: Request, res: Response) => {
  res.send('Welcome to Tech RealM Ai api');
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api Not Found',
      },
    ],
  });
  next();
});

export default app;
