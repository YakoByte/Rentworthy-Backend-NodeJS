import dotenv from "dotenv";
dotenv.config();

export const PORT: string | undefined = process.env.PORT || '';
export const DATABASE: string | undefined = process.env.DATABASE || '';
export const SECRET_KEY: string | undefined = process.env.SECRET_KEY || '';

export const GOOGLE_PASS: string | undefined = process.env.GOOGLE_PASS || '';
export const GOOGLE_EMAIL: string | undefined = process.env.GOOGLE_EMAIL || '';