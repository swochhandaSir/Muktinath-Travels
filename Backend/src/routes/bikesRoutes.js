import express from "express";
import {
	getBikes,
	createBike,
	updateBike,
	deleteBike,
	getBikeById,
} from "../controller/bikeController.js";
import {uploadImage, withUpload} from "../middleware/ImageUpload.js";

const router = express.Router();

router.get("/", getBikes);
router.get("/:id", getBikeById);
router.post("/", withUpload, createBike);
router.put("/:id", withUpload, updateBike);
router.delete("/:id", deleteBike);

export default router;
