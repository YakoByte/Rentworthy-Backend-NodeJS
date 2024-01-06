import OTPRepository from '../database/repository/otp';
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../utils';
import { APIError, BadRequestError } from '../utils/app-error';

import { otpRequest } from '../interface/otp';

// All Business logic will be here
class OTPService {
    private repository: OTPRepository;

    constructor() {
        this.repository = new OTPRepository();
    }
    // createing new otp
    async CreateNewOTP(otpInputs: otpRequest) {
        try {
            console.log("otpInputs", otpInputs)
            // check email or phone is coming from req
            if (!otpInputs.email && !otpInputs.phoneNo) {
                return FormateData({ message: "Email or PhoneNo is required" });
            }
            const existingOTP: any = await this.repository.CreateOTP(
                otpInputs
            );
            return FormateData({ existingOTP });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
    
    // verify otp
    async VerifyOTP(otpInputs: otpRequest) {
        try {
            console.log("otpInputs", otpInputs)
            // check email or phone is coming from req
            if (!otpInputs.email && !otpInputs.phoneNo) {
                return FormateData({ message: "Email or PhoneNo is required" });
            }
            const existingOTP: any = await this.repository.VerifyOTP(
                otpInputs
            );
            return FormateData({ existingOTP });
        } catch (err: any) {
            throw new APIError("Data Not found", err);
        }
    }
}

export = OTPService;
