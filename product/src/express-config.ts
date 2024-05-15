// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import product from './api/product.ts';
import productlike from './api/productlike.ts';
import productrating from './api/productrating.ts';
import productreview from './api/productreview.ts';
import Complain from './api/complain.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors({
    origin: "*",
    credentials: true,
  }));

  // API
  product(app);
  productlike(app);
  productrating(app);
  productreview(app);
  Complain(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
