import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Role extends Document {
    name: string;
    description?: string;
    permissions?: Types.ObjectId[];
}