import express from "express";
import {
	createCompanyDetails,
	deleteCompanyDetails,
	getCompanyDetails,
	updateCompanyDetails,
} from "../controller/companyDetailsController.js";
// import { uploadLogoImage } from "../middleware/logoImageUpload.js";
import {uploadImage, withUpload} from "../middleware/ImageUpload.js";


const router = express.Router();

// function withUpload(req, res, next) {
// 	uploadLogoImage(req, res, (err) => {
// 		if (!err) {
// 			next();
// 			return;
// 		}
// 		const message =
// 			err.code === "LIMIT_FILE_SIZE"
// 				? "Logo must be 5 MB or smaller."
// 				: err.message || "Upload failed.";
// 		res.status(400).json({ message });
// 	});
// }

router.get("/", getCompanyDetails);
router.post("/", withUpload, createCompanyDetails);
router.put("/:id", withUpload, updateCompanyDetails);
router.delete("/:id", deleteCompanyDetails);

export default router;
