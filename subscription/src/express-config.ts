// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import subscription from './api/subscription';
import subscribedUsed from './api/subscribedUsed';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cors({
    origin: "*",
    credentials: true,
  }));

  // API
  subscription(app);
  subscribedUsed(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
