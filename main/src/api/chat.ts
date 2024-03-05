import { Server, Socket } from 'socket.io';
import RoomService from '../services/room';
import { Express, Request, Response, NextFunction } from 'express';
import ChatService from '../services/room';

export default (app: Express) => {
  const service = new ChatService();

    // API = create room Id
  app.post('/create-rooms',  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.CreateRoom(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = get room Id
  app.get('/get-rooms',  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.GetRoom(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};