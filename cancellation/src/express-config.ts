// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import cancellationPlan from './api/cancellationPlan.ts';
import cancelBooking from './api/cancelBooking.ts';
// import Admin from './api/user.ts';
// import Role from './api/role.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());

  // API
  cancelBooking(app);
  cancellationPlan(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
