import mongoose, { Schema, Document, Types } from "mongoose";

import { Ads } from "../../interface/ads";

const adsSchema: Schema = new Schema<Ads>(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
        },
        brand: {
            type: String,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
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
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        images: [
            {
              type: Schema.Types.ObjectId,
              ref: "Image",
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
