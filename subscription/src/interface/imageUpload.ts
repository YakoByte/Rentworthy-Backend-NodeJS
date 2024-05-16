import { Document, Types } from "mongoose";

export interface Image extends Document {
  imageName: string;
  mimetype: string;
  path: string;
  size: number;
  userId: Types.ObjectId;
  isActive: boolean;
  isDeleted: boolean;
}

export interface imageRequest {
  imageDetail: {
    imageName: string;
    mimetype: string;
    path: string;
    size: number;
  };
  userId: Types.ObjectId;
}

// multiple image upload
export interface imageRequests {
  imageDetails: Array<{
    imageName: string;
    mimetype: string;
    path: string;
    size: number;
  }>;
  userId: Types.ObjectId;
}
