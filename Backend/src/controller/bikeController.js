import mongoose from "mongoose";
import Bike from "../models/Bike.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	return {
		id: o._id.toString(),
		name: o.name,
		price: Number(o.pricePerDay).toFixed(2),
		rating: o.rating || "5",
		transmission: o.transmission,
		fuel: o.fuel,
		year: o.year,
		mileage: o.mileage || "—",
	};
}

function parseBody(req) {
	const { name, price, rating, transmission, fuel, year, mileage } = req.body;
	const priceNum = Number(price);
	const yearNum = Number(year);
	const ratingValue = rating === undefined || rating === "" ? "5" : String(rating);
	return {
		name,
		priceNum,
		rating: ratingValue,
		transmission,
		fuel,
		yearNum,
		mileage,
	};
}

function validateVehicleInput({
	name,
	priceNum,
	rating,
	yearNum,
	res,
}) {
	if (!name || typeof name !== "string" || !name.trim()) {
		res.status(400).json({ message: "Name is required." });
		return null;
	}
	if (!Number.isFinite(priceNum) || priceNum < 0) {
		res.status(400).json({ message: "Invalid price per day." });
		return null;
	}
	if (!["1", "2", "3", "4", "5"].includes(rating)) {
		res.status(400).json({ message: "Rating must be from 1 to 5." });
		return null;
	}
	if (!Number.isFinite(yearNum) || yearNum < 1900 || yearNum > 2100) {
		res.status(400).json({ message: "Invalid year." });
		return null;
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
		const { name, priceNum, transmission, fuel, yearNum, mileage, rating } =
			parseBody(req);
		if (
			!validateVehicleInput({
				name,
				priceNum,
				rating,
				yearNum,
				res,
			})
		) {
			return;
		}

		const doc = await Bike.create({
			name: name.trim(),
			pricePerDay: priceNum,
			rating,
			transmission: transmission === "MT" ? "MT" : "AT",
			fuel: (fuel && String(fuel).trim()) || "petrol",
			year: yearNum,
			mileage:
				mileage && String(mileage).trim()
					? String(mileage).trim()
					: "—",
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
		const { name, priceNum, rating, transmission, fuel, yearNum, mileage } =
			parseBody(req);
		if (
			!validateVehicleInput({
				name,
				priceNum,
				rating,
				yearNum,
				res,
			})
		) {
			return;
		}

		const doc = await Bike.findByIdAndUpdate(
			id,
			{
				name: name.trim(),
				pricePerDay: priceNum,
				rating,
				transmission: transmission === "MT" ? "MT" : "AT",
				fuel: (fuel && String(fuel).trim()) || "petrol",
				year: yearNum,
				mileage:
					mileage && String(mileage).trim()
						? String(mileage).trim()
						: "—",
			},
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
