"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.social = exports.payment = exports.chatApi = exports.renting = exports.product = exports.upload = exports.category = exports.user = void 0;
const httpProxy = __importStar(require("http-proxy"));
const httpProxyAny = httpProxy;
const gateway = httpProxyAny.createProxyServer();
gateway.on("error", (err, req, res) => {
    console.error("Error occurred while proxying:", err);
    res.writeHead(500, {
        "Content-Type": "text/plain",
    });
    res.end("Proxy error: " + err.message);
});
const userMicroservice = "http://user:5001";
const categoryMicroservice = "http://category:5002";
const uploadMicroservice = "http://upload:5003";
const productMicroservice = "http://product:5004";
const rentingMicroservice = "http://renting:5005";
const chatMicroservice = "http://chat:5006";
const paymentMicroservice = "http://payment:5007";
const cancellationMicroservice = "http://cancellation:5008";
const socialMicroservice = "http://social:5009";
// User microservice
const user = (req, res) => {
    console.log("Routing to user microservice", req.url);
    gateway.web(req, res, { target: userMicroservice });
};
exports.user = user;
// Category microservice
const category = (req, res) => {
    console.log("Routing to category microservice", req.url);
    gateway.web(req, res, { target: categoryMicroservice });
};
exports.category = category;
// Upload microservice
const upload = (req, res) => {
    console.log("Routing to upload microservice", req.url);
    gateway.web(req, res, { target: uploadMicroservice });
};
exports.upload = upload;
// Product microservice
const product = (req, res) => {
    console.log("Routing to product microservice", req.url);
    gateway.web(req, res, { target: productMicroservice });
};
exports.product = product;
// Renting microservice
const renting = (req, res) => {
    console.log("Routing to renting microservice", req.url);
    gateway.web(req, res, { target: rentingMicroservice });
};
exports.renting = renting;
// Chat microservice
const chatApi = (req, res) => {
    console.log("Routing to chat microservice", req.url);
    gateway.web(req, res, { target: chatMicroservice });
};
exports.chatApi = chatApi;
//payment microservice
const payment = (req, res) => {
    console.log("Routing to payment microservice", req.url);
    gateway.web(req, res, { target: paymentMicroservice });
};
exports.payment = payment;
//social microservice
const social = (req, res) => {
    console.log("Routing to social microservice", req.url);
    gateway.web(req, res, { target: socialMicroservice });
};
exports.social = social;
const cancelBooking = (req, res) => {
    console.log("Routing to social microservice", req.url);
    gateway.web(req, res, { target: cancellationMicroservice });
};
exports.cancelBooking = cancelBooking;
