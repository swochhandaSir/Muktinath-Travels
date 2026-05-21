import SiteContent from "../models/SiteContent.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

const DEFAULT_SITE_CONTENT = {
	homeHero: {
		title: "Rent Your Dream Bike Today",
		subtitle: "Affordable - Reliable - Comfortable",
		buttonText: "Book Now",
		imageUrl: "",
	},
	about: {
		heading: "",
		description: "",
		visionText:
			"To become the most trusted and preferred car rental service provider by continuously improving our services, embracing innovation and building long-term relationships with our customers.",
		missionText:
			"To deliver convenient, affordable, and high-quality bike rental services that exceed customer expectations while ensuring safety, comfort, support and reliability in every ride.",
		closingText:
			"We believe every journey matters. That's why we focus on customer satisfaction, transparent pricing, and maintaining a fleet of vehicles that meet the highest standards. Your comfort and trust drive everything we do.",
		experienceYears: "5+",
		experienceLabel: "Years Of Experience",
		features: [
			"Trusted by thousands",
			"We focus on quality service",
			"Modern vehicles",
			"Transparent pricing",
		],
		primaryImageUrl:
			"https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
		secondaryImageUrl:
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
	},
};

function cleanText(value) {
	return typeof value === "string" ? value.trim() : "";
}

function normalizeFeatures(value) {
	if (Array.isArray(value)) {
		return value.map(cleanText).filter(Boolean);
	}
	if (typeof value === "string") {
		return value
			.split(/\r?\n/)
			.map(cleanText)
			.filter(Boolean);
	}
	return [];
}

function mergeWithDefaults(doc) {
	const source = doc?.toObject ? doc.toObject() : doc || {};
	return {
		id: source._id?.toString() || "",
		homeHero: {
			...DEFAULT_SITE_CONTENT.homeHero,
			...(source.homeHero || {}),
		},
		about: {
			...DEFAULT_SITE_CONTENT.about,
			...(source.about || {}),
			features: source.about?.features?.length
				? source.about.features
				: DEFAULT_SITE_CONTENT.about.features,
		},
		createdAt: source.createdAt || null,
		updatedAt: source.updatedAt || null,
	};
}

function buildPayload(body) {
	const parsedBody =
		typeof body.content === "string" ? JSON.parse(body.content) : body;
	const homeHero = parsedBody.homeHero || {};
	const about = parsedBody.about || {};

	return {
		homeHero: {
			title: cleanText(homeHero.title),
			subtitle: cleanText(homeHero.subtitle),
			buttonText: cleanText(homeHero.buttonText),
			imageUrl: cleanText(homeHero.imageUrl),
		},
		about: {
			heading: cleanText(about.heading),
			description: cleanText(about.description),
			visionText: cleanText(about.visionText),
			missionText: cleanText(about.missionText),
			closingText: cleanText(about.closingText),
			experienceYears: cleanText(about.experienceYears),
			experienceLabel: cleanText(about.experienceLabel),
			features: normalizeFeatures(about.features),
			primaryImageUrl: cleanText(about.primaryImageUrl),
			secondaryImageUrl: cleanText(about.secondaryImageUrl),
		},
	};
}

async function applyUploadedImages(payload, files) {
	const homeHeroImage = files?.homeHeroImage?.[0];
	const aboutPrimaryImage = files?.aboutPrimaryImage?.[0];
	const aboutSecondaryImage = files?.aboutSecondaryImage?.[0];

	if (homeHeroImage?.buffer) {
		payload.homeHero.imageUrl = await uploadImageBuffer(
			homeHeroImage.buffer,
			"vehicle-rental/site-content/home",
		);
	}

	if (aboutPrimaryImage?.buffer) {
		payload.about.primaryImageUrl = await uploadImageBuffer(
			aboutPrimaryImage.buffer,
			"vehicle-rental/site-content/about",
		);
	}

	if (aboutSecondaryImage?.buffer) {
		payload.about.secondaryImageUrl = await uploadImageBuffer(
			aboutSecondaryImage.buffer,
			"vehicle-rental/site-content/about",
		);
	}
}

export const getSiteContent = async (_req, res) => {
	try {
		const doc = await SiteContent.findOne({ key: "main" });
		res.json(mergeWithDefaults(doc));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateSiteContent = async (req, res) => {
	try {
		const payload = buildPayload(req.body);
		await applyUploadedImages(payload, req.files);
		const doc = await SiteContent.findOneAndUpdate(
			{ key: "main" },
			{ $set: { key: "main", ...payload } },
			{ new: true, upsert: true, runValidators: true },
		);
		res.json(mergeWithDefaults(doc));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
