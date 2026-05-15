import { v2 as cloudinary } from "cloudinary";

const cloudName =
	process.env.Cloudinary_Cloud_Name ?? process.env.CLOUDINARY_CLOUD_NAME;
const apiKey =
	process.env.Cloudinary_API_Key ?? process.env.CLOUDINARY_API_KEY;
const apiSecret =
	process.env.Cloudinary_API_Secret ?? process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
	cloud_name: cloudName,
	api_key: apiKey,
	api_secret: apiSecret,
});

export function assertCloudinaryConfigured() {
	if (!cloudName || !apiKey || !apiSecret) {
		throw new Error(
			"Missing Cloudinary env: set Cloudinary_Cloud_Name, Cloudinary_API_Key, and Cloudinary_API_Secret (or CLOUDINARY_* equivalents).",
		);
	}
}

export default cloudinary;
