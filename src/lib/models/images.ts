import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Images =
  mongoose.models.Images || mongoose.model("Images", imageSchema);
