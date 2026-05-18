import React from "react";
import { MapPinned, Mail, Phone } from "lucide-react";
import { Link } from "react-router";
import { useCompanyDetails } from "../hooks/useCompanyDetails";

const Footer = () => {
  const { details } = useCompanyDetails();
  const brandName = details?.name || "Please provide CompanyName";
  const about = details?.about || "Please provide company details";
  const location = details?.location || "Please provide location";
  const email = details?.contactEmail || "Please provide email";
  const phone = details?.contactPhone || "Please provide phone number";

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-6 text-xl font-semibold">About Us</h3>
          <p className="leading-relaxed text-gray-400">{about}</p>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold">Quick Links</h3>
          <ul className="space-y-3">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Bikes", "/bikes"],
              ["Packages", "/package"],
              ["Services", "/service"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-gray-400 transition duration-300 hover:text-[var(--color-primary-dark)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold">Business Hours</h3>
          <ul className="space-y-3 text-gray-400">
            <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
            <li>Saturday: 10:00 AM - 5:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold">Contact Info</h3>
          <div className="space-y-5 text-gray-400">
            <div className="flex items-start gap-3">
              <MapPinned className="mt-1 h-5 w-5 text-[var(--color-primary)]" />
              <p>{location}</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-[var(--color-primary)]" />
              <p>{email}</p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-[var(--color-primary)]" />
              <p>{phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row">
          <p className="text-center text-sm text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 transition hover:text-[var(--color-primary-dark)]"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 transition hover:text-[var(--color-primary-dark)]"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
