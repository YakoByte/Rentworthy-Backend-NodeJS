import { createProxyServer } from "http-proxy";
import { Request, Response } from "express";
import { IncomingMessage, ServerResponse } from "http";

const gateway = createProxyServer();

const userMicroservice: string = "http://localhost:5001";
const categoryMicroservice: string = "http://localhost:5002";
const uploadMicroservice: string = "http://localhost:5003";
const productMicroservice: string = "http://localhost:5004";
const rentingMicroservice: string = "http://localhost:5005";
const chatMicroservice: string = "http://localhost:5006";
const paymentMicroservice: string = "http://localhost:5007";
const cancellationMicroservice: string = "http://localhost:5008";
const socialMicroservice: string = "http://localhost:5009";
const subscriptionMicroservice: string = "http://localhost:5010";

const proxyRequest = (target: string, req: IncomingMessage, res: ServerResponse) => {
  try {    
    gateway.web(req, res, { target });    
  } catch (error: any) {
    res.end("Proxy error: " + error.message);
  }
};

const user = (req: Request, res: Response) => {
  proxyRequest(userMicroservice, req, res);
};

const category = (req: Request, res: Response) => {
  proxyRequest(categoryMicroservice, req, res);
};

const upload = (req: Request, res: Response) => {
  proxyRequest(uploadMicroservice, req, res);
};

const product = (req: Request, res: Response) => {
  proxyRequest(productMicroservice, req, res);
};

const renting = (req: Request, res: Response,) => {
  proxyRequest(rentingMicroservice, req, res);
};

const chatApi = (req: Request, res: Response) => {
  proxyRequest(chatMicroservice, req, res);
};

const payment = (req: Request, res: Response) => {
  proxyRequest(paymentMicroservice, req, res);
};

const cancelBooking = (req: Request, res: Response) => {
  proxyRequest(cancellationMicroservice, req, res);
};

const social = (req: Request, res: Response) => {
  proxyRequest(socialMicroservice, req, res);
};

const subscription = (req: Request, res: Response) => {
  proxyRequest(subscriptionMicroservice, req, res);
};

export {
  user,
  category,
  upload,
  product,
  renting,
  chatApi,
  payment,
  social,
  cancelBooking,
  subscription,
};
