import { Server, Socket } from 'socket.io';
import RoomService from '../services/room';
import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import ChatService from '../services/room';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { AuthenticatedRequest, roomRequest, roomData, getRoomRequest, deleteRoomRequest } from '../interface/room'
// import { messageRequest, getMessageRequest, deleteMessageRequest } from '../interface/messages'

// interface AuthenticatedSocket extends Socket {
//   user: JwtPayload;
// }

export default (app: Express) => {
  const service = new ChatService();
  // API = verify stripe Id
  app.get('/get-rooms',  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.GetRoom(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};