import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Otp extends Document {
    otp: number;
    email: any;
    phoneNo?: any
    expireTime: Date;
    isExpired?: string;
    isUsed?: boolean;
    ipAddress?: string;
}

export interface otpRequest {
    otp?: number;
    email: any;
    phoneNo: string;
    ipAddress?: string;
}