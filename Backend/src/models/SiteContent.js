import mongoose from "mongoose";

const homeHeroSchema = new mongoose.Schema(
	{
		title: { type: String, trim: true, default: "" },
		subtitle: { type: String, trim: true, default: "" },
		buttonText: { type: String, trim: true, default: "" },
		imageUrl: { type: String, trim: true, default: "" },
	},
	{ _id: false },
);

const aboutSchema = new mongoose.Schema(
	{
		heading: { type: String, trim: true, default: "" },
		description: { type: String, trim: true, default: "" },
		visionText: { type: String, trim: true, default: "" },
		missionText: { type: String, trim: true, default: "" },
		closingText: { type: String, trim: true, default: "" },
		experienceYears: { type: String, trim: true, default: "" },
		experienceLabel: { type: String, trim: true, default: "" },
		features: { type: [String], default: [] },
		primaryImageUrl: { type: String, trim: true, default: "" },
		secondaryImageUrl: { type: String, trim: true, default: "" },
	},
	{ _id: false },
);

const processStepSchema = new mongoose.Schema(
	{
		number: { type: String, trim: true, default: "" },
		title: { type: String, trim: true, default: "" },
		description: { type: String, trim: true, default: "" },
	},
	{ _id: false },
);

const processSchema = new mongoose.Schema(
	{
		heading: { type: String, trim: true, default: "" },
		subheading: { type: String, trim: true, default: "" },
		description: { type: String, trim: true, default: "" },
		backgroundImageUrl: { type: String, trim: true, default: "" },
		steps: { type: [processStepSchema], default: [] },
	},
	{ _id: false },
);

const siteContentSchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
			default: "main",
			immutable: true,
		},
		homeHero: { type: homeHeroSchema, default: () => ({}) },
		about: { type: aboutSchema, default: () => ({}) },
		process: { type: processSchema, default: () => ({}) },
	},
	{ timestamps: true },
);

export default mongoose.model("SiteContent", siteContentSchema);
