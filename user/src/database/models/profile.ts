import mongoose, { Schema, Document, Types } from "mongoose";

import { Profile } from "../../interface/profile";

const userSchema: Schema = new Schema<Profile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Profiles = mongoose.model<Profile>("Profile", userSchema);

export default Profiles;
