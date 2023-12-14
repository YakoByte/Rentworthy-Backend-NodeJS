// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
// import wishlist from './api/wishlist.ts';
// import Admin from './api/user.ts';
// import Role from './api/role.ts';
import ads from './api/ads.ts';
import recommendation from './api/recommendation.ts';
import contactus from './api/contactus.ts';
import termCondition from './api/termCondition.ts';
import privacyPolicy from './api/privacyPolicy.ts';
import AboutUs from './api/aboutUs.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());

  // API
  // wishlist(app);
  ads(app);
  recommendation(app);
  contactus(app);
  termCondition(app);
  privacyPolicy(app);
  AboutUs(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
