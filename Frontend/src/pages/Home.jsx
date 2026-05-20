import React from 'react'
import heroImage from '../assets/hero.jpg'
import VechileCategories from '../components/VechileCategories'
import ProcessSection from '../components/ProcessSection'
import { useBooking } from '../context/BookingContext'
import Package from '../components/Packages'

const Home = () => {
  const { openBookingForm } = useBooking();

  return (
    <>
           <section
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight">
            Rent Your Dream Bike Today
          </h1>

          <p className="mt-6 text-lg md:text-2xl">
            Affordable • Reliable • Comfortable
          </p>

          <button
            type="button"
            onClick={() => openBookingForm()}
            className="mt-8 bg-white text-(--color-primary) px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-gray-200 transition duration-300"
          >
            Book Now
          </button>
        </div>

        
      </section>
      <section>
        <VechileCategories/>
      </section>
      <section>
        <Package/>
      </section>
      <section>
        <ProcessSection/>
      </section>
    </>
  )
} 

export default Home
