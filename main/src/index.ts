import express, { Express, Request, Response } from 'express';
import { PORT } from './config';
import { product, user } from './gateway';
import { category } from './gateway';
import { upload } from './gateway';
import path from 'path';

const StartServer = async (): Promise<void> => {
  const app: Express = express();

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: "Microservices called........" });
  });

  // Use the reverse proxy server defined in the gateway module
  app.use('/app/api/v1/user', user);
  app.use('/web/api/v1/user', user);
  app.use('/web/api/v1/category', category);
  app.use('/app/api/v1/category', category);
  app.use('/web/api/v1/upload', upload)
  app.use('/app/api/v1/upload', upload)
  app.use('/web/api/v1/product', product)
  app.use('/app/api/v1/product', product)

  // 10mb limit for file upload
  app.use(express.json({ limit: '10mb' }));
  app.use(express.static(path.join(__dirname, '../../public'), {
    maxAge: '1d',
    etag: true,
    lastModified: true
  }));
  app.set('uploads', path.join(__dirname, '../../public'));

  // server listening
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  }).on('error', (err) => {
    console.log(err);
    process.exit(1);
  });
}

StartServer();