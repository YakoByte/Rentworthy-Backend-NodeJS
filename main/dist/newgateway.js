"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.social = exports.payment = exports.chatApi = exports.renting = exports.product = exports.upload = exports.category = exports.user = void 0;
const http_proxy_1 = require("http-proxy");
const gateway = (0, http_proxy_1.createProxyServer)();
const userMicroservice = "http://localhost:5001";
const categoryMicroservice = "http://localhost:5002";
const uploadMicroservice = "http://localhost:5003";
const productMicroservice = "http://localhost:5004";
const rentingMicroservice = "http://localhost:5005";
const chatMicroservice = "http://localhost:5006";
const paymentMicroservice = "http://localhost:5007";
const cancellationMicroservice = "http://localhost:5008";
const socialMicroservice = "http://localhost:5009";
const proxyRequest = (target, req, res) => {
    try {
        gateway.web(req, res, { target });
    }
    catch (error) {
        res.end("Proxy error: " + error.message);
    }
};
const user = (req, res) => {
    proxyRequest(userMicroservice, req, res);
};
exports.user = user;
const category = (req, res) => {
    proxyRequest(categoryMicroservice, req, res);
};
exports.category = category;
const upload = (req, res) => {
    proxyRequest(uploadMicroservice, req, res);
};
exports.upload = upload;
const product = (req, res) => {
    proxyRequest(productMicroservice, req, res);
};
exports.product = product;
const renting = (req, res) => {
    proxyRequest(rentingMicroservice, req, res);
};
exports.renting = renting;
const chatApi = (req, res) => {
    proxyRequest(chatMicroservice, req, res);
};
exports.chatApi = chatApi;
const payment = (req, res) => {
    proxyRequest(paymentMicroservice, req, res);
};
exports.payment = payment;
const cancelBooking = (req, res) => {
    proxyRequest(cancellationMicroservice, req, res);
};
exports.cancelBooking = cancelBooking;
const social = (req, res) => {
    proxyRequest(socialMicroservice, req, res);
};
exports.social = social;
