import express from "express";
import {
	getBikes,
	createBike,
	updateBike,
	deleteBike,
} from "../controller/bikeController.js";
import {uploadImage, withUpload} from "../middleware/ImageUpload.js";

const router = express.Router();

router.get("/", getBikes);
router.post("/", withUpload, createBike);
router.put("/:id", withUpload, updateBike);
router.delete("/:id", deleteBike);

export default router;
