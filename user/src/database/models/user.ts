import mongoose, { Schema, Document, Types } from "mongoose";

import { User } from "../../interface/user";

const userSchema: Schema = new Schema<User>(
  {
    // userName: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   lowercase: true,
    // },
    phoneNo: {
      type: Number,
      // unique: true,
      default: null,
    },
    phoneCode: {
      type: String,
    },
    email: {
      type: String,
      // unique: true,
      lowercase: true,
      default: null,
    },
    password: {
      type: String,
      // required: true,
    },
    stripe: {
      type: String,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    bussinessType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },
    appleId: {
      type: String,
    },
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    loginType: {
      type: String,
      enum: ["google", "fb", "apple", "regular"],
      default: "regular"
    },
    os: {
      type: String,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model<User>("User", userSchema);

export default Users;
