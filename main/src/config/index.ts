import dotEnv from "dotenv";
dotEnv.config();

export const PORT: string | undefined = process.env.PORT || '';
export const DATABASE: string | undefined = process.env.DATABASE || '';
export const SECRET_KEY: string | undefined = process.env.SECRET_KEY || '';