// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import product from './api/product.ts';
import productlike from './api/productlike.ts';
import productrating from './api/productrating.ts';
import productreview from './api/productreview.ts';
import productreservation from './api/productreservation.ts';
// import subcategory from './api/subcategory.ts';
// import Admin from './api/user.ts';
// import Role from './api/role.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());

  // API
  // subcategory(app);
  product(app);
  productlike(app);
  productrating(app);
  productreview(app);
  productreservation(app);

  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
