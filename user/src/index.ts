import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import expressApp from './express-app';
import databaseConnection from './database/connection';

const StartServer = async () => {
    const app: Express = express();

    await databaseConnection()
    await expressApp(app);

    app.get('/', (req: Request, res: Response) => {
        res.status(200).send({ message: 'User microservices called........' });
    });

    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    }).on('error', (err: NodeJS.ErrnoException) => {
        console.error(err);
        process.exit(1);
    });
};

StartServer();
