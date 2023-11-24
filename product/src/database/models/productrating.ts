import mongoose, { Schema, Document, Types } from "mongoose";

import { ProductRating } from "../../interface/productrating";

const categorySchema: Schema = new Schema<ProductRating>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        rating: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

const Products = mongoose.model<ProductRating>("ProductRating", categorySchema);

export default Products;
