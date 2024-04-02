import { Request } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Payment extends Document {
  productId: Types.ObjectId;
  bookingId: Types.ObjectId;
  paymentId: string;
  userId: Types.ObjectId;
  quantity: number;
  amount: number;
  isDeleted: boolean;
  status: string;
}
