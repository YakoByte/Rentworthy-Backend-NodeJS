import * as httpProxy from 'http-proxy';
import { IncomingMessage, ServerResponse } from 'http';

const httpProxyAny = httpProxy as any;
const gateway = httpProxyAny.createProxyServer({});

gateway.on('error', (err: Error, req: IncomingMessage, res: ServerResponse) => {
  console.error('Error occurred while proxying:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error: ' + err.message);
});

const userMicroservice: string = 'http://localhost:5001';
const categoryMicroservice: string = 'http://localhost:5002';

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

export { user, category };
