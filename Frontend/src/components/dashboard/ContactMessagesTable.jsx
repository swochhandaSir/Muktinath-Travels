import { formatDateTime } from "./BikeBookingsTable";

export default function ContactMessagesTable({
	messages,
	loading,
	onView,
	onDelete,
}) {
	return (
		<div className="mt-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[980px] border-collapse text-left text-sm">
					<thead>
						<tr className="bg-[#e8eef4] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
							{[
								"SN",
								"Name",
								"Email",
								"Phone",
								"Subject",
								"Message",
								"Created At",
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
						{loading ? (
							<tr>
								<td
									colSpan={8}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									Loading contact messages...
								</td>
							</tr>
						) : messages.length === 0 ? (
							<tr>
								<td
									colSpan={8}
									className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
								>
									No contact messages yet.
								</td>
							</tr>
						) : (
							messages.map((message, i) => (
								<tr
									key={message.id}
									className="text-slate-600 dark:text-slate-300"
								>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{i + 1}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{message.name}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{message.email}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{message.phone || "-"}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{message.subject || "-"}
									</td>
									<td className="max-w-56 border border-slate-200 px-4 py-4 dark:border-slate-700">
										<p className="line-clamp-3">{message.message}</p>
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										{formatDateTime(message.createdAt)}
									</td>
									<td className="border border-slate-200 px-4 py-4 dark:border-slate-700">
										<div className="flex flex-col items-start gap-2">
											<button
												type="button"
												onClick={() => onView(message)}
												className="rounded bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-600"
											>
												View
											</button>
											<button
												type="button"
												onClick={() => onDelete(message)}
												className="rounded bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
