import { useEffect, useState } from "react";
import Modal from "./dashboard/Modal";
import { usePackageBooking } from "../context/PackageBookingContext";

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

  if (!values.fullName.trim()) errors.fullName = "Full name is required.";

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone is required.";
  } else if (!/^[0-9+\-()\s]{7,}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  const people = Number.parseInt(values.numberOfPeople, 10);
  if (!Number.isFinite(people) || people < 1) {
    errors.numberOfPeople = "Enter a valid number of people.";
  }

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

  const packageLabel = selectedPackage
    ? `${selectedPackage.title} - Rs. ${selectedPackage.price}`
    : "";

  useEffect(() => {
    if (!isPackageBookingOpen) return;
    setForm(initialForm);
    setErrors({});
    setSuccessMsg("");
  }, [isPackageBookingOpen, selectedPackage]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validatePackageBooking(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSuccessMsg(
      "Package booking request submitted successfully. We will contact you soon."
    );
  };

  return (
    <Modal
      open={isPackageBookingOpen}
      onClose={closePackageBookingForm}
      titleId="package-booking-form-title"
      title="Tour Package Booking"
      panelClassName="max-w-3xl"
    >
      <form className="mt-4 space-y-4" onSubmit={onSubmit} noValidate>
        {successMsg && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMsg}
          </p>
        )}

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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter your name"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter number of people"
              value={form.numberOfPeople}
              onChange={(e) => updateField("numberOfPeople", e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Pickup location"
              value={form.pickupLocation}
              onChange={(e) => updateField("pickupLocation", e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Dropoff location"
              value={form.dropoffLocation}
              onChange={(e) => updateField("dropoffLocation", e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="mm/dd/yyyy"
              value={form.pickupDate}
              onChange={(e) => updateField("pickupDate", e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="mm/dd/yyyy"
              value={form.returnDate}
              onChange={(e) => updateField("returnDate", e.target.value)}
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
            className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={closePackageBookingForm}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            Book Package
          </button>
        </div>
      </form>
    </Modal>
  );
}
