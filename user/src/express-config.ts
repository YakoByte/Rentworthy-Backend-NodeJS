// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import Admin from './api/admin.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());

  // API
  Admin(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
