import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Otp extends Document {
    otp: string;
    email: string;
    phoneNo?: string;
    expireTime: Date;
    isExpired?: boolean;
    isUsed?: boolean;
    ipAddress?: string;
}

export interface otpRequest {
    otp?: string;
    email: string;
    phoneNo?: string;
    ipAddress?: string;
}