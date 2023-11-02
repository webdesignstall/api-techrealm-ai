import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { infoLogger, errorLogger } from './shared/logger';
import { Server } from 'http';

const port = (config.port as string) || 8000;
let server: Server;

process.on('uncaughtException', err => {
  errorLogger.error(err);
  process.exit(1);
});

const boostrap = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    infoLogger.info(`DB is connected successfully`);
    server = app.listen(port, () => {
      infoLogger.info(`app listening on port ${port}`);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    errorLogger.error(err);
  }

  process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console

    if (server) {
      server.close(() => {
        errorLogger.error(err);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

boostrap().catch();

process.on('SIGINT', err => {
  infoLogger.info('SIGINT is received');
  server.close(() => {
    errorLogger.error(err);
    process.exit(0);
  });
});

process.on('SIGTERM', err => {
  infoLogger.info('SIGTERM is received');
  server.close(() => {
    errorLogger.error(err);
    process.exit(0);
  });
});
