
import {
  Eye,
  Target,
  CheckCircle,
} from "lucide-react";

const About = () => {
  return (
    <section className="bg-[#f5f5f5] py-16 px-6 lg:px-16">
      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-stretch">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col h-full">
          
          {/* TOP CONTENT */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#07142f] leading-tight">
              Mukinath Travel Agency
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-10">
              We are a trusted car rental service dedicated to providing safe,
              reliable, and comfortable transportation solutions. Whether
              you're traveling for business or leisure, our goal is to make
              your journey smooth, affordable, and hassle-free with a wide
              range of well-maintained vehicles and exceptional customer
              support.
            </p>

            {/* CARDS */}
            <div className="grid md:grid-cols-2 gap-6 mt-14">
              
              {/* Vision */}
              <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
                <div className="flex justify-center">
                  <Eye className="w-14 h-14 text-[#1d2c57]" />
                </div>

                <h3 className="text-3xl font-semibold text-[#07142f] mt-5">
                  Our Vision
                </h3>

                <p className="text-gray-500 mt-6 leading-9 text-lg">
                  To become the most trusted and preferred car rental service
                  provider by continuously improving our services, embracing
                  innovation and building long-term relationships with our
                  customers.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
                <div className="flex justify-center">
                  <Target className="w-14 h-14 text-[#1d2c57]" />
                </div>

                <h3 className="text-3xl font-semibold text-[#07142f] mt-5">
                  Our Mission
                </h3>

                <p className="text-gray-500 mt-6 leading-9 text-lg">
                  To deliver convenient, affordable, and high-quality bike
                  rental services that exceed customer expectations while
                  ensuring safety, comfort, support and reliability in every
                  ride.
                </p>
              </div>
            </div>

            {/* TEXT */}
            <p className="mt-12 text-gray-600 text-xl leading-10">
              We believe every journey matters. That’s why we focus on customer
              satisfaction, transparent pricing, and maintaining a fleet of
              vehicles that meet the highest standards. Your comfort and trust
              drive everything we do.
            </p>
          </div>

          {/* BOTTOM CONTENT */}
          <div className="flex flex-col md:flex-row gap-8 mt-10">
            
            {/* EXPERIENCE */}
            <div className="bg-[#1d2c57] text-white rounded-2xl px-14 py-10 w-full md:w-[320px] flex flex-col justify-center items-center">
              <h2 className="text-6xl font-bold">5+</h2>

              <p className="text-2xl mt-4 font-medium text-center">
                Years Of Experience
              </p>
            </div>

            {/* FEATURES */}
            <div className="flex flex-col justify-center gap-6">
              {[
                "Trusted by thousands",
                "We focus on quality service",
                "Modern vehicles",
                "Transparent pricing",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-600 text-xl"
                >
                  <CheckCircle className="text-[#1d2c57] w-6 h-6" />

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col h-full">
          
          {/* TOP IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
            alt="cars"
            className="w-full h-[65%] object-cover rounded-3xl shadow-lg"
          />

          {/* BOTTOM IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
            alt="travel"
            className="w-[85%] h-[35%] object-cover rounded-3xl shadow-xl border-8 border-[#f5f5f5] self-end -mt-16"
          />
        </div>
      </div>
    </section>
  );
};

export default About;