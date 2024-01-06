// index.ts

import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import { configureExpress } from './express-config'; // Removed ".ts" extension
import databaseConnection from './database/connection'; // Removed ".ts" extension

import http from 'http';
import { Server as SocketIOServer } from 'socket.io'; // Renamed to prevent naming collision with http.Server
// import { setupSocketServer } from './api/chat';

const startServer = async (): Promise<void> => {
    const app: Express = express();
    // socket setup


    // Connect to the database
    try {
        await databaseConnection(); // Assuming this function returns a promise
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }

    // Configure Express app
    configureExpress(app); // This should not be async unless the function actually returns a promise

    // Setup socket server

    const server = http.createServer(app);
    // const io = new SocketIOServer(server, {
    //     cors: {
    //         origin: '*', // Be cautious with this in production
    //     }
    // });
    // setupSocketServer(io);

    // Define a simple root route
    app.get('/', (req: Request, res: Response) => {
        res.status(200).send({ message: 'Chat microservice is running...' });
    });

    // Start the Express server
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    }).on('error', (err: NodeJS.ErrnoException) => {
        console.error('Server error:', err);
        process.exit(1);
    });
};

startServer().catch(error => {
    console.error('Failed to start the server:', error);
});
