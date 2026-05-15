import express from "express";
import {
	getBikes,
	createBike,
	updateBike,
	deleteBike,
} from "../controller/bikeController.js";
import { uploadBikeImage } from "../middleware/bikeImageUpload.js";

const router = express.Router();

function withUpload(req, res, next) {
	uploadBikeImage(req, res, (err) => {
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

router.get("/", getBikes);
router.post("/", withUpload, createBike);
router.put("/:id", withUpload, updateBike);
router.delete("/:id", deleteBike);

export default router;
