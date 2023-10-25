import mongoose, { Schema, Document, Types } from "mongoose";

import { Otp } from "../../interface/otp";

const otpSchema: Schema = new Schema<Otp>(
    {
        otp: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
        },
        phoneNo: {
            type: String,
        },
        expireTime: {
            type: Date,
        },
        isExpired: {
            type: Boolean,
            default: false,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
        ipAddress: {
            type: String,
        },
    },
    { timestamps: true }
);

const Otps = mongoose.model<Otp>("Otp", otpSchema);

export default Otps;
