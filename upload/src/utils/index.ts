import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

const secret_key: string = SECRET_KEY || "";

// Utility functions
export const GenerateSalt = async (): Promise<string> => {
    return await bcrypt.genSalt(10);
};

export const GeneratePassword = async (password: string, salt: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (enteredPassword: string, savedPassword: string): Promise<boolean> => {
    // console.log(enteredPassword, savedPassword)
    return await bcrypt.compare(enteredPassword, savedPassword);
};

export const GenerateSignature = async (payload: any): Promise<string | Error> => {
    try {
        const token = await jwt.sign(payload, secret_key, { expiresIn: "10d" });
        return token;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const ValidateSignature = async (req: any): Promise<boolean> => {
    try {
        const token: string = req.headers.authorization;
        if (!token) return false;
        const splitToken: string = token.split(" ")[1];
        if(!splitToken) return false;
        const payload: any = await jwt.verify(splitToken, secret_key);
        req.user = payload;
        console.log("payload", payload);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

interface FormatData {
    data: any;
    success: boolean;
}

interface ErrorFormat {
    error: any;
    success: boolean;
}

export const FormateData = (data: any): FormatData => {
    return data
}

export const FormateError = (error: any): ErrorFormat => {
    return error
}
