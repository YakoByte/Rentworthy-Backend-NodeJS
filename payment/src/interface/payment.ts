import { Request } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface getCountAuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
  query: {
    criteria: string;
  };
}

export interface Payment extends Document {
  paymentId: string;
  userId: Types.ObjectId;
  quantity: number;
  amount: number;
  currency: string;
  isDeleted: boolean;
  status: string;
}

export interface postAuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
  body: {
    amount: number;
    currency: string;
  };
}

export interface confirmIntentRequest extends Request {
  user?: {
    _id: string;
  };
  body: {
    paymentId: string;
    userId: string;
    amount: number;
    quantity: number;
    currency: string;
  };
}

export interface PaymentDetails {
  amount: number;
  currency: string;
}

export interface PaymentConfirmDetails {
  paymentId: string;
  amount: number;
  userId: string;
  quantity?: number;
  currency: string;
  status: string;
}

export interface PaymentMethodDetails {
  card?: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  };
  userId: string;
}

export interface PaymentUpdateMethodDetails {
  userId: string;
  card_Id: string;
  exp_month: string;
  exp_year: string;
  name: string;
}

export interface PaymentDeleteMethodDetails {
  userId: string;
  card_Id: string;
}

export interface PaymentChargeDetails {
  token_id?: string;
  amount: number;
  currency?: string;
  userId: string;
  quantity?: number;
}

export interface PaymentTransfer {
  paymentId: string;
  ownerId: string;
}

export interface PaymentCancel {
  paymentId: string;
}

export interface PlanPricedetail {
  amount: number;
  currency: string;
  interval: string;
  planType: string;
}

export interface SubscriptionPayment {
  userId: string;
  customerId: string;
  stripePriceId: string;
}

export interface PaymentIntendDetail {
  stripeId?: string;
  name?: string;
  email?: string;
  userId: string;
  quantity?: number;
  paymentMethod?: string;
  cardId?: string;
  card: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  };
  amount: number;
  currency: string;
}

export interface UpdatePayment {
  _id: Types.ObjectId;
  paymentId?: string;
  userId?: string;
  quantity?: number;
  amount?: number;
  isDeleted?: boolean;
  status?: string;
}

export interface GetAllPayment {
  _id?: string;
  userId?: string;
  user: { _id: string; roleName: string; email: string };
  paymentId?: string;
}
