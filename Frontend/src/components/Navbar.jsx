import React from "react";

const Navbar = () => {
	return (
		<nav className="w-full border-t border-slate-800 bg-gray-100">
			<div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center">
					<img
						src="/logo.png"
						alt="Logo"
						className="h-10 w-auto"
					/>
				</div>

				{/* Nav Links */}
				<ul className="hidden md:flex items-center gap-10 text-[18px] font-medium">
					<li>
						<a
							href="#"
							className="text-blue-600 hover:text-blue-700 transition"
						>
							Home
						</a>
					</li>

					<li>
						<a
							href="#"
							className="text-black hover:text-blue-600 transition"
						>
							About
						</a>
					</li>

					<li>
						<a
							href="#"
							className="text-black hover:text-blue-600 transition"
						>
							Bikes
						</a>
					</li>

					<li>
						<a
							href="#"
							className="text-black hover:text-blue-600 transition"
						>
							Package
						</a>
					</li>

					<li>
						<a
							href="#"
							className="text-black hover:text-blue-600 transition"
						>
							Service
						</a>
					</li>

					<li>
						<a
							href="#"
							className="text-black hover:text-blue-600 transition"
						>
							Blog
						</a>
					</li>

					<li>
						<a
							href="#"
							className="text-black hover:text-blue-600 transition"
						>
							Contact
						</a>
					</li>
				</ul>

				{/* Button */}
				<div>
					<button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition">
						Book Now
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
