import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    comments: { type: [String], default: [] },
    image: { type: String, trim: true, default: "" },
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);