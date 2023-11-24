import mongoose, { Schema, Document, Types } from "mongoose";

import { Ads } from "../../interface/ads";

const adsSchema: Schema = new Schema<Ads>(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        subCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subCategory",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
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
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "image",
            required: true,
        },
        address: {
            area: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },
        location: {
            type: "Point",
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        distance: {
            type: Number,
            required: true,
        },
        isGlobal: {
            type: Boolean,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
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

export default Ads;
