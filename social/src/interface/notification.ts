import { Request } from "express";
import mongoose, { Schema, Document, Types, ObjectId } from "mongoose";

export interface Notification extends Document {
    title: string;
    description: string;
    isRead: boolean;
    receiverId: Types.ObjectId[];
    type: string;
    isDeleted: boolean;
    isActive: boolean;
}

export interface notificationRequest {
  _id?: string;
  title?: string;
  description?: string;
  isRead?: boolean;
  receiverId?: string[];
  type?: string;
  isDeleted?: boolean;
  isActive?: boolean;
}

export interface ICreateNotification {
  receiverId?: string[];
  title?: string;
  description?: string;
  type?: string;
  isRead?: boolean;
  isDeleted?: boolean;
  isActive?: boolean;
}

export interface IGetNotifications {
  _id?: string;
  receiverId?: string[];
  title?: string;
  description?: string;
  type?: string;
  isRead?: boolean;
  isDeleted?: boolean;
  isActive?: boolean;
}

export interface IUpdateNotification {
  _id: string;
  receiverId?: string[];
  title?: string;
  description?: string;
  type?: string;
  isRead?: boolean;
  isDeleted?: boolean;
  isActive?: boolean;
}
