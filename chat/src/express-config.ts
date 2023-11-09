// express-config.ts

import express, { Express } from 'express';
import cors from 'cors';
import HandleErrors from './utils/error-handler';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocketServer } from './api/chat';
// import { setupSocketServer } from './sockets';
// import Admin from './api/user.ts';
// import Role from './api/role.ts';

export const configureExpress = async (app: Express) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  // socket setup
  const server = http.createServer(app);
  const io = new Server(server);
  setupSocketServer(io);
  // Error handling
  app.use(HandleErrors);
};

export default configureExpress;
