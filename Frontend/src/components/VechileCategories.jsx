import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { useBooking } from "../context/BookingContext";

// we'll fetch bikes from the backend API; each bike has `name`, `pricePerDay`, `image`

const VehicleCard = ({ vehicle, onBookNow }) => {
  const rawPrice = vehicle?.price ?? vehicle?.pricePerDay;
  const priceNum = Number(rawPrice);
  const priceDisplay = Number.isFinite(priceNum)
    ? `Rs ${priceNum.toLocaleString()} / Day`
    : "Price unavailable";

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 200 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 1,
      }}
      className="h-full rounded-lg border border-blue-600 p-4"
    >
      <div className="h-full w-full rounded-t-lg overflow-hidden hover:shadow-2xl transition duration-300">
        <img
          src={
            vehicle.image || "https://via.placeholder.com/600x400?text=No+Image"
          }
          alt={vehicle.name}
          className="h-44 w-full object-cover"
        />

        <div className="px-4 py-5 text-center">
          <h3 className="text-xl font-bold leading-snug text-slate-950">
            {vehicle.name}
          </h3>

          <div className="mx-auto mt-4 w-full max-w-72 rounded-full bg-white px-4 py-2 text-xl font-medium text-slate-800">
            {priceDisplay}
          </div>

          <button
            type="button"
            onClick={() => onBookNow(vehicle)}
            className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const VechileCategories = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { openBookingForm } = useBooking();

  useEffect(() => {
    let mounted = true;
    async function fetchBikes() {
      try {
        const res = await fetch(apiUrl("api/bikes"));
        if (!res.ok) throw new Error("Failed to fetch bikes");
        const data = await res.json();
        if (mounted) setBikes(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchBikes();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-wide text-slate-950 md:text-5xl">
              Vehicle Categories
            </h2>
            <p className="mt-6 text-gray-600">
              Browse our selection of vehicles across various categories to find
              the perfect match for your needs.
            </p>
          </div>

          <div className="mt-14 flex items-center justify-between">
            <button
              ref={prevRef}
              type="button"
              className="flex h-11 w-20 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
              aria-label="Previous vehicles"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              ref={nextRef}
              type="button"
              className="flex h-11 w-20 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
              aria-label="Next vehicles"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <Swiper
            modules={[Navigation]}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            spaceBetween={24}
            slidesPerView={1}
            observer
            observeParents
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
            {loading && (
              <SwiperSlide className="h-auto">
                <div className="text-center py-10">Loading bikes...</div>
              </SwiperSlide>
            )}

            {!loading && bikes.length === 0 && (
              <SwiperSlide className="h-auto">
                <div className="text-center py-10">No bikes available.</div>
              </SwiperSlide>
            )}

            {!loading &&
              bikes.map((vehicle) => (
                <SwiperSlide
                  key={vehicle.id || vehicle._id || vehicle.name}
                  className="h-auto"
                >
                  <VehicleCard vehicle={vehicle} onBookNow={openBookingForm} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default VechileCategories;
