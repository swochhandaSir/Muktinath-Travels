import mongoose from "mongoose";
import Package from "../models/Package.js";
import PackageBooking from "../models/PackageBookings.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	const pkg = o.package && typeof o.package === "object" ? o.package : null;

	return {
		id: o._id.toString(),
		package: pkg
			? {
					id: pkg._id.toString(),
					title: pkg.title,
					location: pkg.location,
					duration: pkg.duration,
					price: pkg.price,
				}
			: null,
		packageTitle: pkg?.title || "",
		customerName: o.customerName,
		customerEmail: o.customerEmail,
		customerPhone: o.customerPhone,
		numberOfPeople: o.numberOfPeople,
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
	const packageId = body.package || body.packageId;
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
	const numberOfPeople = Number(body.numberOfPeople);
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

	if (!mongoose.Types.ObjectId.isValid(packageId)) {
		res.status(400).json({ message: "Valid package is required." });
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
	if (!Number.isFinite(numberOfPeople) || numberOfPeople < 1) {
		res.status(400).json({ message: "Number of people must be at least 1." });
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
		package: packageId,
		customerName,
		customerEmail,
		customerPhone,
		numberOfPeople,
		pickupLocation,
		returnLocation,
		pickupDate,
		returnDate,
		message,
	};
}

export const getPackageBookings = async (_req, res) => {
	try {
		const docs = await PackageBooking.find()
			.populate("package", "title location duration price")
			.sort({ createdAt: -1 });
		res.json(docs.map((doc) => toDTO(doc)));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createPackageBooking = async (req, res) => {
	try {
		const data = validateBookingBody(req.body, res);
		if (!data) return;

		const packageExists = await Package.exists({ _id: data.package });
		if (!packageExists) {
			return res.status(404).json({ message: "Package not found." });
		}

		const doc = await PackageBooking.create(data);
		const populated = await doc.populate(
			"package",
			"title location duration price",
		);
		res.status(201).json(toDTO(populated));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deletePackageBooking = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid booking id." });
		}

		const doc = await PackageBooking.findByIdAndDelete(id);
		if (!doc) {
			return res.status(404).json({ message: "Booking not found." });
		}
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
