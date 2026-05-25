import mongoose from "mongoose";
import CompanyDetails from "../models/CompanyDetails.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

const textFields = [
	"name",
	"contactEmail",
	"contactPhone",
	"location",
	"about",
	"facebook",
	"tiktok",
	"instagram",
	"whatsapp",
];

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	return {
		id: o._id.toString(),
		name: o.name,
		logo: o.logo || "",
		contactEmail: o.contactEmail || "",
		contactPhone: o.contactPhone || "",
		whatsapp: o.whatsapp || "",
		location: o.location || "",
		about: o.about || "",
		facebook: o.facebook || "",
		tiktok: o.tiktok || "",
		instagram: o.instagram || "",
		createdAt: o.createdAt,
		updatedAt: o.updatedAt,
	};
}

function buildPayload(body, res) {
	const payload = {};
	for (const field of textFields) {
		payload[field] = typeof body[field] === "string" ? body[field].trim() : "";
	}

	if (!payload.name) {
		res.status(400).json({ message: "Company name is required." });
		return null;
	}

	return payload;
}

export const getCompanyDetails = async (req, res) => {
	try {
		const doc = await CompanyDetails.findOne().sort({ createdAt: 1 });
		if (!doc) {
			return res.status(404).json({ message: "Company details not found." });
		}
		res.json(toDTO(doc));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const createCompanyDetails = async (req, res) => {
	try {
		const existing = await CompanyDetails.findOne().select("_id").lean();
		if (existing) {
			return res.status(409).json({
				message:
					"Company details already exists. Update or delete the existing details first.",
			});
		}

		const data = buildPayload(req.body, res);
		if (!data) return;

		if (req.file?.buffer) {
			data.logo = await uploadImageBuffer(req.file.buffer);
		}

		const doc = await CompanyDetails.create(data);
		res.status(201).json(toDTO(doc));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateCompanyDetails = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid company details id." });
		}

		const updates = buildPayload(req.body, res);
		if (!updates) return;

		if (req.file?.buffer) {
			updates.logo = await uploadImageBuffer(req.file.buffer);
		}

		const doc = await CompanyDetails.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return res.status(404).json({ message: "Company details not found." });
		}
		res.json(toDTO(doc));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteCompanyDetails = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid company details id." });
		}

		const doc = await CompanyDetails.findByIdAndDelete(id);
		if (!doc) {
			return res.status(404).json({ message: "Company details not found." });
		}
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

