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
	process: {
		heading: "Travel Agency",
		subheading: "Process",
		description:
			"Bike rental made easy! Follow our simple 3-step process to get on the road in no time. Choose your bike, book online, and enjoy your ride!",
		backgroundImageUrl:
			"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80",
		steps: [
			{
				number: "01.",
				title: "Come In Contact",
				description:
					"Come in contact with us to get more information about our bike rental services.",
			},
			{
				number: "02.",
				title: "Choose A Bike",
				description: "Browse our fleet and select the perfect bike for your needs.",
			},
			{
				number: "03.",
				title: "Enjoy Riding",
				description:
					"Sit back, relax, and enjoy your journey with our reliable and comfortable bikes.",
			},
		],
	},
	service: {
		heading: "Our Services",
		description:
			"Explore our comprehensive range of car rental services designed to meet your needs. From short-term rentals to long-term leases, we offer flexible options for individuals and businesses alike. Our services include a wide selection of vehicles, competitive pricing, and exceptional customer support to ensure a seamless rental experience.",
		cards: [
			{
				icon: "Car",
				title: "Wide Vehicle Selection",
				description:
					"Choose from a diverse fleet of cars, SUVs, and luxury vehicles for every type of journey.",
			},
			{
				icon: "ShieldCheck",
				title: "Full Insurance Coverage",
				description:
					"Travel with confidence using our comprehensive insurance coverage on every rental.",
			},
			{
				icon: "Headphones",
				title: "24/7 Customer Support",
				description:
					"Our support team is available anytime for bookings, queries, and roadside assistance.",
			},
		],
		statsBackgroundImageUrl:
			"https://media.istockphoto.com/id/1190475811/photo/rush-in-the-city.webp?a=1&b=1&s=612x612&w=0&k=20&c=pgEobykYrVwHxzRyCKixA6TSA4wh4yCyj_aY9TuqLm4=",
		stats: [
			{ icon: "Car", number: "120+", label: "Cars Available" },
			{ icon: "Users", number: "3500+", label: "Happy Customers" },
			{ icon: "MapPin", number: "25+", label: "Cities Covered" },
			{ icon: "Briefcase", number: "25+", label: "Years Experience" },
		],
		reviewsHeading: "Our Clients Reviews",
		reviewsDescription: "Hear what our clients have to say about us!",
		reviews: [
			{ name: "Rudra pratap adhikari", review: "Great service." },
			{ name: "Sanjana", review: "Excellent experience overall" },
			{
				name: "Aayush Sharma",
				review:
					"Great service for a family trip. The SUV was in good condition and the pricing was fair.",
			},
			{
				name: "Pratik Gurung",
				review:
					"Booking was quick and support was helpful when I needed to extend my rental by one day.",
			},
		],
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

function normalizeProcessSteps(value) {
	if (!Array.isArray(value)) return [];
	return value
		.map((step, index) => ({
			number: cleanText(step?.number) || `${String(index + 1).padStart(2, "0")}.`,
			title: cleanText(step?.title),
			description: cleanText(step?.description),
		}))
		.filter((step) => step.number || step.title || step.description);
}

function normalizeServiceCards(value) {
	if (!Array.isArray(value)) return [];
	return value
		.map((card) => ({
			icon: cleanText(card?.icon),
			title: cleanText(card?.title),
			description: cleanText(card?.description),
		}))
		.filter((card) => card.icon || card.title || card.description);
}

function normalizeServiceStats(value) {
	if (!Array.isArray(value)) return [];
	return value
		.map((stat) => ({
			icon: cleanText(stat?.icon),
			number: cleanText(stat?.number),
			label: cleanText(stat?.label),
		}))
		.filter((stat) => stat.icon || stat.number || stat.label);
}

function normalizeServiceReviews(value) {
	if (!Array.isArray(value)) return [];
	return value
		.map((review) => ({
			name: cleanText(review?.name),
			review: cleanText(review?.review),
		}))
		.filter((review) => review.name || review.review);
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
		process: {
			...DEFAULT_SITE_CONTENT.process,
			...(source.process || {}),
			steps: source.process?.steps?.length
				? source.process.steps.map((step, index) => ({
						number:
							step.number || `${String(index + 1).padStart(2, "0")}.`,
						title: step.title || "",
						description: step.description || "",
					}))
				: DEFAULT_SITE_CONTENT.process.steps,
		},
		service: {
			...DEFAULT_SITE_CONTENT.service,
			...(source.service || {}),
			cards: source.service?.cards?.length
				? source.service.cards
				: DEFAULT_SITE_CONTENT.service.cards,
			stats: source.service?.stats?.length
				? source.service.stats
				: DEFAULT_SITE_CONTENT.service.stats,
			reviews: source.service?.reviews?.length
				? source.service.reviews
				: DEFAULT_SITE_CONTENT.service.reviews,
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
	const process = parsedBody.process || {};
	const service = parsedBody.service || {};

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
		process: {
			heading: cleanText(process.heading),
			subheading: cleanText(process.subheading),
			description: cleanText(process.description),
			backgroundImageUrl: cleanText(process.backgroundImageUrl),
			steps: normalizeProcessSteps(process.steps),
		},
		service: {
			heading: cleanText(service.heading),
			description: cleanText(service.description),
			cards: normalizeServiceCards(service.cards),
			statsBackgroundImageUrl: cleanText(service.statsBackgroundImageUrl),
			stats: normalizeServiceStats(service.stats),
			reviewsHeading: cleanText(service.reviewsHeading),
			reviewsDescription: cleanText(service.reviewsDescription),
			reviews: normalizeServiceReviews(service.reviews),
		},
	};
}

async function applyUploadedImages(payload, files) {
	const homeHeroImage = files?.homeHeroImage?.[0];
	const aboutPrimaryImage = files?.aboutPrimaryImage?.[0];
	const aboutSecondaryImage = files?.aboutSecondaryImage?.[0];
	const processBackgroundImage = files?.processBackgroundImage?.[0];
	const serviceStatsBackgroundImage = files?.serviceStatsBackgroundImage?.[0];

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

	if (processBackgroundImage?.buffer) {
		payload.process.backgroundImageUrl = await uploadImageBuffer(
			processBackgroundImage.buffer,
			"vehicle-rental/site-content/process",
		);
	}

	if (serviceStatsBackgroundImage?.buffer) {
		payload.service.statsBackgroundImageUrl = await uploadImageBuffer(
			serviceStatsBackgroundImage.buffer,
			"vehicle-rental/site-content/service",
		);
	}
}

async function loadSiteContentDoc() {
	return SiteContent.findOne({ key: "main" });
}

async function sendSiteContentSection(res, section) {
	try {
		const doc = await loadSiteContentDoc();
		const content = mergeWithDefaults(doc);
		res.json(content[section]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export const getSiteContent = async (_req, res) => {
	try {
		const doc = await loadSiteContentDoc();
		res.json(mergeWithDefaults(doc));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getSiteContentHomeHero = async (_req, res) => {
	await sendSiteContentSection(res, "homeHero");
};

export const getSiteContentAbout = async (_req, res) => {
	await sendSiteContentSection(res, "about");
};

export const getSiteContentProcess = async (_req, res) => {
	await sendSiteContentSection(res, "process");
};

export const getSiteContentService = async (_req, res) => {
	await sendSiteContentSection(res, "service");
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
