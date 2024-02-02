import { Request } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";

// export interface AuthenticatedRequest extends Request {
//     // Additional properties or methods specific to AuthenticatedRequest
//     user?: any;
//     headers: any;
// }

export interface AuthenticatedRequest extends Request {
  // Additional properties or methods specific to AuthenticatedRequest
  user?: {
    _id: string;
  };
  headers: any;
  query: {
    _id?: string;
    points?: string;
    price?: string;
    description?: string;
    title?: string;
  };
  files?: any;
}

export interface deleteAuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
  headers: any;
  query: {
    _id: string;
  };
}

export interface Subscription extends Document {
  points: number;
  price: number;
  description: string;
  title: string;
  images: [Types.ObjectId];
  isActive: boolean;
  isDeleted: boolean;
}

export interface subscriptionRequest {
  points: number;
  price: number;
  description: string;
  images?: [Types.ObjectId];
  title: string;
}

export interface subscriptionUpdateRequest {
  _id: string;
  points?: number;
  price?: number;
  description?: string;
  title?: string;
  images?: [Types.ObjectId];
  isActive?: boolean;
}

export interface subscriptionGetRequest {
  _id?: string;
  points?: string;
  price?: string;
  description?: string;
  title?: string;
}

export interface subscriptionDeleteRequest {
  _id: string;
}
