import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		pricePerDay: { type: Number, required: true, min: 0 },
		image: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

export default mongoose.model("Bike", bikeSchema);
