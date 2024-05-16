import mongoose, { Schema, Document, Types } from "mongoose";

import { Recommendation } from "../../interface/recommendation";

const categorySchema: Schema = new Schema<Recommendation>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        subCategoryId: [{
            type: Schema.Types.ObjectId,
            ref: "SubCategory",
        }]
    },
    { timestamps: true }
);

const Recommendations = mongoose.model<Recommendation>("Recommendation", categorySchema);

export default Recommendations;
