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
		model: o.model || "",
		color: o.color || "",
		plateNumber: o.plateNumber || "",
		chassisNumber: o.chassisNumber || "",
		engineNumber: o.engineNumber || "",
		mileage: o.mileage ?? 0,
		available: o.available ?? true,
		engineCapacity: o.engineCapacity ?? 0,
		blueBookNumber: o.blueBookNumber || "",
		licenseImage: o.licenseImage || "",
		qrCode: o.qrCode || "",
		createdAt: o.createdAt,
		updatedAt: o.updatedAt,
	};
}

function buildBikeDetailsUrl(req, bikeId) {
	const configured = process.env.FRONTEND_URL?.trim();
	const origin = configured || req.get("origin") || "http://localhost:5173";
	return `${origin.replace(/\/$/, "")}/bike-details/${bikeId}`;
}

function buildQrCodeUrl(detailsUrl) {
	return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(detailsUrl)}`;
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

export const getBikeById = async (req, res) => {
	try{
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success:false,
				message: "Invalid bike id." });
		}
		const bike = await Bike.findById(id).lean();
		if (!bike) {
			return res.status(404).json({
				success:false,
				message: "Bike not found." });
		}
		res.json(toDTO(bike));
	}catch(err){
		res.status(500).json({ message: err.message });
	}
}

export const createBike = async (req, res) => {
	try {
		const name = req.body.name;
		const priceNum = Number(req.body.price ?? req.body.pricePerDay);
		const model = req.body.model?.trim() || "";
		const color = req.body.color?.trim() || "";
		const plateNumber = req.body.plateNumber?.trim() || "";
		const chassisNumber = req.body.chassisNumber?.trim() || "";
		const engineNumber = req.body.engineNumber?.trim() || "";
		const mileage = Number(req.body.mileage ?? 0);
		const blueBookNumber = req.body.blueBookNumber?.trim() || "";

		const available =
			req.body.available === "true" || req.body.available === true;
		const engineCapacity = Number(req.body.engineCapacity ?? 0);
		if (!validateNamePrice(name, priceNum, res)) return;
		if (!Number.isFinite(mileage) || mileage < 0) {
			return res.status(400).json({ message: "Invalid mileage." });
		}
		if (!Number.isFinite(engineCapacity) || engineCapacity < 0) {
			return res.status(400).json({ message: "Invalid engine capacity." });
		}

		//remove while testing in thunderclient
		if (!req.file?.buffer) {
			return res.status(400).json({ message: "Image file is required." });
		}

		const imageUrl = await uploadImageBuffer(req.file.buffer);

		//add this when testing api because multer expects file upload and i dont know how to upload file in thunderclient
		// let imageUrl = "";
		// if (req.file?.buffer) {
		// 	imageUrl = await uploadImageBuffer(req.file.buffer);
		// }

		const licenseFile = req.files?.licenseImage?.[0];
		const licenseImageUrl = licenseFile?.buffer
			? await uploadImageBuffer(licenseFile.buffer)
			: "";

		const doc = await Bike.create({
			name: name.trim(),
			pricePerDay: priceNum,
			image: imageUrl,
			model,
			color,
			plateNumber,
			chassisNumber,
			engineNumber,
			mileage,
			available,
			engineCapacity,
			blueBookNumber,
			licenseImage: licenseImageUrl,
		});
		doc.qrCode = buildQrCodeUrl(buildBikeDetailsUrl(req, doc._id.toString()));
		await doc.save();
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
		const mileage = Number(req.body.mileage ?? 0);
		const engineCapacity = Number(req.body.engineCapacity ?? 0);
		if (!validateNamePrice(name, priceNum, res)) return;
		if (!Number.isFinite(mileage) || mileage < 0) {
			return res.status(400).json({ message: "Invalid mileage." });
		}
		if (!Number.isFinite(engineCapacity) || engineCapacity < 0) {
			return res.status(400).json({ message: "Invalid engine capacity." });
		}

		const updates = {
			name: name.trim(),
			pricePerDay: priceNum,
			model: req.body.model?.trim() || "",
			color: req.body.color?.trim() || "",
			plateNumber: req.body.plateNumber?.trim() || "",
			chassisNumber: req.body.chassisNumber?.trim() || "",
			engineNumber: req.body.engineNumber?.trim() || "",
			mileage,
			available: req.body.available === "true" || req.body.available === true,
			engineCapacity,
			blueBookNumber: req.body.blueBookNumber?.trim() || "",
		};
		if (req.file?.buffer) {
			updates.image = await uploadImageBuffer(req.file.buffer);
		}
		const licenseFile = req.files?.licenseImage?.[0];
		if (licenseFile?.buffer) {
			updates.licenseImage = await uploadImageBuffer(licenseFile.buffer);
		}

		const doc = await Bike.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return res.status(404).json({ message: "Bike not found." });
		}
		if (!doc.qrCode) {
			doc.qrCode = buildQrCodeUrl(buildBikeDetailsUrl(req, doc._id.toString()));
			await doc.save();
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
