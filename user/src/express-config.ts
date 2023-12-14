// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import Admin from './api/user.ts';
import Role from './api/role.ts';
import profile from './api/profile.ts';
import location from './api/location.ts';
import address from './api/address.ts';
import business from './api/business.ts';



export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());

  // API
  Admin(app);
  Role(app);
  profile(app);
  location(app);
  address(app);
  business(app)

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
