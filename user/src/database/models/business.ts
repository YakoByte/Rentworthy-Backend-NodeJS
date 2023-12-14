import mongoose, { Schema, Document, Types } from "mongoose";

import { Business } from "../../interface/business";

const businessSchema: Schema = new Schema<Business>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    phoneNo: {
      type: Number,
      required: false,
    },
    phoneCode: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    businessName: {
      type: String,
      required: false,
    },
    businessAddress: {
      type: String,
      required: false,
    },
    businessDescription: {
      type: String,
      required: false,
    },
    einId: {
      type: String,
      required: false,
    },
    adminRemark: {
      type: String,
      required: false,
    },
    isApproved: {
      type: String,
      default:"pending",
      enum:['pending','approved','rejected']
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Businesss = mongoose.model<Business>("Business", businessSchema);

export default Businesss;
