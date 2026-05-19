import mongoose from "mongoose";

const itineraryDaySchema = new mongoose.Schema(
	{
		dayNumber: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
	},
	{ _id: false },
);

const packageSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		location: { type: String, required: true, trim: true },
		duration: { type: String, required: true, trim: true },
		groupSize: { type: Number, required: true, min: 1 },
		price: { type: Number, required: true, min: 0 },
		image: { type: String, trim: true, default: "" },
		itinerary: { type: [itineraryDaySchema], default: [] },
		tripHighlights: { type: [String], default: [] },
		inclusions: { type: [String], default: [] },
		packageExperience: { type: String, trim: true, default: "" },
	},
	{ timestamps: true },
);

export default mongoose.model("Package", packageSchema);
