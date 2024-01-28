import mongoose, { Schema, Document, Types } from "mongoose";

import { Ads } from "../../interface/ads";

const adsSchema: Schema = new Schema<Ads>(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            // required: true,
        },
        brand: {
            type: String,
            // required: true,
        },
        title: {
            type: String,
            // required: true,
        },
        description: {
            type: String,
            // required: true,
        },
        min_qty: {
            type: Number,
            default: 0,
            // required: true,
        },
        max_qty: {
            type: Number,
            default: 0,
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
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            // required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            // required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        images: [
            {
              type: Schema.Types.ObjectId,
              ref: "image",
            },
        ],
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
            },
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

const Ads = mongoose.model<Ads>("Ads", adsSchema);

// create index for location
adsSchema.index({ location: "2dsphere" });

export default Ads;
