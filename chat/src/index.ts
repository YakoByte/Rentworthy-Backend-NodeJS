// index.ts

import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import { configureExpress } from './express-config';

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './database';
import helmet from 'helmet';
// import { setupSocketServer } from './api/chat';

const startServer = async (): Promise<void> => {
    
    // check if uploads folder exists
    const fs = require('fs');
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const app: Express = express();
    // socket setup


    // Connect to the database
    await connectDB();

    // Configure Express app
    configureExpress(app); 

    // Use Helmet!
    app.use(helmet());

    // Setup socket server
    const server = http.createServer(app);
    // const io = new SocketIOServer(server, {
    //     cors: {
    //         origin: '*', // Be cautious with this in production
    //     }
    // });
    // setupSocketServer(io);

    // Define a simple root route
    console.log("called");
    app.get('/', (req: Request, res: Response) => {
        res.status(200).send({ message: 'Chat microservice is running.....' });
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
