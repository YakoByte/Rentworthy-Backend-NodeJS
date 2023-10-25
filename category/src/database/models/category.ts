import mongoose, { Schema, Document, Types } from "mongoose";

import { Category } from "../../interface/category";

const categorySchema: Schema = new Schema<Category>(
    {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
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
        isShow: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Categorys = mongoose.model<Category>("Category", categorySchema);

export default Categorys;
