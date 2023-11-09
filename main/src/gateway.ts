import * as httpProxy from 'http-proxy';
import { IncomingMessage, ServerResponse } from 'http';

const httpProxyAny = httpProxy as any;
const gateway = httpProxyAny.createProxyServer({});
const chatServiceProxy = httpProxyAny.createProxyServer({ target: 'http://localhost:5006' });
gateway.on('error', (err: Error, req: IncomingMessage, res: ServerResponse) => {
  console.error('Error occurred while proxying:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error: ' + err.message);
});

const userMicroservice: string = 'http://localhost:5001';
const categoryMicroservice: string = 'http://localhost:5002';
const uploadMicroservice: string = 'http://localhost:5003';
const productMicroservice: string = 'http://localhost:5004';
const rentingMicroservice: string = 'http://localhost:5005';
const chatMicroservice: string = 'http://localhost:5006';

// user microservice
const user = (req: IncomingMessage, res: ServerResponse) => {
  console.log('Routing to user microservice', req.url);
  gateway.web(req, res, { target: userMicroservice });
};

// category microservice
const category = (req: IncomingMessage, res: ServerResponse) => {
  console.log('Routing to category microservice', req.url);
  gateway.web(req, res, { target: categoryMicroservice });
};

const upload = (req: IncomingMessage, res: ServerResponse) => {
  console.log('Routing to upload microservice', req.url);
  gateway.web(req, res, { target: uploadMicroservice });
};

// product microservice
const product = (req: IncomingMessage, res: ServerResponse) => {
  console.log('Routing to product microservice', req.url);
  gateway.web(req, res, { target: productMicroservice });
};

// renting microservice
const renting = (req: IncomingMessage, res: ServerResponse) => {
  console.log('Routing to renting microservice', req.url);
  gateway.web(req, res, { target: rentingMicroservice });
};

// chat microservice
const chat = (req: IncomingMessage, res: ServerResponse) => {
  console.log('Routing to chat microservice', req.url);
  chatServiceProxy.ws(req, res);
};

export { user, category, upload, product, renting, chat };
