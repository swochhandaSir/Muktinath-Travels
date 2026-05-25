import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  Bike,
  Calendar,
  CheckCircle2,
  Gauge,
  Hash,
  Trash2,
  XCircle,
} from "lucide-react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";

const detailLabels = {
  model: "Model",
  color: "Color",
  plateNumber: "Plate number",
  chassisNumber: "Chassis number",
  engineNumber: "Engine number",
  mileage: "Mileage",
  engineCapacity: "Engine capacity",
  blueBookNumber: "Blue book number",
};

function formatDetail(key, value) {
  if (value === "" || value === null || value === undefined) return "-";
  if (key === "mileage") return `${value} km/l`;
  if (key === "engineCapacity") return `${value} cc`;
  return value;
}

export default function BikeDetails() {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLicenseSubmitting, setDeleteLicenseSubmitting] = useState(false);
  const [deleteLicenseError, setDeleteLicenseError] = useState("");
  const [deleteBlueBookIndex, setDeleteBlueBookIndex] = useState(null);
  const [deleteBlueBookError, setDeleteBlueBookError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBike() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(apiUrl(`/api/bikes/${bikeId}`));
        if (!res.ok) throw new Error(await parseApiError(res));
        const data = await res.json();
        if (!cancelled) setBike(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load bike details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBike();
    return () => {
      cancelled = true;
    };
  }, [bikeId]);

  const details = useMemo(() => {
    if (!bike) return [];
    return Object.entries(detailLabels).map(([key, label]) => ({
      key,
      label,
      value: formatDetail(key, bike[key]),
    }));
  }, [bike]);

  const deleteLicenseImage = async () => {
    if (!bike?.licenseImage) return;
    const confirmed = window.confirm("Delete this license image?");
    if (!confirmed) return;

    setDeleteLicenseSubmitting(true);
    setDeleteLicenseError("");
    try {
      const res = await fetch(apiUrl(`/api/bikes/${bike.id}/license-image`), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      setBike(await res.json());
    } catch (err) {
      setDeleteLicenseError(err.message || "Failed to delete license image.");
    } finally {
      setDeleteLicenseSubmitting(false);
    }
  };

  const deleteBlueBookImage = async (index) => {
    const confirmed = window.confirm("Delete this bluebook image?");
    if (!confirmed) return;

    setDeleteBlueBookIndex(index);
    setDeleteBlueBookError("");
    try {
      const res = await fetch(
        apiUrl(`/api/bikes/${bike.id}/bluebook-images/${index}`),
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(await parseApiError(res));
      setBike(await res.json());
    } catch (err) {
      setDeleteBlueBookError(err.message || "Failed to delete bluebook image.");
    } finally {
      setDeleteBlueBookIndex(null);
    }
  };

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-slate-50 px-4 py-20 text-center text-slate-600">
        Loading bike details...
      </section>
    );
  }

  if (error || !bike) {
    return (
      <section className="min-h-[60vh] bg-slate-50 px-4 py-20 text-center">
        <p className="text-lg font-semibold text-slate-800">Bike details unavailable</p>
        <p className="mt-2 text-sm text-slate-500">{error || "Bike not found."}</p>
      </section>
    );
  }

  const blueBookImages = Array.isArray(bike.blueBookImages)
    ? bike.blueBookImages
    : [];

  return (
    <section className="bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {bike.image ? (
              <img
                src={bike.image}
                alt={bike.name}
                className="h-[280px] w-full object-cover sm:h-[420px]"
              />
            ) : (
              <div className="flex h-[280px] items-center justify-center bg-slate-100 text-slate-400 sm:h-[420px]">
                <Bike className="h-12 w-12" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                  bike.available
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {bike.available ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                )}
                {bike.available ? "Available" : "Unavailable"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
                <Gauge className="h-4 w-4" aria-hidden="true" />
                Rs. {bike.price} / day
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">
              {bike.name}
            </h1>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {details.map((item) => (
                <div
                  key={item.key}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="text-xs font-semibold uppercase text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Hash className="h-4 w-4" aria-hidden="true" />
                {bike.id}
              </span>
              {bike.createdAt && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Added {new Date(bike.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {bike.licenseImage && (
          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-950">License Image</h2>
              <button
                type="button"
                onClick={deleteLicenseImage}
                disabled={deleteLicenseSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {deleteLicenseSubmitting ? "Deleting..." : "Delete license"}
              </button>
            </div>
            {deleteLicenseError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {deleteLicenseError}
              </p>
            )}
            <a href={bike.licenseImage} target="_blank" rel="noreferrer">
              <img
                src={bike.licenseImage}
                alt={`${bike.name} license`}
                className="mt-4 max-h-[520px] w-full rounded-lg border border-slate-200 bg-white object-contain p-2 shadow-sm"
              />
            </a>
          </div>
        )}

        {blueBookImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Bluebook Images</h2>
            {deleteBlueBookError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {deleteBlueBookError}
              </p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blueBookImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <a href={imageUrl} target="_blank" rel="noreferrer">
                    <img
                      src={imageUrl}
                      alt={`${bike.name} bluebook ${index + 1}`}
                      className="h-64 w-full object-contain p-2"
                    />
                  </a>
                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">
                      Image {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteBlueBookImage(index)}
                      disabled={deleteBlueBookIndex === index}
                      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {deleteBlueBookIndex === index ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
