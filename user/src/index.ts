// index.ts

import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import { configureExpress } from './express-config.ts'; // Import the module
import databaseConnection from './database/connection.ts';

const StartServer = async (): Promise<void> => {
    const app: Express = express();

    // Connect to the database
    try {
        await databaseConnection(); // Assuming this function returns a promise
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }

    // Configure Express app using the module
    await configureExpress(app);

    // Define a simple root route
    app.get('/', (req: Request, res: Response) => {
        console.log("Called");
        res.status(200).send({ message: 'User microservices called........' });
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
