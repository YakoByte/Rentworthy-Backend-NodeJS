import dotenv from "dotenv";
dotenv.config();

export const PORT: string | undefined = process.env.PORT;
export const DATABASE: string = "mongodb+srv://ecommerce:rejoice123@cluster0.ooqoe24.mongodb.net/rent?retryWrites=true&w=majority";
export const SECRET_KEY: string | undefined = "YAKOBYTE";

export const AWS_ACCESS_KEY_ID: string | undefined = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY: string | undefined = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_BUCKET_REGION: string | undefined = process.env.AWS_BUCKET_REGION;
export const AWS_BUCKET_NAME: string | undefined = process.env.AWS_BUCKET_NAME;