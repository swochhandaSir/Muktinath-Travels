import mongoose from "mongoose";

const packageBookingSchema = new mongoose.Schema(
	{
		package: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Package",
			required: true,
		},
		customerName: { type: String, required: true, trim: true },
		customerEmail: { type: String, required: true, trim: true },
		customerPhone: { type: String, required: true, trim: true },
		numberOfPeople: { type: Number, required: true, min: 1 },
		pickupDate: { type: Date, required: true },
		returnDate: { type: Date, required: true },
		pickupLocation: { type: String, required: true, trim: true },
		returnLocation: { type: String, required: true, trim: true },
		message: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

export default mongoose.model("PackageBooking", packageBookingSchema);
