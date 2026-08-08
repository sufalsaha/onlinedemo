import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
      default: null,
    },
    verificationOtpSendAt: {
      type: Date,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordOtpSendAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "User",
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
