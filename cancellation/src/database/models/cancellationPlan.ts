import mongoose, { Schema, Document, Types } from "mongoose";

import { CancellationPlan } from "../../interface/cancellationPlan";

const cancellationPlanSchema: Schema = new Schema<CancellationPlan>(
    {
        planName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        cancellationCharges: {
            type: String,
            required: true,
        },
        cancellationChargesType: {
            type: String,
            required: true,
        },
        minimumCharges: {
            type: String,
            required: true,
        },
        minimumCancellationHours: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

const CancellationPlans = mongoose.model<CancellationPlan>("CancellationPlan", cancellationPlanSchema);

export default CancellationPlans;
