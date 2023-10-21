import mongoose, { Schema, Document, Types } from "mongoose";

interface IUser extends Document {
  userName: string;
  phoneNo?: number;
  phoneCode?: string;
  email?: string;
  password: string;
  stripe?: string;
  roleId: Types.ObjectId;
  appleId?: string;
  location?: string;
  address: Types.ObjectId[];
  isGuest?: boolean;
  isAuthenticated?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isReported?: boolean;
  profileImage?: string;
  isDeleted?: boolean;
}

const userSchema: Schema = new Schema<IUser>(
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
      default: false,
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

const Users = mongoose.model<IUser>("User", userSchema);

export default Users;
