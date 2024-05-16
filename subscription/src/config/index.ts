import dotenv from "dotenv";
dotenv.config();

export const PORT: string | undefined = process.env.PORT;
export const DATABASE: string | undefined = process.env.DATABASE || '';
export const SECRET_KEY: string | undefined = process.env.SECRET_KEY || '';

export const STRIPE_SECRET_KEY: string | undefined = process.env.STRIPE_SECRET_KEY || '';

export const AWS_ACCESS_KEY_ID: string | undefined = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY: string | undefined = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_BUCKET_REGION: string | undefined = process.env.AWS_BUCKET_REGION || '';
export const AWS_BUCKET_NAME: string | undefined = process.env.AWS_BUCKET_NAME || '';

export const GOOGLE_PASS: string | undefined = process.env.GOOGLE_PASS || '';
export const GOOGLE_EMAIL: string | undefined = process.env.GOOGLE_EMAIL || '';

export const SENDGRID_API_KEY: string | undefined = process.env.SENDGRID_API_KEY || '';

export const SENDER_EMAIL: string | undefined = process.env.SENDER_EMAIL;
export const SENDER_PHONE: string | undefined = process.env.SENDER_PHONE;

export const TWILIO_ACCOUNT_SID: string | undefined = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN: string | undefined = process.env.TWILIO_AUTH_TOKEN;

export const GEOLOCATION_API_KEY: string | undefined = process.env.GEOLOCATION_API_KEY || '';