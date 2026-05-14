import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Phone, MessageCircleMore } from "lucide-react";

const MainLayout = () => {
	return (
		<div className="min-h-screen overflow-x-hidden bg-gray-100">
			<Navbar />
			<main>
				<Outlet />
			</main>
			{/* Floating Buttons */}
			<div className="fixed right-5 bottom-10 flex flex-col gap-4 z-50">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-full shadow-xl font-semibold">
					<div className="flex items-center gap-2">
						<Phone />
						<div className="font-medium pl-2">Call Us</div>
					</div>
				</button>

				<button className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-xl font-semibold">
					<div className="flex items-center gap-2">
                        <MessageCircleMore/>
						<div className="font-medium  pl-2">WhatsApp</div>
					</div>
				</button>
			</div>
			<Footer />
		</div>
	);
};

export default MainLayout;
