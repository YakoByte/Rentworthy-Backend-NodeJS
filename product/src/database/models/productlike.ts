import mongoose, { Schema, Document, Types } from "mongoose";

import { ProductLike } from "../../interface/productlike";

const categorySchema: Schema = new Schema<ProductLike>(
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
        isFav: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

const Products = mongoose.model<ProductLike>("ProductLike", categorySchema);

export default Products;
