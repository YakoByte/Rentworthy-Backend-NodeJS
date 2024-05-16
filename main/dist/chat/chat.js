"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketServer = void 0;
const room_1 = __importDefault(require("../services/room"));
const messages_1 = __importDefault(require("../services/messages"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function setupSocketServer(io) {
    const roomService = new room_1.default();
    const chatService = new messages_1.default();
    // Authentication middleware that will be used to authenticate socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        if (!token) {
            return next(new Error('Authentication error. Token missing.'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
            const authenticatedSocket = Object.assign(socket, { user: decoded });
            // Assign the modified socket back
            socket = authenticatedSocket;
            next();
        }
        catch (error) {
            return next(new Error('Authentication error. Invalid token.'));
        }
    });
    // socket connection
    io.on('connection', (socket) => {
        console.log('A user connected', socket);
        //create a room
        socket.on('createRoom', async (roomDetail) => {
            console.log(roomDetail);
            const data = await roomService.CreateRoom(roomDetail);
            console.log("data", data);
            socket.join(data._id);
            socket.emit('roomCreated', data);
            console.log('room created');
        });
        //join a room
        socket.on('joinRoom', async (roomDetail) => {
            const data = await roomService.GetRoom(roomDetail);
            console.log(data);
            socket.join(data._id);
            socket.emit('roomJoined', data);
            console.log('room joined');
        });
        //get all rooms
        socket.on('getRooms', async (roomDetail) => {
            const data = await roomService.GetRooms(roomDetail);
            console.log(data);
            socket.emit('rooms', data);
            console.log('rooms');
        });
        // new message
        socket.on('newMessage', async (message) => {
            console.log(message);
            let roomDetail = { ...message, senderId: socket.user._id };
            const data = await chatService.CreateMessage(roomDetail);
            console.log(data);
            // socket.to(data.roomId).emit('newMessages', data);
            io.in(data.roomId).emit('newMessages', data);
            socket.emit('newMessages', data);
        });
        // group message in multiple room
        socket.on('groupMessage', async (message) => {
            console.log(message);
            let roomDetail = { ...message, senderId: socket.user._id };
            const data = await chatService.GroupMessage(roomDetail);
            console.log(data);
            // socket.to(data.roomId).emit('newMessages', data);
            io.in(data.roomId).emit('newMessages', data);
            socket.emit('newMessages', data);
        });
        // get history
        socket.on('getHistory', async (message) => {
            let roomDetail = { roomId: message.roomId };
            const data = await chatService.GetMessages(roomDetail);
            console.log(data);
            socket.emit('history', data);
            console.log('history');
        });
        // delete message 
        socket.on('deleteMessage', async (message) => {
            console.log(message);
            let roomDetail = { _id: message._id };
            const data = await chatService.DeleteMessage(roomDetail);
            socket.to(message.roomId).emit('deleteMessage', message);
        });
    });
}
exports.setupSocketServer = setupSocketServer;
