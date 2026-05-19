import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import { usePackageBooking } from "../context/PackageBookingContext";

function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 text-slate-700">{children}</div>
    </section>
  );
}

export default function PackageDetails() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { openPackageBookingForm } = usePackageBooking();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadPackage() {
      try {
        const res = await fetch(apiUrl("api/packages"));
        if (!res.ok) throw new Error("Failed to load package.");
        const data = await res.json();
        if (!mounted) return;
        const found = (Array.isArray(data) ? data : []).find(
          (item) => String(item.id || item._id) === String(packageId),
        );
        setPkg(found || null);
      } catch {
        if (mounted) setPkg(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPackage();
    return () => {
      mounted = false;
    };
  }, [packageId]);

  const priceDisplay = pkg?.price ? `Rs. ${Number(pkg.price).toFixed(2)}` : "";
  const tripHighlights = pkg?.tripHighlights || [];
  const inclusions = pkg?.inclusions || [];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        Loading package details...
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-lg font-medium text-slate-700">Package not found.</p>
        <button
          type="button"
          onClick={() => navigate("/package")}
          className="mt-4 rounded-full bg-[var(--color-primary)] px-5 py-2 font-semibold text-white hover:bg-[var(--color-primary-dark)]"
        >
          Back to packages
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={
              getHighResImage(pkg.image, 1400) ||
              "https://via.placeholder.com/1400x700?text=No+Image"
            }
            alt={pkg.title}
            className="h-72 w-full object-cover md:h-112"
            srcSet={`${getHighResImage(pkg.image, 800)} 800w, ${getHighResImage(pkg.image, 1400)} 1400w`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Tour Package
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                {pkg.title}
              </h1>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {pkg.title}
              </h2>
              <h3 className="mt-2 text-xl font-semibold text-slate-800">
                {pkg.title}
              </h3>
              <p className="mt-4 text-2xl font-bold text-[var(--color-primary)]">
                {priceDisplay}
              </p>
            </div>

            <SectionCard title="🌄 Outline Itinerary">
              <ul className="space-y-3">
                {(pkg.itinerary || []).map((day) => (
                  <li key={day.dayNumber} className="leading-relaxed">
                    <strong>{day.dayNumber}:</strong> {day.description}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="✨ Package Experience">
              <p>{pkg.packageExperience || "Package experience coming soon."}</p>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Trip Highlights">
              <ul className="space-y-3">
                {tripHighlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
                {tripHighlights.length === 0 && <li>Highlights coming soon.</li>}
              </ul>
            </SectionCard>

            <SectionCard title="📦 Inclusions">
              <ul className="space-y-3">
                {inclusions.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
                {inclusions.length === 0 && <li>Inclusions coming soon.</li>}
              </ul>
            </SectionCard>

            <div className="rounded-2xl border border-[var(--color-primary)] bg-linear-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-6 text-white shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-foreground)]">
                Book This Package
              </p>
              <p className="mt-3 text-lg font-semibold">
                Secure your trip to {pkg.title} in just a few steps.
              </p>
              <button
                type="button"
                onClick={() => openPackageBookingForm(pkg)}
                className="mt-5 rounded-full bg-white px-6 py-3 font-bold text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary)] hover:bg-opacity-10"
              >
                Book Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
