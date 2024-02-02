import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        userName: string;
        roleName: string;
    };
    headers: any;
    file?: any;
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
  
export interface SubscribedUser extends Document {
    userId: Types.ObjectId;
    subscriptionPlan: Types.ObjectId,
    paymentId: Types.ObjectId,
    DateofSubscription: string,
    timelimit: string,
    isActive: boolean,
    isDeleted: boolean,
}

export interface SubscribedUserRequest {
    // _id?: string;
    userId?: Types.ObjectId;
    subscriptionPlan?: Types.ObjectId,
    paymentId?: Types.ObjectId,
    DateofSubscription?: string,
    timelimit?: string,
    isActive?: boolean,
    isDeleted?: boolean,
}

export interface SubscribedUserUpdateRequest {
    _id?: string;
    userId?: Types.ObjectId;
    subscriptionPlan?: Types.ObjectId,
    paymentId?: Types.ObjectId,
    DateofSubscription?: string,
    timelimit?: string,
    isActive?: boolean,
    isDeleted?: boolean,
}

export interface SubscribedUserDeleteRequest {
    _id: string;
  }

//get SubscribedUsers

export interface SubscribedUserGetRequest {
    _id?: Types.ObjectId,
    userId?: Types.ObjectId;
    subscriptionPlan?: Types.ObjectId,
    paymentId?: Types.ObjectId,
    DateofSubscription?: string,
    timelimit?: string,
    isActive?: boolean,
    isDeleted?: boolean,
}