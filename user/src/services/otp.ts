import OTPRepository from '../database/repository/otp';
import { FormateData, FormateError } from '../utils';
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

            if(!existingOTP){
                throw Error('Something went wrong while creating OTP');
            }


            return FormateData(existingOTP);
        } catch (err: any) {
            return FormateError({ error: "Failed To Create OTP" });
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

            if(!existingOTP){
                throw new Error('Verification Failed')
            }

            return FormateData({ message: "OTP is verified", token: existingOTP });
        } catch (err: any) {
            return FormateError({ error: "Failed To Verify OTP" });
        }
    }
}

export = OTPService;
