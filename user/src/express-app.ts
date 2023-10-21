import express, { Express } from 'express';
import cors from 'cors';
// import { Admin } from './api';
// import { Other } from './api';
// import { Buyer } from './api';
// import { Seller } from './api';
import HandleErrors from './utils/error-handler';

export default async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
//   app.use(express.static(__dirname + '/public');

  // API
//   Admin(app);
//   Seller(app);
//   Buyer(app);
//   Other(app);

  // Error handling
  app.use(HandleErrors);
};
