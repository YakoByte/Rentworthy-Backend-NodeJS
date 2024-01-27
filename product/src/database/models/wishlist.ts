import mongoose, { Schema, Document, Types } from "mongoose";

import { Wishlist } from "../../interface/wishlist";

const categorySchema: Schema = new Schema<Wishlist>(
    {
        productIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Wishlists = mongoose.model<Wishlist>("Wishlist", categorySchema);

export default Wishlists;
