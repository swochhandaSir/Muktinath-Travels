import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		pricePerDay: { type: Number, required: true, min: 0 },
		image: { type: String, trim: true, default: "" },
		model: { type: String, trim: true, default: "" },
		color: { type: String, trim: true, default: "" },
		plateNumber: { type: String, trim: true, default: "" },
		chassisNumber: { type: String, trim: true, default: "" },
		engineNumber: { type: String, trim: true, default: "" },
		mileage: { type: Number, min: 0, default: 0 },
		available: { type: Boolean, default: true },
		engineCapacity: { type: Number, min: 0, default: 0 },
		blueBookNumber: { type: String, trim: true, default: "" },
		licenseImage: { type: String, trim: true, default: "" },
		qrCode: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

export default mongoose.model("Bike", bikeSchema);
