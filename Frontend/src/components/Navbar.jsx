import React from "react";
import { Link, NavLink } from "react-router";
import { useCompanyDetails } from "../hooks/useCompanyDetails";

const navItems = [
	{ label: "Home", to: "/" },
	{ label: "About", to: "/about" },
	{ label: "Bikes", to: "/bikes" },
	{ label: "Package", to: "/package" },
	{ label: "Service", to: "/service" },
	{ label: "Blog", to: "/blog" },
	{ label: "Contact", to: "/contact" },
];

const Navbar = () => {
	const { details } = useCompanyDetails();
	const brandName = details?.name || "Please provide CompanyName";

	return (
		<nav className="w-full border-t border-slate-800 bg-gray-100">
			<div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center">
					{details?.logo ? (
						<img
							src={details.logo}
							alt={`${brandName} logo`}
							className="h-10 w-auto"
						/>
					) : (
						<Link to="/" className="text-xl font-bold text-slate-900">
							{brandName}
						</Link>
					)}
				</div>

				{/* Nav Links */}
				<ul className="hidden md:flex items-center gap-10 text-[18px] font-medium">
					{navItems.map((item) => (
						<li key={item.to}>
							<NavLink
								to={item.to}
								className={({ isActive }) =>
									`transition ${
										isActive
											? "text-blue-600 hover:text-blue-700"
											: "text-black hover:text-blue-600"
									}`
								}
							>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>

				{/* Button */}
				<div>
					<Link
						to="/package"
						className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition"
					>
						Book Now
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
