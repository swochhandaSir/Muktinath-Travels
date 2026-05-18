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

const PackageCard = ({ pkg }) => {
  const rawPrice = pkg?.price;
  const priceNum = Number(rawPrice);
  const priceDisplay = Number.isFinite(priceNum)
    ? `Rs ${priceNum.toLocaleString()}`
    : "Price unavailable";

  const packageId = pkg?.id || pkg?._id;

  return (
    <Link
      to={packageId ? `/package/${packageId}` : "/package"}
      className="block h-full"
    >
      <motion.div
        initial={{ opacity: 0, x: 0, y: 200 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: 1,
        }}
        className="h-full rounded-lg border border-[var(--color-primary)] p-4 transition hover:shadow-2xl"
      >
        <div className="h-full w-full overflow-hidden rounded-t-lg">
          <img
            src={
              getHighResImage(pkg?.image, 800) ||
              "https://via.placeholder.com/800x533?text=No+Image"
            }
            alt={pkg?.title}
            className="h-44 w-full object-cover"
          />

          <div className="px-4 py-5 text-center">
            <h3 className="text-xl font-bold leading-snug text-slate-950">
              {pkg?.title}
            </h3>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
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

            <div className="mx-auto mt-4 w-full rounded-full bg-[var(--color-primary)] bg-opacity-10 px-4 py-2 text-lg font-bold text-[var(--color-primary)]">
              {priceDisplay}
            </div>

            <div className="mt-4 inline-block rounded-full bg-[var(--color-primary)] px-5 py-2 text-center font-semibold text-white transition group-hover:bg-[var(--color-primary-dark)]">
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
          <h2 className="text-4xl font-bold tracking-wide text-slate-950 md:text-5xl">
            Tour Packages
          </h2>
          <p className="mt-6 text-gray-600">
            Discover our curated packages for unforgettable journeys across
            beautiful destinations.
          </p>
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
              <div className="text-center py-10">Loading packages...</div>
            </SwiperSlide>
          )}

          {!loading && packages.length === 0 && (
            <SwiperSlide className="h-auto">
              <div className="text-center py-10">No packages available.</div>
            </SwiperSlide>
          )}

          {!loading &&
            packages.map((pkg) => (
              <SwiperSlide
                key={pkg.id || pkg._id || pkg.title}
                className="h-auto"
              >
                <PackageCard pkg={pkg} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Packages;
