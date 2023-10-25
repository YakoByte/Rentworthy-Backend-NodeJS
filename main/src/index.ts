import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import { user } from './gateway';
import { category} from './gateway';

const StartServer = async (): Promise<void> => {
  const app: Express = express();

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: "Microservices called........" });
  });

  // Use the reverse proxy server defined in the gateway module
  app.use('/user',user);
  app.use('/category',category);
  // app.use('/product', gateway.product);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  }).on('error', (err) => {
    console.log(err);
    process.exit(1);
  });
}

StartServer();