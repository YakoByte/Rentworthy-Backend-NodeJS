// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import ads from './api/ads.ts';
import recommendation from './api/recommendation.ts';
import contactus from './api/contactus.ts';
import termCondition from './api/termCondition.ts';
import privacyPolicy from './api/privacyPolicy.ts';
import AboutUs from './api/aboutUs.ts';
import notification from './api/notification.ts';
import adminADS from './api/adminADS.ts';
import banner from './api/banner.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors({
    origin: "*",
    credentials: true,
  }));

  // API
  // wishlist(app);
  ads(app);
  recommendation(app);
  notification(app);
  contactus(app);
  termCondition(app);
  privacyPolicy(app);
  AboutUs(app);
  adminADS(app);
  banner(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
