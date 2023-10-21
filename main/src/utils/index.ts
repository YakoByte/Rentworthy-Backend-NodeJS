import jwt from "jsonwebtoken";
// import SECRET_KEY  from "../config/index";
let secret_key: string = "YAKOBYTE";
export const GenerateSignature = async (payload: any): Promise<string | Error> => {
    try {
        return await jwt.sign(payload, secret_key, { expiresIn: "30d" });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const ValidateSignature = async (req: any): Promise<boolean> => {
    try {
        const token: string = req.headers.authorization;
        // console.log(token);
        const splitToken: string = token.split(" ")[1];
        const payload: any = await jwt.verify(splitToken, secret_key);
        req.user = payload;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
