import express from "express";
import {
	getPackages,
	createPackage,
	updatePackage,
	deletePackage,
} from "../controller/packageController.js";
import { uploadPackageImage } from "../middleware/packageImageUpload.js";

const router = express.Router();

function withUpload(req, res, next) {
	uploadPackageImage(req, res, (err) => {
		if (!err) {
			next();
			return;
		}
		const message =
			err.code === "LIMIT_FILE_SIZE"
				? "Image must be 5 MB or smaller."
				: err.message || "Upload failed.";
		res.status(400).json({ message });
	});
}

router.get("/", getPackages);
router.post("/", withUpload, createPackage);
router.put("/:id", withUpload, updatePackage);
router.delete("/:id", deletePackage);

export default router;
