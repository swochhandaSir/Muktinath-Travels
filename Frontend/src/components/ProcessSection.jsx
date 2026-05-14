import React from 'react'

const ProcessSection = () => {
    const processSteps = [
  {
    number: "01.",
    title: "Come In Contact",
    description:
      "Come in contact with us to get more information about our car rental services.",
  },
  {
    number: "02.",
    title: "Choose A Car",
    description: "Browse our fleet and select the perfect car for your needs.",
  },
  {
    number: "03.",
    title: "Enjoy Driving",
    description:
      "Sit back, relax, and enjoy your journey with our reliable and comfortable vehicles.",
  },
];

  return (
    <section className="relative overflow-hidden bg-[url(https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80)] bg-cover bg-center py-24 text-white">
    <div className="absolute inset-0 bg-black/85"></div>
    <div className="relative z-10 mx-auto max-w-7xl px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold leading-tight md:text-5xl">
          Travel Agency
          <span className="block">Process</span>
        </h2>
        <p className="mt-6 text-base font-medium leading-relaxed">
          Car rental made easy! Follow our simple 3-step process to get on the
          road in no time. Choose your car, book online, and enjoy your ride!
        </p>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-6">
        {processSteps.map((step) => (
          <div key={step.number} className="relative">
            <div className="rounded-lg bg-blue-600 px-6 py-6 shadow-xl">
              <h3 className="text-2xl font-medium">{step.title}</h3>
              <p className="mt-3 text-base font-medium leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="absolute -bottom-8 right-10 flex h-16 w-16 items-center justify-center rounded-full border border-white bg-blue-600 text-lg font-bold shadow-xl">
              {step.number}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default ProcessSection
