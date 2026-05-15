import mongoose from "mongoose";
import Package from "../models/Package.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	return {
		id: o._id.toString(),
		title: o.title,
		location: o.location,
		duration: o.duration,
		groupSize: o.groupSize,
		price: Number(o.price).toFixed(2),
		image: o.image || "",
		itinerary: (o.itinerary || []).map((d) => ({
			dayNumber: d.dayNumber,
			description: d.description,
		})),
		exploreLink: o.exploreLink || "",
	};
}

function parseItinerary(raw) {
	if (!raw) return [];
	let parsed = raw;
	if (typeof raw === "string") {
		try {
			parsed = JSON.parse(raw);
		} catch {
			return { error: "Invalid itinerary format." };
		}
	}
	if (!Array.isArray(parsed)) {
		return { error: "Itinerary must be an array." };
	}
	const itinerary = [];
	for (const item of parsed) {
		const dayNumber =
			typeof item?.dayNumber === "string" ? item.dayNumber.trim() : "";
		const description =
			typeof item?.description === "string" ? item.description.trim() : "";
		if (!dayNumber || !description) continue;
		itinerary.push({ dayNumber, description });
	}
	return { itinerary };
}

function validatePackageBody(body, res) {
	const title = body.title;
	const location = body.location;
	const duration = body.duration;
	const groupSize = Number(body.groupSize);
	const price = Number(body.price);

	if (!title || typeof title !== "string" || !title.trim()) {
		res.status(400).json({ message: "Title is required." });
		return null;
	}
	if (!location || typeof location !== "string" || !location.trim()) {
		res.status(400).json({ message: "Location is required." });
		return null;
	}
	if (!duration || typeof duration !== "string" || !duration.trim()) {
		res.status(400).json({ message: "Duration is required." });
		return null;
	}
	if (!Number.isFinite(groupSize) || groupSize < 1) {
		res.status(400).json({ message: "Group size must be at least 1." });
		return null;
	}
	if (!Number.isFinite(price) || price < 0) {
		res.status(400).json({ message: "Invalid price." });
		return null;
	}

	const itineraryResult = parseItinerary(body.itinerary);
	if (itineraryResult.error) {
		res.status(400).json({ message: itineraryResult.error });
		return null;
	}
	if (itineraryResult.itinerary.length === 0) {
		res.status(400).json({ message: "Add at least one itinerary day." });
		return null;
	}

	const exploreLink =
		typeof body.exploreLink === "string" ? body.exploreLink.trim() : "";

	return {
		title: title.trim(),
		location: location.trim(),
		duration: duration.trim(),
		groupSize,
		price,
		itinerary: itineraryResult.itinerary,
		exploreLink,
	};
}

export const getPackages = async (req, res) => {
	try {
		const docs = await Package.find().sort({ createdAt: 1 }).lean();
		res.json(docs.map((d) => toDTO(d)));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createPackage = async (req, res) => {
	try {
		const data = validatePackageBody(req.body, res);
		if (!data) return;
		if (!req.file?.buffer) {
			return res.status(400).json({ message: "Image file is required." });
		}

		const imageUrl = await uploadImageBuffer(req.file.buffer);
		const doc = await Package.create({ ...data, image: imageUrl });
		res.status(201).json(toDTO(doc));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updatePackage = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid package id." });
		}
		const data = validatePackageBody(req.body, res);
		if (!data) return;

		const updates = { ...data };
		if (req.file?.buffer) {
			updates.image = await uploadImageBuffer(req.file.buffer);
		}

		const doc = await Package.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return res.status(404).json({ message: "Package not found." });
		}
		res.json(toDTO(doc));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deletePackage = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid package id." });
		}
		const doc = await Package.findByIdAndDelete(id);
		if (!doc) {
			return res.status(404).json({ message: "Package not found." });
		}
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
