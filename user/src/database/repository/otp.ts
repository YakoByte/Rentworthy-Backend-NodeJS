import { otpModel, historyModel } from "../models";
import {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { otpRequest } from "../../interface/otp";
import { sendEmail } from "../../template/emailTemplate";
class OTPRepository {
    //create otp
    async CreateOTP(otpInputs: otpRequest) {

        // try {

        // check 5 time get otp from same ip and (email or phoneNo)
        const findOTP = await otpModel.find({
            $or:
                [
                    { email: otpInputs.email },
                    { phoneNo: otpInputs.phoneNo },
                    { ipAddress: otpInputs.ipAddress }
                ],
            isUsed: false
        });
        console.log("findOTP", findOTP)
        if (findOTP.length >= 5) {
            return FormateData({ message: "You have reached maximum limit of otp now try after 24 hours" });
        }

        //if 24 hours not used otp then delete otp
        const findOTP24 = await otpModel.deleteMany({
            $or:
                [
                    { email: otpInputs.email },
                    { phoneNo: otpInputs.phoneNo },
                ],
            ipAddress: otpInputs.ipAddress,
            createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
        // generate random otp with 6 digit
        let newOtp: number = Math.floor(100000 + Math.random() * 900000);
        // otpInputs.otp = newOtp;
        console.log("newOtp", newOtp)
        // create otp

        const otp = new otpModel({ ...otpInputs, otp: newOtp });
        if (otpInputs.email) {
            interface EmailOptions {
                toUser: string;
                subject: string;
                templateVariables: { [key: string]: string };
            }
            const options: EmailOptions = {
                toUser: otpInputs.email,
                subject: "otp varifation",
                templateVariables: { otp: newOtp.toString() }
            }
            sendEmail(options)
        }
        console.log("otp", otp)
        const otpResult = await otp.save();

        const history = new historyModel({
            otpId: otpResult._id,
            log: [
                {
                    objectId: otpResult._id,
                    email: otpResult.email,
                    ipAddress: otpResult.ipAddress,
                    action: `otpName = ${newOtp} created`,
                    date: new Date().toISOString(),
                    time: Date.now(),
                },
            ],
        });
        await history.save();

        return otpResult;


        // } catch (err) {
        //     throw new APIError(
        //         "API Error",
        //         STATUS_CODES.INTERNAL_ERROR,
        //         "Unable to Create User"
        //     );
        // }
    }

    //verify otp
    async VerifyOTP(otpInputs: otpRequest) {
        try {
            console.log("otpInputs", otpInputs)
            const existingOTP: any = await otpModel.findOne(
                {
                    $or:
                        [
                            { email: otpInputs.email },
                            { phoneNo: otpInputs.phoneNo },
                        ],
                    otp: otpInputs.otp,
                    isUsed: false
                }
            );
            console.log("existingOTP", existingOTP)
            if (existingOTP) {
                console.log("existingOTP ================")
                const otpResult = await otpModel.updateMany(
                    {
                        $or:
                            [
                                { email: otpInputs.email },
                                { phoneNo: otpInputs.phoneNo },
                            ],
                    },
                    { $set: { isUsed: true } }
                );
                console.log("otpResult", otpResult)

                return FormateData({ message: "otp is varified" });
            }
            else {
                return FormateData({ message: "otp is not varified" });
            }
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export default OTPRepository;
