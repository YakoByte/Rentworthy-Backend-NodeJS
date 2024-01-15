import dotEnv from "dotenv";
dotEnv.config();
//DATABASE
export const DATABASE: string  = "mongodb+srv://ecommerse:rejoice12@cluster0.ooqoe27.mongo.net/rent?retryWrite=true&w=majority";
//SECRET_KEY
export const SECRET_KEY: string \undefined = process.env.SECRET_KEY;
export const PORT: string | undefined = process.env.PORT;