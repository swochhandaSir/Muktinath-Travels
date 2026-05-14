import React from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
	ChevronLeft,
	ChevronRight,
	Fuel,
	Gauge,
	Star,
	Motorbike,
	CalendarCog,
} from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "motion/react";

const vehicles = [
	{
		title: "Kathmandu - Chitwan",
		image:
			"https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW90b3JjeWNsZXxlbnwwfHwwfHx8MA%3D%3D",
		rating: "5.0",
		year: "2025",
		transmission: "MT",
		fuel: "petrol",
		mileage: "18 km/l",
		price: "Rs 15000.00/Day",
	},
	{
		title: "Kathmandu - Pokhara",
		image:
			"https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW90b3JjeWNsZXxlbnwwfHwwfHx8MA%3D%3D",
		rating: "4.9",
		year: "2024",
		transmission: "MT",
		fuel: "petrol",
		mileage: "18 km/l",
		price: "Rs 15000.00/Day",
	},
	{
		title: "Kathmandu - Kalinchok / Charikot",
		image:
			"https://images.unsplash.com/photo-1531327431456-837da4b1d562?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vdG9yY3ljbGV8ZW58MHx8MHx8fDA%3D",
		rating: "5.0",
		year: "2026",
		transmission: "MT",
		fuel: "petrol",
		mileage: "16 km/l",
		price: "Rs 15000.00/Day",
	},
	{
		title: "Kathmandu - Lumbini",
		image:
			"https://images.unsplash.com/photo-1588627541420-fce3f661b779?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1vdG9yY3ljbGV8ZW58MHx8MHx8fDA%3D",
		rating: "4.8",
		year: "2024",
		transmission: "AT",
		fuel: "diesel",
		mileage: "15 km/l",
		price: "Rs 12000.00/Day",
	},
	{
		title: "Kathmandu - Nagarkot",
		image:
			"https://images.unsplash.com/photo-1559289431-9f12ee08f8b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1vdG9yY3ljbGV8ZW58MHx8MHx8fDA%3D",
		rating: "4.9",
		year: "2025",
		transmission: "AT",
		fuel: "petrol",
		mileage: "20 km/l",
		price: "Rs 8500.00/Day",
	},
	{
		title: "Kathmandu - Mustang",
		image:
			"https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fG1vdG9yY3ljbGV8ZW58MHx8MHx8fDA%3D",
		rating: "5.0",
		year: "2025",
		transmission: "MT",
		fuel: "diesel",
		mileage: "14 km/l",
		price: "Rs 18000.00/Day",
	},
];

const VehicleInfo = ({ icon: Icon, text }) => (
	<div className="flex items-center justify-center gap-2 border-r border-gray-300 last:border-r-0">
		<Icon className="h-4 w-4 text-slate-950" />
		<span>{text}</span>
	</div>
);

const VehicleCard = ({ vehicle }) => (
	<motion.div
		initial={{ opacity: 0, x: 0, y: 200 }}
		whileInView={{ opacity: 1, x: 0, y: 0 }}
		transition={{
			duration: 1,
		}}
		className="h-full rounded-lg border border-blue-600 p-6"
	>
		<div className="h-full w-full rounded-t-lg overflow-hidden hover:shadow-2xl transition duration-300">
			<img
				src={vehicle.image}
				alt={vehicle.title}
				className="h-52 w-full object-cover"
			/>
			<div className="px-6 py-7 text-center">
				<h3 className="min-h-16 text-2xl font-medium leading-tight text-slate-950">
					{vehicle.title}
				</h3>

				<div className="mt-3 flex items-center justify-center gap-4 text-gray-500">
					<span>{vehicle.rating} Review</span>
					<div className="flex items-center gap-0.5">
						{[...Array(5)].map((_, index) => (
							<Star
								key={index}
								className="h-5 w-5 fill-slate-800 text-slate-800"
							/>
						))}
					</div>
				</div>

				<div className="mx-auto mt-7 w-full max-w-80 rounded-full bg-white px-5 py-3 text-2xl font-medium text-slate-800">
					{vehicle.price}
				</div>

				<div className="mt-6 grid grid-cols-2 gap-y-3 text-sm text-gray-500">
					<VehicleInfo
						icon={Motorbike}
						text={vehicle.transmission}
					/>
					<VehicleInfo
						icon={Fuel}
						text={vehicle.fuel}
					/>
					<VehicleInfo
						icon={CalendarCog}
						text={vehicle.year}
					/>
					<VehicleInfo
						icon={Gauge}
						text={vehicle.mileage}
					/>
				</div>

				<Link
					to="/package"
					className="mt-7 block rounded-full bg-blue-600 px-8 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
				>
					Book Now
				</Link>
			</div>
		</div>
	</motion.div>
);

const VechileCategories = () => {
	return (
		<>
			<section className="bg-white py-16">
				<div className="mx-auto max-w-7xl px-6">
					<div className="text-center">
						<h2 className="text-4xl font-bold tracking-wide text-slate-950 md:text-5xl">
							Vehicle Categories
						</h2>
						<p className="mt-6 text-gray-600">
							Browse our selection of vehicles across various categories to find the
							perfect match for your needs.
						</p>
					</div>

					<div className="mt-14 flex items-center justify-between">
						<button
							type="button"
							className="vehicle-prev flex h-11 w-20 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
							aria-label="Previous vehicles"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>

						<button
							type="button"
							className="vehicle-next flex h-11 w-20 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
							aria-label="Next vehicles"
						>
							<ChevronRight className="h-6 w-6" />
						</button>
					</div>

					<Swiper
						modules={[Navigation]}
						navigation={{
							prevEl: ".vehicle-prev",
							nextEl: ".vehicle-next",
						}}
						spaceBetween={24}
						slidesPerView={1}
						breakpoints={{
							768: {
								slidesPerView: 2,
							},
							1024: {
								slidesPerView: 3,
							},
						}}
						className="mt-5"
					>
						{vehicles.map((vehicle) => (
							<SwiperSlide
								key={vehicle.title}
								className="h-auto"
							>
								<VehicleCard vehicle={vehicle} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</section>
		</>
	);
};

export default VechileCategories;
