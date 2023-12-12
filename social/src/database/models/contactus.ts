import mongoose, { Schema, Document, Types } from "mongoose";

import { ContactUs } from "../../interface/contactus";

const categorySchema: Schema = new Schema<ContactUs>(
  {
    name: {
      type: String,
    },
    phoneNo: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const ContactUss = mongoose.model<ContactUs>("ContactUs", categorySchema);

export default ContactUss;
