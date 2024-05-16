import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDER_PHONE } from "../config";

interface SMSOptions {
  toUser: string;
  templateVariables: { [key: string]: string };
}

export async function sendSMS(options: SMSOptions): Promise<void> {
  const accountId = TWILIO_ACCOUNT_SID;
  const authToken = TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountId, authToken);  

  // Define the sms content with template variables
  const smsOption = {
    from: SENDER_PHONE,
    to: '+917902607594',
    body: `Your OTP: *${options.templateVariables.otp}*. This OTP is valid for a single use and will expire in 24 hours.`,
  };    

  // Send sms using Twillo
  await client.messages
    .create(smsOption)
    .then((response: any) => {
      console.log("SMS sent successfully. ", response);
    })
    .catch((error: any) => {
      console.error("SMS sending failed: ", error);
    });
}
