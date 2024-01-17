// index.ts

import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import { configureExpress } from './express-config.ts'; // Import the module
import databaseConnection from './database/connection.ts';
import { connectDB } from './database/index.ts';

const StartServer = async (): Promise<void> => {
    const app: Express = express();

    // Connect to the database
    await connectDB();

    // Configure Express app using the module
    await configureExpress(app);

    // Define a simple root route
    console.log("Called")
    app.get('/', (req: Request, res: Response) => {
        console.log("Called");
        res.status(200).send({ message: 'Upload microservices called........' });
    });

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    }).on('error', (err: NodeJS.ErrnoException) => {
        console.error('Server error:', err);
        process.exit(1);
    });
};

StartServer();
