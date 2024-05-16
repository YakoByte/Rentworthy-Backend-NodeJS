import { Document, Types } from "mongoose";

export interface Profile extends Document {
    userId: Types.ObjectId;
    userName?: string;
    userDesc?: string;
    countryCode?: number;
    phoneNo?: number;
    email?: string;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    isDeleted?: boolean;
    profileImage: Types.ObjectId;
    locationId?: Types.ObjectId;
    recommendation?: boolean;
    updatesOrOffers?: boolean;
    language?: string;
    level: number;
    points: number;
}