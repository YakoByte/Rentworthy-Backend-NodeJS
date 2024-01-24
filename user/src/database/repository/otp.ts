import { otpModel, historyModel, userModel } from "../models";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../../utils";

import { otpRequest } from "../../interface/otp";
import { sendEmail } from "../../template/emailTemplate";
class OTPRepository {
  //create otp
  async CreateOTP(otpInputs: otpRequest) {
    try {
      console.log(otpInputs);
      
      // Check 5 times to get OTP from the same IP and (email or phoneNo)
      const findOTP = await otpModel.find({
        $and: [
          { email: otpInputs.email },
          { phoneNo: otpInputs.phoneNo },
          { ipAddress: otpInputs.ipAddress },
        ],
        isUsed: false,
      });
  
      console.log("findOTP", findOTP);
  
      if (findOTP.length >= 5) {
        return { message: "You have reached the maximum limit of OTPs. Try again after 24 hours." };
      }
  
      // If 24 hours have passed since OTP creation and not used, then delete OTP
      const findOTP24 = await otpModel.deleteMany({
        $or: [{ email: otpInputs.email }, { phoneNo: otpInputs.phoneNo }, { ipAddress: otpInputs.ipAddress }],
        createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });
  
      // Generate a random OTP with 6 digits
      let newOtp: number = Math.floor(100000 + Math.random() * 900000);
  
  
      // Create OTP
      const otp = new otpModel({ ...otpInputs, otp: newOtp });
  
      if (otpInputs.email) {
        // Send email with OTP
        const emailOptions = {
          toUser: otpInputs.email,
          subject: "OTP Verification",
          templateVariables: { otp: newOtp.toString() },
        };
  
        sendEmail(emailOptions);
      }
  
  
      const otpResult = await otp.save();
  
      // Create history entry
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
  
      return { message: "OTP Sent" };
    } catch (error) {
      console.error("error", error);
      throw new Error("Unable to create OTP");
    }
  }

  //verify otp
  async VerifyOTP(otpInputs: otpRequest) {
    try {
      console.log("otpInputs", otpInputs);
      const existingOTP: any = await otpModel.findOne({
        $or: [{ email: otpInputs.email }, { phoneNo: otpInputs.phoneNo }],
        otp: otpInputs.otp,
        isUsed: false,
      });

      if (existingOTP) {
        const otpResult = await otpModel.updateMany(
          {
            $or: [{ email: otpInputs.email }, { phoneNo: otpInputs.phoneNo }],
          },
          { $set: { isUsed: true } }
        );

        if (otpInputs.email) {
          await userModel.updateOne(
            { email: existingOTP.email, isEmailVerified: true },
            { new: true }
          );
        } else if (otpInputs.phoneNo) {
          await userModel.updateOne(
            { phoneNo: existingOTP.phoneNo, isPhoneNoVerified: true },
            { new: true }
          );
        }

        console.log("otpResult", otpResult);
        const token = await GenerateSignature({
          user: otpInputs.email ? existingOTP.email : existingOTP.phoneNo,
          _id: existingOTP._id,
        });
        return token;
      } else {
        return false;
      }
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Verify OTP");
    }
  }
}

export default OTPRepository;
