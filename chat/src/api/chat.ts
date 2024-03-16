import { Server, Socket } from 'socket.io';
import MessageService from '../services/messages';
import { Express, Request, Response, NextFunction } from 'express';
import ChatService from '../services/room';
import UserAuth from '../middlewares/auth';

export default (app: Express) => {
  const chatService = new ChatService();
  const messageService = new MessageService();

    // API = create room Id
  app.post('/create-rooms', UserAuth,  async (req: any, res: Response, next: NextFunction) => {
    try {
      req.body.userId = req.user._id;
      const data = await chatService.CreateRoom(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = get room Id
  app.get('/get-rooms', UserAuth, async (req: any, res: Response, next: NextFunction) => {
    try {
      req.query.userId = req.user._id;
      const data = await chatService.GetRoom(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/create-message', UserAuth,  async (req: any, res: Response, next: NextFunction) => {
    try {
      req.body.senderId = req.user._id;
      const data = await messageService.CreateMessage(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = get room Id
  app.get('/get-message', UserAuth, async (req: any, res: Response, next: NextFunction) => {
    try {
      req.query.senderId = req.user._id;
      const data = await messageService.GetMessage(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};