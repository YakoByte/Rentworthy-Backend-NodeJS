import mongoose, { Schema, Document, Types } from "mongoose";

import { ProductReservation } from "../../interface/productreservation";

const categorySchema: Schema = new Schema<ProductReservation>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        customerRes: [{
            type: Number
        }],
        selfRes: [{
            type: Number
        }],
        availableDates: [{
            type: Number
        }],
        month: {
            type: Number
        },
        year: {
            type: Number
        }
    },
    { timestamps: true }
);

const Products = mongoose.model<ProductReservation>("ProductReservation", categorySchema);

export default Products;
