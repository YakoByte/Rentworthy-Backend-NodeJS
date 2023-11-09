import { Express, Request, Response, NextFunction } from 'express';
import ImageService from '../services/imageUpload';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/imageUpload';
import upload from '../middlewares/imageStorage';
import { Server, Socket } from 'socket.io';
// import { validateCreateAdmin } from './adminValidation';

export function setupSocketServer(io: Server) {
    const service = new ImageService();
    io.on('connection', (socket: Socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        // socket.on('chat message', async (msg: any) => {
        //     console.log('message: ' + msg);
        //     // const data = await service.CreateImage({ image: msg });
        //     io.emit('chat message', data);
        // });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

};
