import dotEnv from "dotenv";
dotEnv.config();
//DATABASE
export const DATABASE: string | undefined = "mongodb+srv://ecommerce:rejoice123@cluster0.ooqoe24.mongodb.net/rent?retryWrites=true&w=majority";
//SECRET_KEY
export const SECRET_KEY: string | undefined = process.env.SECRET_KEY;
export const PORT: string | undefined = process.env.PORT;