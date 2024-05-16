"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const config_1 = require("../config");
async function sendSMS(options) {
    const accountId = config_1.TWILIO_ACCOUNT_SID;
    const authToken = config_1.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountId, authToken);
    // Define the sms content with template variables
    const smsOption = {
        from: config_1.SENDER_PHONE,
        to: options.toUser,
        body: `Your OTP: *${options.templateVariables.otp}*. This OTP is valid for a single use and will expire in 24 hours.`,
    };
    // Send sms using Twillo
    await client.messages
        .create(smsOption)
        .then((response) => {
        console.log("SMS sent successfully. ", response);
    })
        .catch((error) => {
        console.error("SMS sending failed: ", error);
    });
}
exports.sendSMS = sendSMS;
