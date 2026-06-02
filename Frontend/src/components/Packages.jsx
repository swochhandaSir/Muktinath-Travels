import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, MapPin, Clock, Users } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import LoadingSpinner from "./LoadingSpinner";

const PackageCard = ({ pkg }) => {
  const rawPrice = pkg?.price;
  // Accept number or string (possibly formatted like "1,000.00" or "Rs 1,000")
  const parsePrice = (val) => {
    if (val == null) return NaN;
    if (typeof val === "number") return val;
    // remove any non-numeric characters except dot and minus
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  };

  const priceNum = parsePrice(rawPrice);
  const priceDisplay = Number.isFinite(priceNum)
    ? `Rs ${priceNum.toLocaleString()}`
    : "Price unavailable";

  const packageId = pkg?.id || pkg?._id;

  // debug: log package shape so we can see price field in browser console (dev only)
  if (import.meta.env.DEV) {
    try {
      console.log("Package card data (obj):", pkg);
      console.log("Package card data (json):", JSON.stringify(pkg));
      console.log("Package raw price:", pkg?.price);
    } catch {
      console.log("Package card data (obj, stringify failed):", pkg);
    }
  }

  return (
    <Link
      to={packageId ? `/package/${packageId}` : "/package"}
      className="block h-full"
      data-price={pkg?.price}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="h-full rounded-lg border border-[var(--color-primary)] p-4 transition hover:shadow-2xl flex flex-col"
      >
        <div className="w-full overflow-hidden rounded-t-lg relative">
          <img
            src={getHighResImage(pkg?.image, 800) || "https://via.placeholder.com/800x533?text=No+Image"}
            alt={pkg?.title}
            className="h-48 w-full object-cover"
          />
          <div
            className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold shadow-sm"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
          >
            {priceDisplay}
          </div>
        </div>

        <div className="px-4 py-5 flex flex-col flex-1 gap-4 text-center">
          <h3 className="text-lg md:text-xl font-bold leading-tight text-slate-950">{pkg?.title}</h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{pkg?.location}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{pkg?.duration}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>Group Size: {pkg?.groupSize}</span>
            </div>
          </div>

          {/* price badge moved to image top-right */}

          <div className="mt-auto">
            <div className="inline-block w-full rounded-full bg-[var(--color-primary)] px-5 py-2 text-center font-semibold text-white transition hover:bg-[var(--color-primary-dark)]">
              Explore
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function fetchPackages() {
      try {
        const res = await fetch(apiUrl("api/packages"));
        if (!res.ok) throw new Error("Failed to fetch packages");
        const data = await res.json();
        if (mounted) setPackages(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPackages();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-wide text-slate-950 md:text-5xl">Tour Packages</h2>
          <p className="mt-6 text-gray-600">Discover our curated packages for unforgettable journeys across beautiful destinations.</p>
        </div>

        <div className="mt-14 flex items-center justify-between">
          <button
            ref={prevRef}
            type="button"
            className="flex h-11 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition hover:bg-[var(--color-primary-dark)]"
            aria-label="Previous packages"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            ref={nextRef}
            type="button"
            className="flex h-11 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition hover:bg-[var(--color-primary-dark)]"
            aria-label="Next packages"
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
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mt-5"
        >
          {loading && (
            <SwiperSlide className="h-auto">
              <LoadingSpinner label="Loading packages..." className="py-10 px-0 md:px-110 lg:px-150" />
            </SwiperSlide>
          )}

          {!loading && packages.length === 0 && (
            <SwiperSlide className="h-auto">
              <div className="text-center py-10">No packages available.</div>
            </SwiperSlide>
          )}

          {!loading &&
            packages.map((pkg) => (
              <SwiperSlide key={pkg.id || pkg._id || pkg.title} className="h-auto">
                <PackageCard pkg={pkg} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Packages;
