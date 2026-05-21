import { X } from "lucide-react";

export default function Modal({
	open,
	onClose,
	titleId,
	title,
	onBackdropClick,
	panelClassName = "max-w-lg",
	bodyScroll = false,
	children,
	closeDisabled = false,
}) {
	if (!open) return null;

	const handleBackdrop = onBackdropClick ?? onClose;

	const panelBase =
		"w-full min-w-0 rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900";

	const panelLayout = bodyScroll
		? "flex max-h-[90vh] flex-col overflow-hidden"
		: "max-h-[90vh] overflow-x-hidden overflow-y-auto";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-black/50 p-4"
			role="presentation"
			onClick={handleBackdrop}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				className={`${panelBase} ${panelLayout} ${panelClassName}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex shrink-0 items-start justify-between gap-4">
					<h2
						id={titleId}
						className="min-w-0 flex-1 text-lg font-semibold text-slate-800 dark:text-slate-100"
					>
						{title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						disabled={closeDisabled}
						className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
						aria-label="Close"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				{bodyScroll ? (
					<div className="mt-4 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
						{children}
					</div>
				) : (
					children
				)}
			</div>
		</div>
	);
}
