export default function ListErrorBanner({ message, onRetry }) {
	if (!message) return null;

	return (
		<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
			{message}
			<button
				type="button"
				onClick={onRetry}
				className="ml-3 font-semibold text-red-900 underline hover:no-underline dark:text-red-100"
			>
				Retry
			</button>
		</div>
	);
}
