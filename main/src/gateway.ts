import * as httpProxy from "http-proxy";
import { IncomingMessage, ServerResponse } from "http";

const httpProxyAny = httpProxy as any;
const gateway = httpProxyAny.createProxyServer({});
const chatServiceProxy = httpProxyAny.createProxyServer({
  target: "http://chat:5006",
});
gateway.on("error", (err: Error, req: IncomingMessage, res: ServerResponse) => {
  console.error("Error occurred while proxying:", err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Proxy error: " + err.message);
});

const userMicroservice: string =
  "http://localhsot:5001";
const categoryMicroservice: string =
 
  "http://localhsot:5002";
const uploadMicroservice: string =
  "http://upload:5004";
const productMicroservice: string =
  "http://product:5003";
const rentingMicroservice: string =
  "http://renting:5008";
const paymentMecrsarece: string =
  "http://payment:5012";
const socialMicroservice: string =
  "http://social:5001";
const cancellationMicroservice: string =
  "http://cancellation:5008";

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
  gateway.web(req, res, { target: chatServiceProxy });
};

//payment microservice
const payment = (req: IncomingMessage, res: ServerResponse) => {
  console.log("Routing to payment microservice", req.url);
  gateway.app(req, res, { target: paymentMecrsarece });
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
