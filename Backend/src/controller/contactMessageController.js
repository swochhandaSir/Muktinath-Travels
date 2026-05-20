import mongoose from "mongoose";
import ContactMessage from "../models/ContactMessage.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	return {
		id: o._id.toString(),
		name: o.name,
		email: o.email,
		phone: o.phone || "",
		subject: o.subject || "",
		message: o.message,
		createdAt: o.createdAt,
	};
}

function validateContactMessageBody(body, res) {
	const name = typeof body.name === "string" ? body.name.trim() : "";
	const email = typeof body.email === "string" ? body.email.trim() : "";
	const phone = typeof body.phone === "string" ? body.phone.trim() : "";
	const subject = typeof body.subject === "string" ? body.subject.trim() : "";
	const message = typeof body.message === "string" ? body.message.trim() : "";

	if (!name) {
		res.status(400).json({ message: "Name is required." });
		return null;
	}
	if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
		res.status(400).json({ message: "Valid email is required." });
		return null;
	}
	if (!message) {
		res.status(400).json({ message: "Message is required." });
		return null;
	}

	return { name, email, phone, subject, message };
}

export const getContactMessages = async (_req, res) => {
	try {
		const docs = await ContactMessage.find().sort({ createdAt: -1 });
		res.json(docs.map((doc) => toDTO(doc)));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createContactMessage = async (req, res) => {
	try {
		const data = validateContactMessageBody(req.body, res);
		if (!data) return;

		const doc = await ContactMessage.create(data);
		res.status(201).json(toDTO(doc));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteContactMessage = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid contact message id." });
		}

		const doc = await ContactMessage.findByIdAndDelete(id);
		if (!doc) {
			return res.status(404).json({ message: "Contact message not found." });
		}
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
