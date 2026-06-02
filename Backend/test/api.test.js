import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

process.env.Cloudinary_Cloud_Name = "test-cloud";
process.env.Cloudinary_API_Key = "test-key";
process.env.Cloudinary_API_Secret = "test-secret";
process.env.EMAIL_HOST = "127.0.0.1";
process.env.EMAIL_PORT = "9";
process.env.EMAIL_USER = "test-user";
process.env.EMAIL_PASS = "test-pass";
process.env.EMAIL_FROM = "test@example.com";
process.env.EMAIL_TO = "owner@example.com";
process.env.EMAIL_DISABLED = "true";
process.env.FRONTEND_URL = "http://localhost:5173";

const imageBuffer = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
	"base64",
);

let app;
let mongoServer;
let uploadCount = 0;
let models;

function imageUrl(folder = "upload") {
	uploadCount += 1;
	return `https://cdn.example.com/${folder}/${uploadCount}.png`;
}

function bikePayload(overrides = {}) {
	return {
		name: "Royal Enfield Classic",
		price: "2500",
		model: "Classic 350",
		color: "Black",
		plateNumber: "BA 1 PA 1234",
		chassisNumber: "CH-123",
		engineNumber: "EN-123",
		mileage: "30",
		available: "true",
		engineCapacity: "350",
		blueBookNumber: "BB-123",
		...overrides,
	};
}

function blogPayload(overrides = {}) {
	return {
		title: "Best rides around Pokhara",
		slug: "best-rides-pokhara",
		description: "<p>Useful riding guide.</p>",
		author: "Admin",
		comments: JSON.stringify(["Great"]),
		...overrides,
	};
}

function companyPayload(overrides = {}) {
	return {
		name: "Third Generation Rider",
		contactEmail: "hello@example.com",
		contactPhone: "9800000000",
		whatsapp: "9800000000",
		location: "Kathmandu",
		businessHours: "9 AM - 6 PM",
		about: "Bike rental company",
		facebook: "https://facebook.example.com",
		tiktok: "https://tiktok.example.com",
		instagram: "https://instagram.example.com",
		...overrides,
	};
}

function packagePayload(overrides = {}) {
	return {
		title: "Upper Mustang Ride",
		location: "Mustang",
		duration: "7 days",
		groupSize: "6",
		price: "65000",
		itinerary: JSON.stringify([
			{ dayNumber: "Day 1", description: "Ride to Pokhara" },
		]),
		tripHighlights: JSON.stringify(["Mountain roads"]),
		inclusions: JSON.stringify(["Guide"]),
		packageExperience: "A guided motorcycle tour.",
		...overrides,
	};
}

function bookingPayload(resourceId, overrides = {}) {
	return {
		customerName: "Test Customer",
		customerEmail: "customer@example.com",
		customerPhone: "9800000001",
		pickupDate: "2026-07-01",
		returnDate: "2026-07-03",
		pickupLocation: "Kathmandu",
		returnLocation: "Kathmandu",
		message: "Please confirm availability.",
		...resourceId,
		...overrides,
	};
}

function siteContentPayload(overrides = {}) {
	return {
		homeHero: {
			title: "Ride Nepal",
			subtitle: "Book reliable bikes",
			buttonText: "Book now",
			imageUrl: "https://example.com/hero.jpg",
		},
		about: {
			heading: "About us",
			description: "We rent bikes.",
			visionText: "Trusted rentals",
			missionText: "Reliable rides",
			closingText: "Ride with confidence",
			experienceYears: "5+",
			experienceLabel: "Years",
			features: ["Maintained bikes"],
			primaryImageUrl: "https://example.com/about-1.jpg",
			secondaryImageUrl: "https://example.com/about-2.jpg",
		},
		process: {
			heading: "Process",
			subheading: "Simple booking",
			description: "Choose, book, ride.",
			backgroundImageUrl: "https://example.com/process.jpg",
			steps: [{ number: "01.", title: "Choose", description: "Pick a bike" }],
		},
		service: {
			heading: "Services",
			description: "Bike rentals and tours.",
			cards: [{ icon: "Bike", title: "Rentals", description: "Daily rentals" }],
			statsBackgroundImageUrl: "https://example.com/stats.jpg",
			stats: [{ icon: "Users", number: "100+", label: "Customers" }],
			reviewsHeading: "Reviews",
			reviewsDescription: "Customer feedback",
			reviews: [{ name: "Alex", review: "Good service" }],
		},
		...overrides,
	};
}

async function createBike() {
	const res = await request(app)
		.post("/api/bikes")
		.field(bikePayload())
		.attach("image", imageBuffer, "bike.png")
		.attach("licenseImage", imageBuffer, "license.png")
		.attach("blueBookImages", imageBuffer, "bluebook.png")
		.expect(201);
	return res.body;
}

async function createPackage() {
	const res = await request(app)
		.post("/api/packages")
		.field(packagePayload())
		.attach("image", imageBuffer, "package.png")
		.expect(201);
	return res.body;
}

before(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());

	const cloudinaryModule = await import("../src/config/cloudinary.js");
	cloudinaryModule.default.uploader.upload_stream = (options, callback) => ({
		end() {
			callback(null, { secure_url: imageUrl(options.folder) });
		},
	});

	const appModule = await import("../src/app.js");
	app = appModule.createApp();

	models = [
		(await import("../src/models/Bike.js")).default,
		(await import("../src/models/BikeBookings.js")).default,
		(await import("../src/models/Blog.js")).default,
		(await import("../src/models/CompanyDetails.js")).default,
		(await import("../src/models/ContactMessage.js")).default,
		(await import("../src/models/Package.js")).default,
		(await import("../src/models/PackageBookings.js")).default,
		(await import("../src/models/SiteContent.js")).default,
	];
});

afterEach(async () => {
	await Promise.all(models.map((model) => model.deleteMany({})));
});

after(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe("API", () => {
	it("serves the health endpoint", async () => {
		const res = await request(app).get("/").expect(200);
		assert.equal(res.text, "API Running");
	});

	it("covers bike CRUD endpoints and image deletion endpoints", async () => {
		await request(app).get("/api/bikes").expect(200).expect([]);

		const bike = await createBike();
		assert.equal(bike.name, "Royal Enfield Classic");
		assert.equal(bike.price, "2500.00");
		assert.equal(bike.blueBookImages.length, 1);
		assert.match(bike.qrCode, /^data:image\/png;base64,/);

		const fetched = await request(app).get(`/api/bikes/${bike.id}`).expect(200);
		assert.equal(fetched.body.id, bike.id);

		const updated = await request(app)
			.put(`/api/bikes/${bike.id}`)
			.field(bikePayload({ name: "Honda XR", price: "3000" }))
			.attach("blueBookImages", imageBuffer, "bluebook-2.png")
			.expect(200);
		assert.equal(updated.body.name, "Honda XR");
		assert.equal(updated.body.blueBookImages.length, 2);

		const noLicense = await request(app)
			.delete(`/api/bikes/${bike.id}/license-image`)
			.expect(200);
		assert.equal(noLicense.body.licenseImage, "");

		const noBluebook = await request(app)
			.delete(`/api/bikes/${bike.id}/bluebook-images/0`)
			.expect(200);
		assert.equal(noBluebook.body.blueBookImages.length, 1);

		await request(app).delete("/api/bikes/not-an-id").expect(400);
		await request(app).delete(`/api/bikes/${bike.id}`).expect(204);
		await request(app).get(`/api/bikes/${bike.id}`).expect(404);
	});

	it("covers blog CRUD endpoints", async () => {
		await request(app).get("/api/blogs").expect(200).expect([]);

		const created = await request(app)
			.post("/api/blogs")
			.field(blogPayload())
			.attach("image", imageBuffer, "blog.png")
			.expect(201);
		assert.equal(created.body.slug, "best-rides-pokhara");

		const updated = await request(app)
			.put(`/api/blogs/${created.body.id}`)
			.field(blogPayload({ title: "Updated ride guide" }))
			.expect(200);
		assert.equal(updated.body.title, "Updated ride guide");

		await request(app).post("/api/blogs").field(blogPayload({ title: "" })).expect(400);
		await request(app).delete("/api/blogs/not-an-id").expect(400);
		await request(app).delete(`/api/blogs/${created.body.id}`).expect(204);
	});

	it("covers company details endpoints", async () => {
		await request(app).get("/api/company-details").expect(404);

		const created = await request(app)
			.post("/api/company-details")
			.field(companyPayload())
			.attach("image", imageBuffer, "logo.png")
			.expect(201);
		assert.equal(created.body.name, "Third Generation Rider");

		await request(app).get("/api/company-details").expect(200);
		await request(app).post("/api/company-details").field(companyPayload()).expect(409);

		const updated = await request(app)
			.put(`/api/company-details/${created.body.id}`)
			.field(companyPayload({ name: "Updated Company" }))
			.expect(200);
		assert.equal(updated.body.name, "Updated Company");

		await request(app).delete("/api/company-details/not-an-id").expect(400);
		await request(app).delete(`/api/company-details/${created.body.id}`).expect(204);
	});

	it("covers contact message endpoints", async () => {
		await request(app).get("/api/contact-messages").expect(200).expect([]);

		const created = await request(app)
			.post("/api/contact-messages")
			.send({
				name: "Customer",
				email: "customer@example.com",
				phone: "9800000002",
				subject: "Rental",
				message: "I want to rent a bike.",
			})
			.expect(201);
		assert.equal(created.body.email, "customer@example.com");

		await request(app)
			.post("/api/contact-messages")
			.send({ name: "Customer", email: "bad", message: "Hello" })
			.expect(400);
		await request(app).delete("/api/contact-messages/not-an-id").expect(400);
		await request(app).delete(`/api/contact-messages/${created.body.id}`).expect(204);
	});

	it("covers package CRUD endpoints", async () => {
		await request(app).get("/api/packages").expect(200).expect([]);

		const created = await createPackage();
		assert.equal(created.title, "Upper Mustang Ride");
		assert.equal(created.price, "65000.00");

		const updated = await request(app)
			.put(`/api/packages/${created.id}`)
			.field(packagePayload({ title: "Everest Foothills Ride" }))
			.expect(200);
		assert.equal(updated.body.title, "Everest Foothills Ride");

		await request(app).post("/api/packages").field(packagePayload({ itinerary: "bad-json" })).expect(400);
		await request(app).delete("/api/packages/not-an-id").expect(400);
		await request(app).delete(`/api/packages/${created.id}`).expect(204);
	});

	it("covers bike booking endpoints", async () => {
		const bike = await createBike();

		const created = await request(app)
			.post("/api/bike-bookings")
			.send(bookingPayload({ bike: bike.id }))
			.expect(201);
		assert.equal(created.body.bike.id, bike.id);
		assert.equal(created.body.bikeName, "Royal Enfield Classic");

		const list = await request(app).get("/api/bike-bookings").expect(200);
		assert.equal(list.body.length, 1);

		await request(app)
			.post("/api/bike-bookings")
			.send(bookingPayload({ bike: bike.id }, { returnDate: "2026-06-30" }))
			.expect(400);
		await request(app).delete("/api/bike-bookings/not-an-id").expect(400);
		await request(app).delete(`/api/bike-bookings/${created.body.id}`).expect(204);
	});

	it("covers package booking endpoints", async () => {
		const pkg = await createPackage();

		const created = await request(app)
			.post("/api/package-bookings")
			.send(bookingPayload({ package: pkg.id }, { numberOfPeople: 2 }))
			.expect(201);
		assert.equal(created.body.package.id, pkg.id);
		assert.equal(created.body.packageTitle, "Upper Mustang Ride");

		const list = await request(app).get("/api/package-bookings").expect(200);
		assert.equal(list.body.length, 1);

		await request(app)
			.post("/api/package-bookings")
			.send(bookingPayload({ package: pkg.id }, { numberOfPeople: 0 }))
			.expect(400);
		await request(app).delete("/api/package-bookings/not-an-id").expect(400);
		await request(app).delete(`/api/package-bookings/${created.body.id}`).expect(204);
	});

	it("covers site content endpoints", async () => {
		const defaultContent = await request(app).get("/api/site-content").expect(200);
		assert.equal(defaultContent.body.homeHero.title, "Rent Your Dream Bike Today");

		await request(app).get("/api/site-content/home-hero").expect(200);
		await request(app).get("/api/site-content/about").expect(200);
		await request(app).get("/api/site-content/process").expect(200);
		await request(app).get("/api/site-content/service").expect(200);

		const updated = await request(app)
			.put("/api/site-content")
			.send(siteContentPayload())
			.expect(200);
		assert.equal(updated.body.homeHero.title, "Ride Nepal");
		assert.equal(updated.body.about.features[0], "Maintained bikes");

		const section = await request(app).get("/api/site-content/service").expect(200);
		assert.equal(section.body.heading, "Services");
	});
});
