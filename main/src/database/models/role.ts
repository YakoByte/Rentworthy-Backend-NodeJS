import mongoose, { Schema, Document, Types } from "mongoose";

import { Role } from "../../interface/role";

const roleSchema: Schema = new Schema<Role>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
        },
        permissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Permission",
            required: true,
        }]
    },
    { timestamps: true }
);

const Roles = mongoose.model<Role>("Role", roleSchema);

export default Roles;
