import express from "express";

import bikeBookingsRoutes from "./bikeBookingsRoutes.js";
import bikesRoutes from "./bikesRoutes.js";
import companyDetailsRoutes from "./companyDetailsRoutes.js";
import packagesRoutes from "./packagesRoutes.js";

const routes = express.Router();

routes.use("/bikes", bikesRoutes);
routes.use("/bike-bookings", bikeBookingsRoutes);
routes.use("/company-details", companyDetailsRoutes);
routes.use("/packages", packagesRoutes);

export default routes;
