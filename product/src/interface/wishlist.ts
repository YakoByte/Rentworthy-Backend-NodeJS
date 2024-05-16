import  { Document, Types } from "mongoose";

export interface Wishlist extends Document {
    productIds: Types.ObjectId[];
    userId: Types.ObjectId;
    isDeleted?: boolean;
}
