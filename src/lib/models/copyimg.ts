import mongoose, { Schema } from "mongoose";

const copySchema = new Schema(
  {
    image: {
      type: [String],
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Imagescopy =
  mongoose.models.Imagescopy || mongoose.model("Imagescopy", copySchema);
