import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

export function createApp() {
	const app = express();

	app.use(cors());
	app.use(express.json());

	app.get("/", (_req, res) => {
		res.send("API Running");
	});

	app.use("/api", routes);

	return app;
}
