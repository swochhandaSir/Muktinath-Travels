import { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ListErrorBanner from "../components/dashboard/ListErrorBanner";
import Modal from "../components/dashboard/Modal";
import { formatDateTime } from "../components/dashboard/BikeBookingsTable";
import { inputClass, labelClass } from "../components/dashboard/bikeFormStyles";
import { useSiteContentAdmin } from "../hooks/useSiteContentAdmin";
import heroImage from "../assets/hero.jpg";

const fieldRows = [
	{
		key: "title",
		label: "Hero title",
		placeholder: "Rent Your Dream Bike Today",
	},
	{
		key: "subtitle",
		label: "Hero subtitle",
		placeholder: "Affordable - Reliable - Comfortable",
	},
	{ key: "buttonText", label: "Button text", placeholder: "Book Now" },
];

function ImagePreview({ src, fallbackSrc, alt }) {
	const imageSrc = src || fallbackSrc;
	if (!imageSrc) return <span className="text-slate-400">-</span>;

	return (
		<img
			src={imageSrc}
			alt={alt}
			className="h-16 w-24 rounded object-cover shadow-sm"
		/>
	);
}

export default function DashboardHome() {
	const siteContent = useSiteContentAdmin();
	const [editOpen, setEditOpen] = useState(false);
	const [heroImageFile, setHeroImageFile] = useState(null);
	const hero = siteContent.content.homeHero;
	const currentHeroImage = hero.imageUrl || heroImage;

	const updateHero = (key, value) => {
		siteContent.setDraft((draft) => ({
			...draft,
			homeHero: { ...draft.homeHero, [key]: value },
		}));
	};

	const openEdit = () => {
		siteContent.resetDraft();
		setHeroImageFile(null);
		setEditOpen(true);
	};

	const closeEdit = () => {
		if (siteContent.submitting) return;
		siteContent.resetDraft();
		setHeroImageFile(null);
		setEditOpen(false);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const saved = await siteContent.saveDraft("homeHero", {
			homeHeroImage: heroImageFile,
		});
		if (saved) setEditOpen(false);
	};

	return (
		<>
			<DashboardHeader title="Home Page" />

			<ListErrorBanner
				message={siteContent.listError}
				onRetry={siteContent.loadSiteContent}
			/>

			<div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[980px] border-collapse text-left text-sm">
						<thead>
							<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
								{[
									"SN",
									"Section",
									"Title",
									"Subtitle",
									"Button",
									"Image",
									"Updated At",
									"Actions",
								].map((heading) => (
									<th
										key={heading}
										className="border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700"
									>
										{heading}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{siteContent.loading ? (
								<tr>
									<td
										colSpan={8}
										className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
									>
										Loading home page content...
									</td>
								</tr>
							) : (
								<tr className="text-slate-600 dark:text-slate-300">
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										1
									</td>
									<td className="border border-slate-200 px-4 py-4 font-medium text-slate-800 dark:border-slate-700 dark:text-slate-100">
										Hero Section
									</td>
									<td className="max-w-64 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-2">{hero.title}</p>
									</td>
									<td className="max-w-72 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-2">{hero.subtitle}</p>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{hero.buttonText}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<ImagePreview
											src={hero.imageUrl}
											fallbackSrc={heroImage}
											alt="Home hero"
										/>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{formatDateTime(siteContent.content.updatedAt)}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<button
											type="button"
											onClick={openEdit}
											className="rounded bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-600"
										>
											Edit
										</button>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal
				open={editOpen}
				onClose={closeEdit}
				titleId="home-content-form-title"
				title="Edit home page hero"
				closeDisabled={siteContent.submitting}
				panelClassName="max-w-2xl"
			>
				<form
					className="mt-4 space-y-4"
					onSubmit={onSubmit}
				>
					{siteContent.formError && (
						<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
							{siteContent.formError}
						</p>
					)}

					<div className="grid gap-4 sm:grid-cols-2">
						{fieldRows.map((field) => (
							<div
								key={field.key}
								className={
									field.key === "title" || field.key === "imageUrl"
										? "sm:col-span-2"
										: ""
								}
							>
								<label
									htmlFor={`home-${field.key}`}
									className={labelClass}
								>
									{field.label}
								</label>
								<input
									id={`home-${field.key}`}
									className={inputClass}
									value={siteContent.draft.homeHero[field.key]}
									onChange={(e) => updateHero(field.key, e.target.value)}
									placeholder={field.placeholder}
									disabled={siteContent.submitting}
								/>
							</div>
						))}
					</div>

					<div>
						<label
							htmlFor="home-hero-image"
							className={labelClass}
						>
							Background image
						</label>
						<input
							id="home-hero-image"
							type="file"
							accept="image/*"
							className={inputClass}
							onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
							disabled={siteContent.submitting}
						/>

						<div className="text-sm text-slate-600 dark:text-slate-300">
							<p>hero image:</p>
							<p>{siteContent.draft.homeHero.imageUrl}</p>
						</div>
					</div>

					<div className="flex flex-wrap justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={closeEdit}
							disabled={siteContent.submitting}
							className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={siteContent.submitting}
							className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
						>
							{siteContent.submitting ? "Saving..." : "Save changes"}
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
}
