import mongoose from "mongoose";

const bikeBookingSchema = new mongoose.Schema(
	{
		bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike", required: true },
		customerName: { type: String, required: true, trim: true },
		customerEmail: { type: String, required: true, trim: true },
		customerPhone: { type: String, required: true, trim: true },
		pickupDate: { type: Date, required: true },
		returnDate: { type: Date, required: true },
		pickupLocation: { type: String, required: true, trim: true },
		returnLocation: { type: String, required: true, trim: true },
		message: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

export default mongoose.model("BikeBooking", bikeBookingSchema);
