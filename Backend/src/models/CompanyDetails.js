import mongoose from "mongoose";

const companyDetailsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        logo: { type: String, trim: true, default: "" },
        contactEmail: { type: String, trim: true, default: "" },
        contactPhone: { type: String, trim: true, default: "" },
        location: { type: String, trim: true, default: "" },
        about: { type: String, trim: true, default: "" },
        facebook: { type: String, trim: true, default: "" },
        tiktok: { type: String, trim: true, default: "" },
        instagram: { type: String, trim: true, default: "" },
    },
    { timestamps: true },
);

export default mongoose.model("CompanyDetails", companyDetailsSchema);