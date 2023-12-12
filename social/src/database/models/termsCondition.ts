import mongoose, { Schema } from "mongoose";

import { termCondition } from "../../interface/termCondition";

const termConditionSchema: Schema = new Schema<termCondition>(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "image",
        },
        description: {
            type: String,
        }
    },
    { timestamps: true }
);

const TermConditions = mongoose.model<termCondition>("TermCondition", termConditionSchema);

export default TermConditions;
