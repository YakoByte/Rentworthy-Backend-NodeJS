import { Server, Socket } from 'socket.io';
import RoomService from '../services/room';
import ChatService from '../services/messages';
import UserAuth from '../middlewares/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { AuthenticatedRequest, roomRequest, roomData, getRoomRequest, deleteRoomRequest } from '../interface/room'
import { messageRequest, getMessageRequest, deleteMessageRequest } from '../interface/messages'

interface AuthenticatedSocket extends Socket {
    user: JwtPayload;
}

export function setupSocketServer(io: Server) {
    const roomService = new RoomService();
    const chatService = new ChatService();
    // Authentication middleware that will be used to authenticate socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        // console.log("token", token)
        if (!token) {
            return next(new Error('Authentication error. Token missing.'));
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY as string) as JwtPayload;
            // console.log("decoded", decoded)
            // Wrapping the socket with user information
            const authenticatedSocket: AuthenticatedSocket = Object.assign(socket, { user: decoded });

            // Assign the modified socket back
            socket = authenticatedSocket;

            next();
        } catch (error) {
            return next(new Error('Authentication error. Invalid token.'));
        }
    });
    // socket connection
    io.on('connection', (socket: any) => {

        console.log('A user connected', socket);
        //create a room
        socket.on('createRoom', async (roomDetail: roomRequest) => {
            console.log(roomDetail);
            const data: any = await roomService.CreateRoom(roomDetail);
            console.log("data", data);
            socket.join(data._id);
            socket.emit('roomCreated', data);
            console.log('room created');
        });
        //join a room
        socket.on('joinRoom', async (roomDetail: getRoomRequest) => {
            const data: any = await roomService.GetRoom(roomDetail);
            console.log(data);
            socket.join(data._id);
            socket.emit('roomJoined', data);
            console.log('room joined');
        });

        //get all rooms
        socket.on('getRooms', async (roomDetail: roomRequest) => {
            const data: any = await roomService.GetRooms(roomDetail);
            console.log(data);
            socket.emit('rooms', data);
            console.log('rooms');
        });

        // new message
        socket.on('newMessage', async (message: any) => {
            console.log(message);
            let roomDetail: messageRequest = { ...message, senderId: socket.user._id }
            const data: any = await chatService.CreateMessage(roomDetail);
            console.log(data);
            // socket.to(data.roomId).emit('newMessages', data);
            io.in(data.roomId).emit('newMessages', data);

            socket.emit('newMessages', data);
        });

        // group message in multiple room
        socket.on('groupMessage', async (message: any) => {
            console.log(message);
            let roomDetail: messageRequest = { ...message, senderId: socket.user._id }
            const data: any = await chatService.GroupMessage(roomDetail);
            console.log(data);
            // socket.to(data.roomId).emit('newMessages', data);
            io.in(data.roomId).emit('newMessages', data);

            socket.emit('newMessages', data);
        });

        // get history
        socket.on('getHistory', async (message: any) => {
            let roomDetail: getRoomRequest = { roomId: message.roomId }
            const data: any = await chatService.GetMessages(roomDetail);
            console.log(data);
            socket.emit('history', data);
            console.log('history');
        });

        // delete message 
        socket.on('deleteMessage', async (message: any) => {
            console.log(message);
            let roomDetail: deleteRoomRequest = { _id: message._id }
            const data: any = await chatService.DeleteMessage(roomDetail);
            socket.to(message.roomId).emit('deleteMessage', message);
        });
    });
}