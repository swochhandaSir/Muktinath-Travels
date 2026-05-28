import { useCallback, useEffect, useState } from "react";
import Modal from "./dashboard/Modal";
import SubmissionSuccessPanel from "./SubmissionSuccessPanel";
import { usePackageBooking } from "../context/PackageBookingContext";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";
import {
  validateEmailField,
  validatePhoneField,
  validatePositiveIntegerField,
  validateTextField,
} from "../lib/formValidation";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  numberOfPeople: "",
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  returnDate: "",
  message: "",
};

function validatePackageBooking(values) {
  const errors = {};

  errors.fullName = validateTextField(values.fullName, "Full name", {
    minLength: 3,
  });
  errors.email = validateEmailField(values.email);
  errors.phone = validatePhoneField(values.phone);
  errors.numberOfPeople = validatePositiveIntegerField(
    values.numberOfPeople,
    "Number of people",
  );

  if (!values.pickupLocation.trim()) {
    errors.pickupLocation = "Pickup location is required.";
  }
  if (!values.dropoffLocation.trim()) {
    errors.dropoffLocation = "Dropoff location is required.";
  }
  if (!values.pickupDate) errors.pickupDate = "Pickup date is required.";
  if (!values.returnDate) errors.returnDate = "Return date is required.";

  if (values.pickupDate && values.returnDate) {
    const pickup = new Date(values.pickupDate);
    const returnDate = new Date(values.returnDate);
    if (returnDate < pickup) {
      errors.returnDate = "Return date must be after pickup date.";
    }
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export default function PackageBookingFormModal() {
  const { isPackageBookingOpen, selectedPackage, closePackageBookingForm } =
    usePackageBooking();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const packageLabel = selectedPackage
    ? `${selectedPackage.title} - Rs. ${selectedPackage.price}`
    : "";

  const resetAndClose = useCallback(() => {
    setForm(initialForm);
    setErrors({});
    setSuccessMsg("");
    setSubmitError("");
    closePackageBookingForm();
  }, [closePackageBookingForm]);

  useEffect(() => {
    if (!successMsg) return;

    const timer = window.setTimeout(() => {
      resetAndClose();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [successMsg, resetAndClose]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validatePackageBooking(form);
    if (!selectedPackage?.id && !selectedPackage?._id) {
      nextErrors.package = "Please select a package.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    setSuccessMsg("");
    try {
      const res = await fetch(apiUrl("/api/package-bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: selectedPackage.id || selectedPackage._id,
          customerName: form.fullName.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
          numberOfPeople: Number.parseInt(form.numberOfPeople, 10),
          pickupLocation: form.pickupLocation.trim(),
          returnLocation: form.dropoffLocation.trim(),
          pickupDate: form.pickupDate,
          returnDate: form.returnDate,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      setSuccessMsg(
        "Package booking request submitted successfully. We will contact you soon.",
      );
      setForm(initialForm);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit package booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={isPackageBookingOpen}
      onClose={resetAndClose}
      titleId="package-booking-form-title"
      title="Tour Package Booking"
      panelClassName="max-w-3xl"
    >
      <form className="mt-4 space-y-4" onSubmit={onSubmit} noValidate>
        {successMsg && (
          <SubmissionSuccessPanel
            title="Package booking submitted"
            message={successMsg}
          />
        )}

        {!successMsg && submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        {!successMsg && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Selected Package
              </label>
              <input
                value={packageLabel}
                readOnly
                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                placeholder="Selected Package"
              />
              <FieldError message={errors.package} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="package-full-name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>
                <input
                  id="package-full-name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your name"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  disabled={submitting}
                  minLength={3}
                />
                <FieldError message={errors.fullName} />
              </div>

              <div>
                <label
                  htmlFor="package-email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="package-email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={submitting}
                />
                <FieldError message={errors.email} />
              </div>

              <div>
                <label
                  htmlFor="package-phone"
                  className="block text-sm font-medium text-slate-700"
                >
                  Phone
                </label>
                <input
                  id="package-phone"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  disabled={submitting}
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]*"
                />
                <FieldError message={errors.phone} />
              </div>

              <div>
                <label
                  htmlFor="package-people"
                  className="block text-sm font-medium text-slate-700"
                >
                  Number of People
                </label>
                <input
                  id="package-people"
                  inputMode="numeric"
                  min={1}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter number of people"
                  value={form.numberOfPeople}
                  onChange={(e) =>
                    updateField("numberOfPeople", e.target.value)
                  }
                  disabled={submitting}
                />
                <FieldError message={errors.numberOfPeople} />
              </div>

              <div>
                <label
                  htmlFor="package-pickup-location"
                  className="block text-sm font-medium text-slate-700"
                >
                  Pickup Location
                </label>
                <input
                  id="package-pickup-location"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="Pickup location"
                  value={form.pickupLocation}
                  onChange={(e) =>
                    updateField("pickupLocation", e.target.value)
                  }
                  disabled={submitting}
                />
                <FieldError message={errors.pickupLocation} />
              </div>

              <div>
                <label
                  htmlFor="package-dropoff-location"
                  className="block text-sm font-medium text-slate-700"
                >
                  Dropoff Location
                </label>
                <input
                  id="package-dropoff-location"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="Dropoff location"
                  value={form.dropoffLocation}
                  onChange={(e) =>
                    updateField("dropoffLocation", e.target.value)
                  }
                  disabled={submitting}
                />
                <FieldError message={errors.dropoffLocation} />
              </div>

              <div>
                <label
                  htmlFor="package-pickup-date"
                  className="block text-sm font-medium text-slate-700"
                >
                  Pickup Date
                </label>
                <input
                  id="package-pickup-date"
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="mm/dd/yyyy"
                  value={form.pickupDate}
                  onChange={(e) => updateField("pickupDate", e.target.value)}
                  disabled={submitting}
                />
                <p className="mt-1 text-xs text-slate-500">mm/dd/yyyy</p>
                <FieldError message={errors.pickupDate} />
              </div>

              <div>
                <label
                  htmlFor="package-return-date"
                  className="block text-sm font-medium text-slate-700"
                >
                  Return Date
                </label>
                <input
                  id="package-return-date"
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  placeholder="mm/dd/yyyy"
                  value={form.returnDate}
                  onChange={(e) => updateField("returnDate", e.target.value)}
                  disabled={submitting}
                />
                <p className="mt-1 text-xs text-slate-500">mm/dd/yyyy</p>
                <FieldError message={errors.returnDate} />
              </div>
            </div>

            <div>
              <label
                htmlFor="package-message"
                className="block text-sm font-medium text-slate-700"
              >
                Message
              </label>
              <textarea
                id="package-message"
                className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                placeholder="Message"
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                disabled={submitting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                {submitting ? "Booking..." : "Book Package"}
              </button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
