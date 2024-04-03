import mongoose, { Schema } from "mongoose";
import { Profile } from "../../interface/profile";

const userSchema: Schema = new Schema<Profile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
    },
    userDesc: {
      type: String,
    },
    email: {
      type: String,
    },
    countryCode: {
      type: Number,
    },
    phoneNo: {
      type: Number,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "images",
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    recommendation: {
      type: Boolean,
      default: true,
    },
    updatesOrOffers: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "english"  // english, hindi
    },
    level: {
      type: Number,
      default: 1,
      max: 3
    },
    points: {
      type: Number,
      default: 0,
      max: 6000
    },
  },
  { timestamps: true }
);

const Profiles = mongoose.model<Profile>("Profile", userSchema);

export default Profiles;
