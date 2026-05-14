import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";

dotenv.config();

async function start() {
	try {
		await connectDB();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	const app = express();

	app.use(cors());
	app.use(express.json());

	app.get("/", (req, res) => {
		res.send("API Running");
	});

	app.use("/api", routes);

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

start();
