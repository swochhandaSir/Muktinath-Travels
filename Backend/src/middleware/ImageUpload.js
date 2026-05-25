import multer from "multer";

const storage = multer.memoryStorage();

export const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed."));
            return;
        }
        cb(null, true);
    },
}).single("image");

const uploadImageFields = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed."));
            return;
        }
        cb(null, true);
    },
}).fields([
    { name: "image", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
]);

export const withUpload = (req, res, next) => {
    uploadImageFields(req, res, (err) => {
        if (!err) {
            req.file = req.files?.image?.[0];
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
