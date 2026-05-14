import React from 'react'
import heroImage from '../assets/hero.jpg'
import VechileCategories from '../components/VechileCategories'
import ProcessSection from '../components/ProcessSection'

const Home = () => {
  return (
    <>
           <section
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight">
            Rent Your Dream Bike Today
          </h1>

          <p className="mt-6 text-lg md:text-2xl">
            Affordable • Reliable • Comfortable
          </p>

          <button className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-gray-200 transition duration-300">
            Book Now
          </button>
        </div>

        {/* Floating Buttons */}
        <div className="fixed right-5 bottom-10 flex flex-col gap-4 z-50">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-full shadow-xl font-semibold">
            📞 Call Us
          </button>

          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-xl font-semibold">
            WhatsApp
          </button>
        </div>
      </section>
      <section>
        <VechileCategories/>
      </section>
      <section>
        <ProcessSection/>
      </section>
    </>
  )
} 

export default Home
