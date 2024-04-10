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
  productId: Types.ObjectId;
  bookingId: Types.ObjectId;
  subscriptionPlan: Types.ObjectId;
  paymentId: string;
  userId: Types.ObjectId;
  quantity: number;
  amount: number;
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
    BookingId: string;
    subscriptionPlan: string;
    productId: string;
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
  productId?: string;
  bookingId?: string;
  subscriptionPlan?: string;
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
  customer_id: string;
}

export interface PaymentUpdateMethodDetails {
  customer_id: string;
  card_Id: string;
  exp_month: string;
  exp_year: string;
  name: string;
}

export interface PaymentDeleteMethodDetails {
  customer_id: string;
  card_Id: string;
}

export interface PaymentChargeDetails {
  customer_id?: string;
  token_id?: string;
  amount: number;
  currency?: string;
  userId: string;
  bookingId?: string;
  subscriptionPlan?: string;
  productId?: string;
  quantity?: number;
}

export interface PaymentCancel {
  bookingId: string;
  userId: string;
}

export interface PlanProductPricedetail {
    amount: number,
    currency: string,
    interval: string,
    planType: string,
}

export interface SubscriptionPayment {
  userId: string;
  customerId: string;
  stripePriceId: string;
  productId?: string;
  bookingId?: string;
  subscriptionPlan?: string;
}

export interface PaymentIntendDetail {
  stripeId?: string;
  name?: string;
  email?: string;
  userId: string;
  bookingId?: string;
  subscriptionPlan?: string;
  productId?: string;
  quantity?: number;
  card: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  };
  amount: number;
  currency: string;
}

export interface PaymentCount {
  subscriptionPlan?: string;
  productId?: string;
  userId?: string;
}

export interface UpdatePayment {
  _id: Types.ObjectId;
  productId?: string;
  bookingId?: string;
  subscriptionPlan?: string;
  paymentId?: string;
  userId?: string;
  quantity?: number;
  amount?: number;
  isDeleted?: boolean;
  status?: string;
}
