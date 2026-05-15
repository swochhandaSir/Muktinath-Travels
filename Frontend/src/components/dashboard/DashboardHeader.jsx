export default function DashboardHeader({
	title,
	addLabel,
	onAdd,
}) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
				{title}
			</h1>
			<button
				type="button"
				onClick={onAdd}
				className="inline-flex w-fit items-center justify-center rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
			>
				{addLabel}
			</button>
		</div>
	);
}
