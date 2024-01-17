import * as httpProxy from "http-proxy";
import { IncomingMessage, ServerResponse } from "http";

const httpProxyAny = httpProxy as any;
const gateway = httpProxyAny.createProxyServer();

gateway.on("error", (err: Error, req: IncomingMessage, res: ServerResponse) => {
  console.error("Error occurred while proxying:", err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Proxy error: " + err.message);
});

const userMicroservice: string = "http://localhost:5001";
const categoryMicroservice: string = "http://localhost:5002";
const uploadMicroservice: string = "http://localhost:5003";
const productMicroservice: string = "http://localhost:5004";
const rentingMicroservice: string = "http://localhost:5005";
const chatMicroservice: string = "http://localhost:5006";
const paymentMicroservice: string = "http://localhost:5007";
const cancellationMicroservice: string = "http://localhost:5008";
const socialMicroservice: string = "http://localhost:5009";

// User microservice
const user = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to user microservice", req.url);
  gateway.web(req, res, { target: userMicroservice });
};

// Category microservice
const category = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to category microservice", req.url);
  gateway.web(req, res, { target: categoryMicroservice });
};

// Upload microservice
const upload = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to upload microservice", req.url);
  gateway.web(req, res, { target: uploadMicroservice });
};

// Product microservice
const product = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to product microservice", req.url);
  gateway.web(req, res, { target: productMicroservice });
};

// Renting microservice
const renting = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to renting microservice", req.url);
  gateway.web(req, res, { target: rentingMicroservice });
};

// Chat microservice
const chatApi = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to chat microservice", req.url);
  gateway.web(req, res, { target: chatMicroservice });
};

//payment microservice
const payment = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to payment microservice", req.url);
  gateway.web(req, res, { target: paymentMicroservice });
};

//social microservice
const social = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to social microservice", req.url);
  gateway.web(req, res, { target: socialMicroservice });
};

const cancelBooking = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to social microservice", req.url);
  gateway.web(req, res, { target: cancellationMicroservice });
};

export { user, category, upload, product, renting, chatApi, payment, social, cancelBooking };
