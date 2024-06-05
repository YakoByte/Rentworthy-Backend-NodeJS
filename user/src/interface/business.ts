import { Request } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
  // Additional properties or methods specific to AuthenticatedRequest
  user?: any;
}
export interface Business extends Document {
  userId: Types.ObjectId;
  phoneNo?: number;
  phoneCode?: string;
  email?: string;
  businessName?: string;
  businessAddress?: string;
  businessDescription?: string;
  einId?: string;
  adminRemark?: string;
  isApproved?: string;
  isDeleted?: boolean;
}
export interface BusinessRequest {
  userId: string;
  phoneNo?: number;
  phoneCode?: string;
  email?: string;
  businessName?: string;
  businessAddress?: string;
  businessDescription?: string;
  einId?: string;
}
export interface BusinessAppRequest {
  _id: string;
  status: string;
}
export interface BusinessGetRequest {
    _id?: string;
    status?: string;
    name?:string
    userId?:string
  }
