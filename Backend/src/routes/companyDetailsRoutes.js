import express from "express";
import {
	createCompanyDetails,
	deleteCompanyDetails,
	getCompanyDetails,
	updateCompanyDetails,
} from "../controller/companyDetailsController.js";
import {uploadImage, withUpload} from "../middleware/ImageUpload.js";


const router = express.Router();

router.get("/", getCompanyDetails);
router.post("/", withUpload, createCompanyDetails);
router.put("/:id", withUpload, updateCompanyDetails);
router.delete("/:id", deleteCompanyDetails);

export default router;
