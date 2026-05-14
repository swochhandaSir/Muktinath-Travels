import React from "react";
import { MapPinned, Mail, Phone } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        
        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-6">
            About Us
          </h3>

          <p className="text-gray-400 leading-relaxed">
            We provide safe, reliable, and comfortable bike rental services for
            business trips, vacations, and daily travel needs across Nepal.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6">
            Quick Links
          </h3>

          <ul className="space-y-3">
            {[
              "Home",
              "About",
              "Cars",
              "Packages",
              "Services",
              "Blog",
              "Contact",
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-blue-500 transition duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Business Hours */}
        <div>
          <h3 className="text-xl font-semibold mb-6">
            Business Hours
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
            <li>Saturday: 10:00 AM - 5:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-6">
            Contact Info
          </h3>

          <div className="space-y-5 text-gray-400">
            
            <div className="flex items-start gap-3">
              <MapPinned className="w-5 h-5 mt-1 text-blue-500" />
              <p>Kathmandu, Nepal</p>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-1 text-blue-500" />
              <p>info@carrental.com</p>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1 text-blue-500" />
              <p>+977 1 1234567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} CarRental. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-500 transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-blue-500 transition"
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