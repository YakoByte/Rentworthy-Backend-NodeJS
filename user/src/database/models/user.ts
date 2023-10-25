import mongoose, { Schema, Document, Types } from "mongoose";

import { User } from "../../interface/user";

const userSchema: Schema = new Schema<User>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNo: {
      type: Number,
      unique: true,
    },
    phoneCode: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    stripe: {
      type: String,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    appleId: {
      type: String,
    },
    location: {
      type: String,
      coordinate: {
        type: [Number],
        index: "2dsphere",
      },
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
    ],
    isGuest: {
      type: Boolean,
      default: false,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
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

const Users = mongoose.model<User>("User", userSchema);

export default Users;
