import express from "express";
import multer from "multer";
import {
	getSiteContent,
	getSiteContentHomeHero,
	getSiteContentAbout,
	getSiteContentProcess,
	getSiteContentService,
	updateSiteContent,
} from "../controller/siteContentController.js";

const router = express.Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter(_req, file, cb) {
		if (!file.mimetype.startsWith("image/")) {
			cb(new Error("Only image files are allowed."));
			return;
		}
		cb(null, true);
	},
});

function withSiteContentUpload(req, res, next) {
	upload.fields([
		{ name: "homeHeroImage", maxCount: 1 },
		{ name: "aboutPrimaryImage", maxCount: 1 },
		{ name: "aboutSecondaryImage", maxCount: 1 },
		{ name: "processBackgroundImage", maxCount: 1 },
		{ name: "serviceStatsBackgroundImage", maxCount: 1 },
	])(req, res, (err) => {
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

router.get("/", getSiteContent);
router.get("/home-hero", getSiteContentHomeHero);
router.get("/about", getSiteContentAbout);
router.get("/process", getSiteContentProcess);
router.get("/service", getSiteContentService);
router.put("/", withSiteContentUpload, updateSiteContent);

export default router;
