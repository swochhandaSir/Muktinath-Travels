import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		image: { type: String },
		rating: {
			type: String,
			enum: ["1", "2", "3", "4", "5"],
			default: "5",
		},
		pricePerDay: { type: Number, required: true, min: 0 },
		transmission: {
			type: String,
			enum: ["AT", "MT"],
			default: "AT",
		},
		fuel: { type: String, default: "petrol", trim: true },
		year: { type: Number, required: true },
		mileage: { type: String, default: "—", trim: true },
	},
	{ timestamps: true },
);

export default mongoose.model("Bike", bikeSchema);
