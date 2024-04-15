import { otpModel, historyModel, userModel } from "../models";
import { GenerateSignature } from "../../utils";

import { otpRequest } from "../../interface/otp";
import { sendEmail } from "../../template/emailTemplate";
import { sendSMS } from "../../template/smsTemplate";
class OTPRepository {
  //create otp
  async CreateOTP(otpInputs: otpRequest) {
    try {      
      // Check 5 times to get OTP from the same IP and (email or phoneNo)
      const findOTP = await otpModel.find({
        ipAddress: otpInputs.ipAddress,
        $or: [{ email: otpInputs.email }, { phoneNo: otpInputs.phoneNo }],
        isUsed: false,
      });
    
      if (findOTP.length >= 5) {
        return { message: "You have reached the maximum limit of OTPs. Try again after 24 hours." };
      }

      let otpResult: any;
  
      if (otpInputs.email) {
        // Generate a random OTP with 6 digits
        let newOtp: number = Math.floor(100000 + Math.random() * 900000);
  
        // Create OTP
        const otp = new otpModel({ ...otpInputs, otp: newOtp });
        otpResult = await otp.save();

        // Send email with OTP
        const emailOptions = {
          toUser: otpInputs.email,
          subject: "OTP Verification",
          templateVariables: { otp: newOtp.toString() },
        };
  
        sendEmail(emailOptions);

        // Create history entry
        const history = new historyModel({
          otpId: otpResult._id,
          log: [
            {
              objectId: otpResult._id,
              email: otpResult.email,
              ipAddress: otpResult.ipAddress,
              action: `otpName = ${newOtp} created for email`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
    
        await history.save();
      }

      if (otpInputs.phoneNo) {
        // Generate a random OTP with 6 digits
        let newOtp: number = Math.floor(100000 + Math.random() * 900000);
  
        // Create OTP
        const otp = new otpModel({ ...otpInputs, otp: newOtp });
        otpResult = await otp.save();
  
        // Send sms with OTP
        const smsOption = {
          toUser: otpInputs.phoneNo,
          templateVariables: { otp: newOtp.toString() },
        };

        sendSMS(smsOption);

        // Create history entry
        const history = new historyModel({
          otpId: otpResult._id,
          log: [
            {
              objectId: otpResult._id,
              email: otpResult.email,
              ipAddress: otpResult.ipAddress,
              action: `otpName = ${newOtp} created for phone`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
  
        await history.save();
      }
  
      return { message: "OTP Sent" };
    } catch (error) {
      console.error("error", error);
      throw new Error("Unable to create OTP");
    }
  }

  //verify otp
  async VerifyOTP(otpInputs: otpRequest) {
    try {
      const existingOTP: any = await otpModel.findOne({
        ipAddress: otpInputs.ipAddress,
        $or: [{ email: otpInputs.email }, { phoneNo: otpInputs.phoneNo }],
        otp: otpInputs.otp,
        isUsed: false,
      });

      if (existingOTP) {
        await otpModel.updateMany(
          {
            $or: [{ email: otpInputs.email }, { phoneNo: otpInputs.phoneNo }],
          },
          { $set: { isUsed: true } }
        );

        if (otpInputs.email) {
          await userModel.updateOne(
            { email: existingOTP.email },
            { isEmailVerified: true },
            { new: true }
          );
        } else if (otpInputs.phoneNo) {
          await userModel.updateOne(
            { phoneNo: existingOTP.phoneNo },
            { isPhoneNoVerified: true },
            { new: true }
          );
        }

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
