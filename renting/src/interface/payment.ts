import { Document, Types } from "mongoose";

export interface Payment extends Document {
  paymentId: string;
  userId: Types.ObjectId;
  quantity: number;
  amount: number;
  currency: string;
  isDeleted: boolean;
  status: string;
}
