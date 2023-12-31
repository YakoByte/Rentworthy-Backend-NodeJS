import mongoose, { Schema, Document, Types } from "mongoose";

import { Product } from "../../interface/product";

const categorySchema: Schema = new Schema<Product>(
  {
    name: {
      type: String,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "image",
      },
    ],
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    min_qty: {
      type: Number,
      // required: true,
    },
    max_qty: {
      type: Number,
      // required: true,
    },
    min_price: {
      type: Number,
      default: 0,
      // required: true,
    },
    max_price: {
      type: Number,
      default: 0,
      // required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    brand: {
      type: String,
      // required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
    },
    isExtended: {
      type: Boolean,
      default: false,
    },
    cancellationPolicyIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "cancellationPlan",
      },
    ],
    rentedType: {
      type: String,
      enum: ["hour", "day", "week", "month"],
      default: "day",
    },
    rentingDate: {
      startDate: Date,
      endDate: Date,
    },
    thumbnail: {
      type: Schema.Types.ObjectId,
      ref: "image",
    },
    address: {
      type: String,
    },
    // pickupOnly: {
    //   type: Boolean,
    //   default: false,
    // },
    location: {
      // type: "Point",
      // coordinate: [Number]
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Products = mongoose.model<Product>("Product", categorySchema);

export default Products;
