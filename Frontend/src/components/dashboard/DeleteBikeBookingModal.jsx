import Modal from "./Modal";

export default function DeleteBikeBookingModal({
	booking,
	submitting,
	onCancel,
	onConfirm,
}) {
	return (
		<Modal
			open={Boolean(booking)}
			onClose={onCancel}
			onBackdropClick={() => !submitting && onCancel()}
			titleId="delete-bike-booking-title"
			title="Delete booking?"
			panelClassName="max-w-md"
			closeDisabled={submitting}
		>
			<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
				This will remove the booking from{" "}
				<span className="font-medium text-slate-800 dark:text-slate-100">
					{booking?.customerName}
				</span>
				. This cannot be undone.
			</p>
			<div className="mt-6 flex flex-wrap justify-end gap-2">
				<button
					type="button"
					onClick={onCancel}
					disabled={submitting}
					className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					disabled={submitting}
					className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
				>
					{submitting ? "Deleting..." : "Delete"}
				</button>
			</div>
		</Modal>
	);
}
