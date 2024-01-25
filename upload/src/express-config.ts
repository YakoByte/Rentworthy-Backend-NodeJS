// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import imageUpload from './api/imageUpload.ts';

export const configureExpress = async (app: Express) => {
  app.use(cors({
    origin: "*",
    credentials: true,
  }));

  // API
  imageUpload(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
