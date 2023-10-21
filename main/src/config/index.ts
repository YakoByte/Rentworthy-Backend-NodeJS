import dotEnv from "dotenv";
dotEnv.config();

export const PORT: string | undefined = process.env.PORT;