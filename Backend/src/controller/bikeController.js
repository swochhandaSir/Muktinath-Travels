import mongoose from "mongoose";
import Bike from "../models/Bike.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	return {
		id: o._id.toString(),
		name: o.name,
		price: Number(o.pricePerDay).toFixed(2),
		image: o.image || "",
	};
}

function validateNamePrice(name, priceNum, res) {
	if (!name || typeof name !== "string" || !name.trim()) {
		res.status(400).json({ message: "Name is required." });
		return false;
	}
	if (!Number.isFinite(priceNum) || priceNum < 0) {
		res.status(400).json({ message: "Invalid price per day." });
		return false;
	}
	return true;
}

export const getBikes = async (req, res) => {
	try {
		const docs = await Bike.find().sort({ createdAt: 1 }).lean();
		res.json(docs.map((d) => toDTO(d)));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createBike = async (req, res) => {
	try {
		const name = req.body.name;
		const priceNum = Number(req.body.price ?? req.body.pricePerDay);
		if (!validateNamePrice(name, priceNum, res)) return;
		if (!req.file?.buffer) {
			return res.status(400).json({ message: "Image file is required." });
		}

		const imageUrl = await uploadImageBuffer(req.file.buffer);
		const doc = await Bike.create({
			name: name.trim(),
			pricePerDay: priceNum,
			image: imageUrl,
		});
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
		const name = req.body.name;
		const priceNum = Number(req.body.price ?? req.body.pricePerDay);
		if (!validateNamePrice(name, priceNum, res)) return;

		const updates = {
			name: name.trim(),
			pricePerDay: priceNum,
		};
		if (req.file?.buffer) {
			updates.image = await uploadImageBuffer(req.file.buffer);
		}

		const doc = await Bike.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return res.status(404).json({ message: "Bike not found." });
		}
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
