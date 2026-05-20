import { formatDateTime } from "./BikeBookingsTable";
import Modal from "./Modal";

function DetailRow({ label, value }) {
	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
				{label}
			</p>
			<p className="mt-1 break-words text-sm text-slate-700 dark:text-slate-200">
				{value || "-"}
			</p>
		</div>
	);
}

export default function ContactMessageDetailsModal({ message, onClose }) {
	return (
		<Modal
			open={Boolean(message)}
			onClose={onClose}
			titleId="contact-message-details-title"
			title="Contact message"
			panelClassName="max-w-2xl"
		>
			<div className="mt-5 grid gap-5 sm:grid-cols-2">
				<DetailRow label="Name" value={message?.name} />
				<DetailRow label="Email" value={message?.email} />
				<DetailRow label="Phone" value={message?.phone} />
				<DetailRow label="Subject" value={message?.subject} />
				<DetailRow
					label="Created At"
					value={formatDateTime(message?.createdAt)}
				/>
			</div>

			<div className="mt-5">
				<DetailRow label="Message" value={message?.message} />
			</div>

			<div className="mt-6 flex justify-end">
				<button
					type="button"
					onClick={onClose}
					className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
				>
					Close
				</button>
			</div>
		</Modal>
	);
}
