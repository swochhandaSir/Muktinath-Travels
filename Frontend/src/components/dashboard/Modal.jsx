import { X } from "lucide-react";

export default function Modal({
	open,
	onClose,
	titleId,
	title,
	onBackdropClick,
	panelClassName = "max-w-lg",
	children,
	closeDisabled = false,
}) {
	if (!open) return null;

	const handleBackdrop = onBackdropClick ?? onClose;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			role="presentation"
			onClick={handleBackdrop}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900 ${panelClassName}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<h2
						id={titleId}
						className="text-lg font-semibold text-slate-800 dark:text-slate-100"
					>
						{title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						disabled={closeDisabled}
						className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
						aria-label="Close"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
