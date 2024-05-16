import { Request } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
  user?: any;
  headers: any;
  query: {
    _id?: string;
    points?: string;
    price?: string;
    currency?: string;
    planId?: string;
    description?: string;
    title?: string;
    timelimit?: string;
    page?: string;
    limit?: string;
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
  currency: string;
  description: string;
  timelimit: string;
  title: string;
  planId: string;
  images: [Types.ObjectId];
  isActive: boolean;
  isDeleted: boolean;
}

export interface subscriptionRequest {
  points: number;
  price: number;
  currency: string;
  description: string;
  timelimit: string;
  planId?: string;
  images?: [Types.ObjectId];
  title: string;
}

export interface subscriptionUpdateRequest {
  _id: string;
  points?: number;
  price?: number;
  currency?: string;
  description?: string;
  timelimit?: string;
  title?: string;
  planId?: string;
  images?: [Types.ObjectId];
  isActive?: boolean;
}

export interface subscriptionGetRequest {
  _id?: string;
  points?: string;
  price?: string;
  currency?: string;
  description?: string;
  timelimit?: string;
  title?: string;
  planId?: string;
  page?: string;
  limit?: string;
}

export interface subscriptionDeleteRequest {
  _id: string;
}
