import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";


export interface Address extends Document {
    userId: Types.ObjectId;
    phoneNo: number;
    zipcode: string;
    state: string;
    city: string;
    fullAddress: string;
    fullName: string;
    unitNumber: string;
    typeOfAddress: string;
    isdefault?: boolean;
    isDeleted?: boolean;
}
