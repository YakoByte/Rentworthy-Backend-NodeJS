import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Role extends Document {
    name: string;
    description?: string;
    permissions?: Types.ObjectId[];
}

export interface roleRequest {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    permissions?: Array<string>;
}