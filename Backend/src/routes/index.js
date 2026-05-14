import express from "express";

import bikesRoutes from "./bikesRoutes.js";

const routes = express.Router();

routes.use("/bikes", bikesRoutes);

export default routes;
