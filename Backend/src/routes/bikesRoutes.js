import express from "express";
import {
	getBikes,
	createBike,
	updateBike,
	deleteBike,
} from "../controller/bikeController.js";

const router = express.Router();

router.get("/", getBikes);
router.post("/", createBike);
router.put("/:id", updateBike);
router.delete("/:id", deleteBike);

export default router;
