
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ContactUs extends Document {
   name:string,
   phoneNo:number,
   description:string
}

export interface ContactUsInput {
    name:string,
    phoneNo:number,
    description:string
}