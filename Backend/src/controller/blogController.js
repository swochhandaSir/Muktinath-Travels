import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

function toDTO(doc) {
	if (!doc) return null;
	const o = doc.toObject ? doc.toObject() : doc;
	return {
		id: o._id.toString(),
		title: o.title,
		slug: o.slug,
		description: o.description,
		author: o.author,
		comments: Array.isArray(o.comments) ? o.comments : [],
		image: o.image || "",
		createdAt: o.createdAt,
	};
}

function stripHtml(html) {
	return String(html || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function parseComments(raw) {
	if (raw === undefined || raw === null || raw === "") return [];
	if (Array.isArray(raw)) {
		return raw.map((item) => String(item).trim()).filter(Boolean);
	}
	const text = String(raw).trim();
	if (!text) return [];
	try {
		const parsed = JSON.parse(text);
		if (Array.isArray(parsed)) {
			return parsed.map((item) => String(item).trim()).filter(Boolean);
		}
	} catch {
		// Fall back to comma/newline split.
	}
	return text
		.split(/\r?\n|,/)
		.map((item) => item.trim())
		.filter(Boolean);
}

function validateBlogBody(body, res) {
	const title = typeof body.title === "string" ? body.title.trim() : "";
	const slug = typeof body.slug === "string" ? body.slug.trim() : "";
	const author = typeof body.author === "string" ? body.author.trim() : "";
	const description = typeof body.description === "string" ? body.description : "";
	const comments = parseComments(body.comments);

	if (!title) {
		res.status(400).json({ message: "Title is required." });
		return null;
	}
	if (!slug) {
		res.status(400).json({ message: "Slug is required." });
		return null;
	}
	if (!author) {
		res.status(400).json({ message: "Author is required." });
		return null;
	}
	if (!stripHtml(description)) {
		res.status(400).json({ message: "Description is required." });
		return null;
	}
	return { title, slug, author, description, comments };
}

export const getBlogs = async (req, res) => {
	try {
		const docs = await Blog.find().sort({ createdAt: 1 }).lean();
		res.json(docs.map((d) => toDTO(d)));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createBlog = async (req, res) => {
	try {
		const data = validateBlogBody(req.body, res);
		if (!data) return;
		if (!req.file?.buffer) {
			return res.status(400).json({ message: "Image file is required." });
		}

		const imageUrl = await uploadImageBuffer(req.file.buffer, "vehicle-rental/blogs");
		const doc = await Blog.create({ ...data, image: imageUrl });
		res.status(201).json(toDTO(doc));
	} catch (err) {
		if (err?.code === 11000) {
			return res.status(409).json({ message: "Slug already exists." });
		}
		res.status(500).json({ message: err.message });
	}
};

export const updateBlog = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid blog id." });
		}
		const data = validateBlogBody(req.body, res);
		if (!data) return;

		const updates = { ...data };
		if (req.file?.buffer) {
			updates.image = await uploadImageBuffer(req.file.buffer, "vehicle-rental/blogs");
		}

		const doc = await Blog.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return res.status(404).json({ message: "Blog not found." });
		}
		res.json(toDTO(doc));
	} catch (err) {
		if (err?.code === 11000) {
			return res.status(409).json({ message: "Slug already exists." });
		}
		res.status(500).json({ message: err.message });
	}
};

export const deleteBlog = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid blog id." });
		}
		const doc = await Blog.findByIdAndDelete(id);
		if (!doc) {
			return res.status(404).json({ message: "Blog not found." });
		}
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
