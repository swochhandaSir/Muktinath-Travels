export const defaultSiteContent = {
	homeHero: {
		title: "Rent Your Dream Bike Today",
		subtitle: "Affordable - Reliable - Comfortable",
		buttonText: "Book Now",
		imageUrl: "",
	},
	about: {
		heading: "",
		description: "",
		visionTitle: "Our Vision",
		visionText:
			"To become the most trusted and preferred car rental service provider by continuously improving our services, embracing innovation and building long-term relationships with our customers.",
		missionTitle: "Our Mission",
		missionText:
			"To deliver convenient, affordable, and high-quality bike rental services that exceed customer expectations while ensuring safety, comfort, support and reliability in every ride.",
		closingText:
			"We believe every journey matters. That's why we focus on customer satisfaction, transparent pricing, and maintaining a fleet of vehicles that meet the highest standards. Your comfort and trust drive everything we do.",
		experienceYears: "5+",
		experienceLabel: "Years Of Experience",
		features: [
			"Trusted by thousands",
			"We focus on quality service",
			"Modern vehicles",
			"Transparent pricing",
		],
		primaryImageUrl:
			"https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
		secondaryImageUrl:
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
	},
	process: {
		heading: "Travel Agency",
		subheading: "Process",
		description:
			"Bike rental made easy! Follow our simple 3-step process to get on the road in no time. Choose your bike, book online, and enjoy your ride!",
		backgroundImageUrl:
			"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80",
		steps: [
			{
				number: "01.",
				title: "Come In Contact",
				description:
					"Come in contact with us to get more information about our bike rental services.",
			},
			{
				number: "02.",
				title: "Choose A Bike",
				description: "Browse our fleet and select the perfect bike for your needs.",
			},
			{
				number: "03.",
				title: "Enjoy Riding",
				description:
					"Sit back, relax, and enjoy your journey with our reliable and comfortable bikes.",
			},
		],
	},
};

export function mergeSiteContent(content) {
	return {
		...defaultSiteContent,
		...(content || {}),
		homeHero: {
			...defaultSiteContent.homeHero,
			...(content?.homeHero || {}),
		},
		about: {
			...defaultSiteContent.about,
			...(content?.about || {}),
			features: content?.about?.features?.length
				? content.about.features
				: defaultSiteContent.about.features,
		},
		process: {
			...defaultSiteContent.process,
			...(content?.process || {}),
			steps: content?.process?.steps?.length
				? content.process.steps.map((step, index) => ({
						number:
							step.number || `${String(index + 1).padStart(2, "0")}.`,
						title: step.title || "",
						description: step.description || "",
					}))
				: defaultSiteContent.process.steps,
		},
	};
}
