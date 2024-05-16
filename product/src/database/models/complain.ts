import mongoose, { Schema, Document, Types } from "mongoose";

import { Complain } from "../../interface/complain";

const categorySchema: Schema = new Schema<Complain>(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
        require: true,
    },
    name: {
      type: String,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "images",
      },
    ],
    description: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Complains = mongoose.model<Complain>("Complain", categorySchema);

export default Complains;
