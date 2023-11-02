import mongoose, { Schema, Document, Types } from "mongoose";

import { Address } from "../../interface/address";

const addressSchema: Schema = new Schema<Address>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        },
        zipcode: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        fullAddress: {
            type: String,
            required: true,
        },
        unitNumber: {
            type: String,
        },
        typeOfAddress: {
            type: String,
            enum: ["home", "office", "other"],
            default: "home",
        },
        isdefault: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Address = mongoose.model<Address>("Address", addressSchema);

export default Address;
