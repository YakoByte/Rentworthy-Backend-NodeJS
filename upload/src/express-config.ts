// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import imageUpload from './api/imageUpload.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
