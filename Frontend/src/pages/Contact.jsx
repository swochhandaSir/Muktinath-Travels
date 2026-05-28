import { useCompanyDetails } from "../hooks/useCompanyDetails";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";
import {
  validateEmailField,
  validatePhoneField,
  validateTextField,
} from "../lib/formValidation";

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export default function Contact() {
  const { details, loading } = useCompanyDetails();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: 0,
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      name: validateTextField(formData.name, "Your name", { minLength: 3 }),
      email: validateEmailField(formData.email),
      phone: validatePhoneField(formData.phone, { required: false }),
      message: validateTextField(formData.message, "Message"),
    };

    if (formData.subject.trim() && formData.subject.trim().length < 3) {
      nextErrors.subject = "Subject must be at least 3 characters.";
    }

    setFormErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch(apiUrl("/api/contact-messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(await parseApiError(res));

      setSubmitStatus({
        type: "success",
        message: "Thank you! We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setFormErrors({});
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.message || "Failed to send message.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">
            Loading contact information...
          </p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">
            Unable to load contact information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions about our bike rental and tour packages? We'd love to
            hear from you. Reach out to us using any of the contact methods
            below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-950 mb-6">
                {details?.name || "Company"}
              </h2>

              {/* Phone */}
              {details?.contactPhone && (
                <div className="flex gap-4 mb-6">
                  <div className="shrink-0">
                    <Phone className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
                      Phone
                    </p>
                    <a
                      href={`tel:${details.contactPhone}`}
                      className="text-lg font-semibold text-slate-950 transition hover:text-amber-500"
                    >
                      {details.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {details?.contactEmail && (
                <div className="flex gap-4 mb-6">
                  <div className="shrink-0">
                    <Mail className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
                      Email
                    </p>
                    <a
                      href={`mailto:${details.contactEmail}`}
                      className="text-lg font-semibold text-slate-950 transition hover:text-amber-500 break-all"
                    >
                      {details.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              {details?.location && (
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <MapPin className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
                      Location
                    </p>
                    <p className="text-lg text-slate-950 font-semibold">
                      {details.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            {details?.about && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-950 mb-4">
                  About Us
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {details.about}
                </p>
              </div>
            )}

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-950 mb-6">
                Follow Us
              </h3>
              <div className="flex gap-3 flex-wrap">
                {details?.facebook && (
                  <a
                    href={details.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Facebook
                  </a>
                )}
                {details?.instagram && (
                  <a
                    href={details.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Instagram
                  </a>
                )}
                {details?.tiktok && (
                  <a
                    href={details.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-fit sticky top-20">
            <h2 className="text-2xl font-bold text-slate-950 mb-2">
              Have Questions or Feedback?
            </h2>
            <p className="text-slate-600 mb-6">
              We'd love to hear from you. Fill out the form and we'll get back
              to you as soon as possible.
            </p>

            {submitStatus && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={submitting}
                  minLength={3}
                  required
                />
                <FieldError message={formErrors.name} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={submitting}
                  required
                />
                <FieldError message={formErrors.email} />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={submitting}
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]*"
                />
                <FieldError message={formErrors.phone} />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={submitting}
                />
                <FieldError message={formErrors.subject} />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="5"
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={submitting}
                  minLength={1}
                  required
                ></textarea>
                <FieldError message={formErrors.message} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
