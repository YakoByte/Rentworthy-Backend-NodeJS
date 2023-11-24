// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
// import wishlist from './api/wishlist.ts';
import booking from './api/ads.ts';
// import Admin from './api/user.ts';
// import Role from './api/role.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());

  // API
  // wishlist(app);
  booking(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
