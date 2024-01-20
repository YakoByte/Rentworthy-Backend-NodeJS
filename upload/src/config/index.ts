import dotenv from "dotenv";
dotenv.config();

export const PORT: string | undefined = process.env.PORT;
export const DATABASE: string | undefined = process.env.DATABASE || '';
export const SECRET_KEY: string | undefined = process.env.SECRET_KEY || '';

export const AWS_ACCESS_KEY_ID: string | undefined = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY: string | undefined = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_BUCKET_REGION: string | undefined = process.env.AWS_BUCKET_REGION || '';
export const AWS_BUCKET_NAME: string | undefined = process.env.AWS_BUCKET_NAME || '';

export const GOOGLE_PASS: string | undefined = process.env.GOOGLE_PASS || '';
export const GOOGLE_EMAIL: string | undefined = process.env.GOOGLE_EMAIL || '';

export const GEOLOCATION_API_KEY: string | undefined = process.env.GEOLOCATION_API_KEY || '';