import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const MainLayout = () => {
	return (
		<div className="min-h-screen overflow-x-hidden bg-gray-100">
			<Navbar />

			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
