import QRCode from "qrcode";

export function buildBikeDetailsUrl(req, bikeId) {
	const configured = process.env.FRONTEND_URL?.trim();
	const origin = configured || req.get("origin") || "http://localhost:5173";
	return `${origin.replace(/\/$/, "")}/bike-details/${bikeId}`;
}

export function generateQrCode(value) {
	return QRCode.toDataURL(value, {
		errorCorrectionLevel: "M",
		margin: 2,
		width: 220,
	});
}

export function generateBikeQrCode(req, bikeId) {
	return generateQrCode(buildBikeDetailsUrl(req, bikeId));
}
