import { CheckCircle, Eye, Target } from "lucide-react";
import { useCompanyDetails } from "../hooks/useCompanyDetails";
import { useSiteContent } from "../hooks/useSiteContent";

const About = () => {
	const { details } = useCompanyDetails();
	const { content } = useSiteContent();
	const aboutContent = content.about;
	const companyName = aboutContent.heading || details?.name || "About Us";
	const about = aboutContent.description || details?.about || "";

	return (
		<section className="bg-[#f5f5f5] px-6 py-16 lg:px-16">
			<div className="mx-auto grid max-w-7xl items-stretch gap-12 lg:grid-cols-2">
				<div className="flex h-full flex-col">
					<div>
						<h1 className="text-4xl font-bold leading-tight text-[#07142f] md:text-6xl">
							{companyName}
						</h1>

						<p className="mt-6 text-lg leading-10 text-gray-600">{about}</p>

						<div className="mt-14 grid gap-6 md:grid-cols-2">
							<div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
								<div className="flex justify-center">
									<Eye className="h-14 w-14 text-[#1d2c57]" />
								</div>

								<h3 className="mt-5 text-3xl font-semibold text-[#07142f]">
									Our Vision
								</h3>

								<p className="mt-6 text-lg leading-9 text-gray-500">
									{aboutContent.visionText}
								</p>
							</div>

							<div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
								<div className="flex justify-center">
									<Target className="h-14 w-14 text-[#1d2c57]" />
								</div>

								<h3 className="mt-5 text-3xl font-semibold text-[#07142f]">
									Our Mission
								</h3>

								<p className="mt-6 text-lg leading-9 text-gray-500">
									{aboutContent.missionText}
								</p>
							</div>
						</div>

						<p className="mt-12 text-xl leading-10 text-gray-600">
							{aboutContent.closingText}
						</p>
					</div>

					<div className="mt-10 flex flex-col gap-8 md:flex-row">
						<div className="flex w-full flex-col items-center justify-center rounded-2xl bg-[#1d2c57] px-14 py-10 text-white md:w-[320px]">
							<h2 className="text-6xl font-bold">{aboutContent.experienceYears}</h2>

							<p className="mt-4 text-center text-2xl font-medium">
								{aboutContent.experienceLabel}
							</p>
						</div>

						<div className="flex flex-col justify-center gap-6">
							{aboutContent.features.map((item, index) => (
								<div
									key={`${item}-${index}`}
									className="flex items-center gap-3 text-xl text-gray-600"
								>
									<CheckCircle className="h-6 w-6 text-[#1d2c57]" />
									<span>{item}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="flex h-full flex-col">
					<img
						src={aboutContent.primaryImageUrl}
						alt="cars"
						className="h-[65%] w-full rounded-3xl object-cover shadow-lg"
					/>

					<img
						src={aboutContent.secondaryImageUrl}
						alt="travel"
						className="-mt-16 h-[35%] w-[85%] self-end rounded-3xl border-8 border-[#f5f5f5] object-cover shadow-xl"
					/>
				</div>
			</div>
		</section>
	);
};

export default About;
