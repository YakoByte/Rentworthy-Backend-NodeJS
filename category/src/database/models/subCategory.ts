import mongoose, { Schema, Document, Types } from "mongoose";

import { SubCategory } from "../../interface/subCategory";

const subCategorySchema: Schema = new Schema<SubCategory>(
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
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
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

const SubCategorys = mongoose.model<SubCategory>("SubCategory", subCategorySchema);

export default SubCategorys;
