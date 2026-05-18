import React, { useState } from "react";

import {
  Car,
  ShieldCheck,
  Headphones,
  Users,
  MapPin,
  Briefcase,
  Quote,
  Star,
} from "lucide-react";
import TopSection from "../components/TopSection";

const services = [
  {
    icon: <Car className="w-10 h-10 text-[var(--color-primary)]" />,
    title: "Wide Vehicle Selection",
    description:
      "Choose from a diverse fleet of cars, SUVs, and luxury vehicles for every type of journey.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-[var(--color-primary)]" />,
    title: "Full Insurance Coverage",
    description:
      "Travel with confidence using our comprehensive insurance coverage on every rental.",
  },
  {
    icon: <Headphones className="w-10 h-10 text-[var(--color-primary)]" />,
    title: "24/7 Customer Support",
    description:
      "Our support team is available anytime for bookings, queries, and roadside assistance.",
  },
];

const stats = [
  {
    icon: <Car className="w-8 h-8 text-[var(--color-primary)]" />,
    number: "120+",
    label: "Cars Available",
  },
  {
    icon: <Users className="w-8 h-8 text-[var(--color-primary)]" />,
    number: "3500+",
    label: "Happy Customers",
  },
  {
    icon: <MapPin className="w-8 h-8 text-[var(--color-primary)]" />,
    number: "25+",
    label: "Cities Covered",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-[var(--color-primary)]" />,
    number: "25+",
    label: "Years Experience",
  },
];

const reviews = [
  {
    name: "Rudra pratap adhikari",
    review: "🙏🙏🙏🙏",
  },
  {
    name: "Sanjana",
    review: "Excellent experience overall",
  },
  {
    name: "Aayush Sharma",
    review:
      "Great service for a family trip. The SUV was in good condition and the pricing was fair.",
  },
  {
    name: "Pratik Gurung",
    review:
      "Booking was quick and support was helpful when I needed to extend my rental by one day.",
  },
  {
    name: "Nisha Thapa",
    review:
      "Reliable vehicle and friendly team. I would choose them again for airport pickup and city travel.",
  },
  {
    name: "Kiran Basnet",
    review:
      "The rental was hassle-free from start to finish. Return inspection was fast and transparent.",
  },
  {
    name: "Bikash Rai",
    review:
      "Good selection of vehicles and flexible packages. The car performed well during a long drive.",
  },
  {
    name: "Mina Karki",
    review:
      "Very professional service. The vehicle was spotless, fuel policy was clear, and there were no hidden charges.",
  },
];

const service = {
  title: "Our Services",
  breadcrumb: "Home / Pages / Service",
};

const Service = () => {
  const reviewsPerPage = 2;
  const reviewPages = Array.from(
    { length: Math.ceil(reviews.length / reviewsPerPage) },
    (_, index) =>
      reviews.slice(
        index * reviewsPerPage,
        index * reviewsPerPage + reviewsPerPage,
      ),
  );
  const [activeReviewPage, setActiveReviewPage] = useState(0);
  const activeReviews = reviewPages[activeReviewPage];

  return (
    <div className="bg-white">
      <TopSection data={service} />

      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-black text-5xl font-bold mb-3 tracking-wider">
            Our Services
          </p>

          <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
            Explore our comprehensive range of car rental services designed to
            meet your needs. From short-term rentals to long-term leases, we
            offer flexible options for individuals and businesses alike. Our
            services include a wide selection of vehicles, competitive pricing,
            and exceptional customer support to ensure a seamless rental
            experience. Whether you're looking for a compact car for city
            driving or a spacious SUV for a family trip, we have the perfect
            solution for you. Experience convenience, reliability, and quality
            with our top-notch car rental services.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 text-center"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>

              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[url(https://media.istockphoto.com/id/1190475811/photo/rush-in-the-city.webp?a=1&b=1&s=612x612&w=0&k=20&c=pgEobykYrVwHxzRyCKixA6TSA4wh4yCyj_aY9TuqLm4=)] bg-no-repeat bg-cover bg-centre h-[350px]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center pt-32">
          {stats.map((item, index) => (
            <div key={index} className="text-white">
              <div className="flex justify-center mb-4 text-white">
                {item.icon}
              </div>

              <h2 className="text-4xl font-bold mb-2">{item.number}</h2>

              <p className="text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Review Section */}

      <section className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Our Clients Reviews
            </h2>

            <p className="text-gray-500 text-lg">
              Hear what our clients have to say about us!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {activeReviews.map((item, index) => (
              <div
                key={index}
                className="relative border border-[var(--color-primary)] rounded-2xl bg-white"
              >
                <div className="absolute -top-8 right-8 w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="text-white w-8 h-8" />
                </div>

                <div className="px-12 pt-10 pb-6">
                  <h3 className="text-4xl md:text-[38px] font-medium text-slate-800 mb-4">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-slate-800 text-slate-800"
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                <div className="px-8 py-8">
                  <p className="text-gray-500 text-lg">{item.review}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-6 mt-24">
            {reviewPages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveReviewPage(index)}
                aria-label={`Show review page ${index + 1}`}
                className={`w-7 h-7 rounded-full border-[6px] border-[var(--color-primary)] transition ${
                  activeReviewPage === index
                    ? "bg-[var(--color-primary)] border-[var(--color-primary-dark)]"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Service;
