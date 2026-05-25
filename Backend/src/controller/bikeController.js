import mongoose from "mongoose";
import Bike from "../models/Bike.js";
import { generateBikeQrCode } from "../utils/qrCode.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	return {
		id: o._id.toString(),
		name: o.name,
		price: Number(o.pricePerDay).toFixed(2),
		image: o.image || "",
		model: o.model || "",
		color: o.color || "",
		plateNumber: o.plateNumber || "",
		chassisNumber: o.chassisNumber || "",
		engineNumber: o.engineNumber || "",
		mileage: o.mileage ?? 0,
		available: o.available ?? true,
		engineCapacity: o.engineCapacity ?? 0,
		blueBookNumber: o.blueBookNumber || "",
		blueBookImages: Array.isArray(o.blueBookImages) ? o.blueBookImages : [],
		licenseImage: o.licenseImage || "",
		qrCode: o.qrCode || "",
		createdAt: o.createdAt,
		updatedAt: o.updatedAt,
	};
}

function validateBikePayload(payload, res) {
	if (!payload.name) {
		res.status(400).json({ message: "Name is required." });
		return false;
	}
	if (!Number.isFinite(payload.pricePerDay) || payload.pricePerDay < 0) {
		res.status(400).json({ message: "Invalid price per day." });
		return false;
	}
	if (!Number.isFinite(payload.mileage) || payload.mileage < 0) {
		res.status(400).json({ message: "Invalid mileage." });
		return false;
	}
	if (!Number.isFinite(payload.engineCapacity) || payload.engineCapacity < 0) {
		res.status(400).json({ message: "Invalid engine capacity." });
		return false;
	}
	return true;
}

function getBikePayload(body) {
	return {
		name: body.name?.trim() || "",
		pricePerDay: Number(body.price ?? body.pricePerDay),
		model: body.model?.trim() || "",
		color: body.color?.trim() || "",
		plateNumber: body.plateNumber?.trim() || "",
		chassisNumber: body.chassisNumber?.trim() || "",
		engineNumber: body.engineNumber?.trim() || "",
		mileage: Number(body.mileage ?? 0),
		available: body.available === "true" || body.available === true,
		engineCapacity: Number(body.engineCapacity ?? 0),
		blueBookNumber: body.blueBookNumber?.trim() || "",
	};
}

async function uploadLicenseImage(req) {
	const licenseFile = req.files?.licenseImage?.[0];
	return licenseFile?.buffer ? uploadImageBuffer(licenseFile.buffer) : "";
}

function uploadBlueBookImages(req) {
	const files = req.files?.blueBookImages || [];
	return Promise.all(files.map((file) => uploadImageBuffer(file.buffer)));
}

async function setGeneratedQrCode(req, doc) {
	doc.qrCode = await generateBikeQrCode(req, doc._id.toString());
	await doc.save();
}

export const getBikes = async (req, res) => {
	try {
		const docs = await Bike.find().sort({ createdAt: 1 }).lean();
		res.json(docs.map((d) => toDTO(d)));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getBikeById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid bike id." });
		}

		const bike = await Bike.findById(id).lean();
		if (!bike) {
			return res.status(404).json({ message: "Bike not found." });
		}

		res.json(toDTO(bike));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createBike = async (req, res) => {
	try {
		const payload = getBikePayload(req.body);
		if (!validateBikePayload(payload, res)) return;

		if (!req.file?.buffer) {
			return res.status(400).json({ message: "Image file is required." });
		}

		const doc = await Bike.create({
			...payload,
			image: await uploadImageBuffer(req.file.buffer),
			licenseImage: await uploadLicenseImage(req),
			blueBookImages: await uploadBlueBookImages(req),
		});
		await setGeneratedQrCode(req, doc);
		res.status(201).json(toDTO(doc));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateBike = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid bike id." });
		}

		const updates = getBikePayload(req.body);
		if (!validateBikePayload(updates, res)) return;

		if (req.file?.buffer) {
			updates.image = await uploadImageBuffer(req.file.buffer);
		}
		const licenseImage = await uploadLicenseImage(req);
		if (licenseImage) {
			updates.licenseImage = licenseImage;
		}
		const blueBookImages = await uploadBlueBookImages(req);

		const doc = await Bike.findById(id);
		if (!doc) {
			return res.status(404).json({ message: "Bike not found." });
		}
		Object.assign(doc, updates);
		if (blueBookImages.length > 0) {
			doc.blueBookImages.push(...blueBookImages);
		}
		if (!doc.qrCode) {
			await setGeneratedQrCode(req, doc);
		} else {
			await doc.save();
		}
		res.json(toDTO(doc));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteBikeLicenseImage = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid bike id." });
		}

		const doc = await Bike.findByIdAndUpdate(
			id,
			{ licenseImage: "" },
			{ new: true, runValidators: true },
		);
		if (!doc) {
			return res.status(404).json({ message: "Bike not found." });
		}
		res.json(toDTO(doc));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteBikeBlueBookImage = async (req, res) => {
	try {
		const { id, imageIndex } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid bike id." });
		}

		const index = Number.parseInt(imageIndex, 10);
		if (!Number.isInteger(index) || index < 0) {
			return res.status(400).json({ message: "Invalid bluebook image index." });
		}

		const doc = await Bike.findById(id);
		if (!doc) {
			return res.status(404).json({ message: "Bike not found." });
		}
		if (index >= doc.blueBookImages.length) {
			return res.status(404).json({ message: "Bluebook image not found." });
		}

		doc.blueBookImages.splice(index, 1);
		await doc.save();
		res.json(toDTO(doc));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteBike = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid bike id." });
		}
		const doc = await Bike.findByIdAndDelete(id);
		if (!doc) {
			return res.status(404).json({ message: "Bike not found." });
		}
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
