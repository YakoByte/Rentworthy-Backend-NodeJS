import mongoose, { Schema, Document, Types } from "mongoose";

import { ProductReview } from "../../interface/productreview";

const categorySchema: Schema = new Schema<ProductReview>(
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
        review: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

const Products = mongoose.model<ProductReview>("ProductReview", categorySchema);

export default Products;
