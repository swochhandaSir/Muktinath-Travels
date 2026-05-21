import express from "express";
import {
	createBlog,
	deleteBlog,
	getBlogs,
	updateBlog,
} from "../controller/blogController.js";
import { withUpload } from "../middleware/ImageUpload.js";

const router = express.Router();

router.get("/", getBlogs);
router.post("/", withUpload, createBlog);
router.put("/:id", withUpload, updateBlog);
router.delete("/:id", deleteBlog);

export default router;
