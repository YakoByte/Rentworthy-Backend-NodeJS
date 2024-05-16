import express, { Express, Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import { connectDB } from './database';
import { configureExpress } from './express-config';
import { setupSocketServer } from './chat/chat';
import { PORT } from './config';
import fs from 'fs';

const startServer = async (): Promise<void> => {
    try {
        // Check if the 'uploads' folder exists, create it if not
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Create an Express application
        const app: Express = express();

        // Connect to the database
        await connectDB();

        // Configure Express app
        configureExpress(app);

        // Use Helmet middleware for security
        app.use(helmet());

        // Setup socket server
        const server = http.createServer(app);
        const io = new SocketIOServer(server, {
            cors: {
                origin: '*',
            }
        });
        setupSocketServer(io);

        // Define a simple root route
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
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
