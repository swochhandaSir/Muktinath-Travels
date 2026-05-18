import mongoose from "mongoose";
import Bike from "../models/Bike.js";
import BikeBooking from "../models/BikeBookings.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	const bike = o.bike && typeof o.bike === "object" ? o.bike : null;

	return {
		id: o._id.toString(),
		bike: bike
			? {
					id: bike._id.toString(),
					name: bike.name,
				}
			: null,
		bikeName: bike?.name || "",
		customerName: o.customerName,
		customerEmail: o.customerEmail,
		customerPhone: o.customerPhone,
		pickupDate: o.pickupDate,
		returnDate: o.returnDate,
		pickupLocation: o.pickupLocation,
		returnLocation: o.returnLocation,
		message: o.message || "",
		createdAt: o.createdAt,
	};
}

function parseDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function validateBookingBody(body, res) {
	const bike = body.bike;
	const customerName =
		typeof body.customerName === "string"
			? body.customerName.trim()
			: typeof body.fullName === "string"
				? body.fullName.trim()
				: "";
	const customerEmail =
		typeof body.customerEmail === "string"
			? body.customerEmail.trim()
			: typeof body.email === "string"
				? body.email.trim()
				: "";
	const customerPhone =
		typeof body.customerPhone === "string"
			? body.customerPhone.trim()
			: typeof body.phone === "string"
				? body.phone.trim()
				: "";
	const pickupLocation =
		typeof body.pickupLocation === "string" ? body.pickupLocation.trim() : "";
	const returnLocation =
		typeof body.returnLocation === "string"
			? body.returnLocation.trim()
			: typeof body.dropoffLocation === "string"
				? body.dropoffLocation.trim()
				: "";
	const pickupDate = parseDate(body.pickupDate);
	const returnDate = parseDate(body.returnDate);
	const message = typeof body.message === "string" ? body.message.trim() : "";

	if (!mongoose.Types.ObjectId.isValid(bike)) {
		res.status(400).json({ message: "Valid bike is required." });
		return null;
	}
	if (!customerName) {
		res.status(400).json({ message: "Full name is required." });
		return null;
	}
	if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
		res.status(400).json({ message: "Valid email is required." });
		return null;
	}
	if (!customerPhone) {
		res.status(400).json({ message: "Phone is required." });
		return null;
	}
	if (!pickupLocation) {
		res.status(400).json({ message: "Pickup location is required." });
		return null;
	}
	if (!returnLocation) {
		res.status(400).json({ message: "Dropoff location is required." });
		return null;
	}
	if (!pickupDate) {
		res.status(400).json({ message: "Valid pickup date is required." });
		return null;
	}
	if (!returnDate) {
		res.status(400).json({ message: "Valid return date is required." });
		return null;
	}
	if (returnDate < pickupDate) {
		res.status(400).json({ message: "Return date must be after pickup date." });
		return null;
	}

	return {
		bike,
		customerName,
		customerEmail,
		customerPhone,
		pickupLocation,
		returnLocation,
		pickupDate,
		returnDate,
		message,
	};
}

export const getBikeBookings = async (_req, res) => {
	try {
		const docs = await BikeBooking.find()
			.populate("bike", "name")
			.sort({ createdAt: -1 });
		res.json(docs.map((doc) => toDTO(doc)));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createBikeBooking = async (req, res) => {
	try {
		const data = validateBookingBody(req.body, res);
		if (!data) return;

		const bikeExists = await Bike.exists({ _id: data.bike });
		if (!bikeExists) {
			return res.status(404).json({ message: "Bike not found." });
		}

		const doc = await BikeBooking.create(data);
		const populated = await doc.populate("bike", "name");
		res.status(201).json(toDTO(populated));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteBikeBooking = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid booking id." });
		}

		const doc = await BikeBooking.findByIdAndDelete(id);
		if (!doc) {
			return res.status(404).json({ message: "Booking not found." });
		}
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
