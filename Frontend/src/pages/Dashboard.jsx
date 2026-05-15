import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import { apiUrl } from "../lib/api";

function emptyDraft() {
	return {
		name: "",
		price: "",
	};
}

function bikeToDraft(bike) {
	return {
		name: bike.name,
		price: String(bike.price),
	};
}

const inputClass =
	"mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

async function parseErrorMessage(res) {
	const text = await res.text();
	if (!text) return `Request failed (${res.status})`;
	try {
		const j = JSON.parse(text);
		if (j && typeof j.message === "string") return j.message;
	} catch {
		/* ignore */
	}
	return text.length > 180 ? `${text.slice(0, 180)}…` : text;
}

const Dashboard = () => {
	const [bikes, setBikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formModal, setFormModal] = useState(null);
	const [draft, setDraft] = useState(emptyDraft);
	const [formError, setFormError] = useState("");
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const imageInputRef = useRef(null);

	const loadBikes = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/bikes"));
			if (!res.ok) throw new Error(await parseErrorMessage(res));
			setBikes(await res.json());
		} catch (err) {
			setListError(err.message || "Failed to load bikes.");
			setBikes([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadBikes();
	}, [loadBikes]);

	useEffect(() => {
		if (!formModal) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				setFormModal(null);
				setFormError("");
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [formModal]);

	useEffect(() => {
		if (!deleteTarget) return;
		const onKey = (e) => {
			if (e.key === "Escape") setDeleteTarget(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [deleteTarget]);

	const openAdd = () => {
		setDraft(emptyDraft());
		setFormError("");
		if (imageInputRef.current) imageInputRef.current.value = "";
		setFormModal({ mode: "add" });
	};

	const openEdit = (bike) => {
		setDraft(bikeToDraft(bike));
		setFormError("");
		if (imageInputRef.current) imageInputRef.current.value = "";
		setFormModal({ mode: "edit", bike });
	};

	const closeForm = () => {
		setFormModal(null);
		setFormError("");
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const name = draft.name.trim();
		const priceNum = Number.parseFloat(draft.price);
		const file = imageInputRef.current?.files?.[0];

		if (!name) {
			setFormError("Name is required.");
			return;
		}
		if (!Number.isFinite(priceNum) || priceNum < 0) {
			setFormError("Enter a valid price per day.");
			return;
		}
		if (formModal.mode === "add" && !file) {
			setFormError("Choose an image file.");
			return;
		}

		const fd = new FormData();
		fd.append("name", name);
		fd.append("price", String(priceNum));
		if (file) fd.append("image", file);

		setFormSubmitting(true);
		setFormError("");
		try {
			const url =
				formModal.mode === "add"
					? apiUrl("/api/bikes")
					: apiUrl(`/api/bikes/${formModal.bike.id}`);
			const res = await fetch(url, {
				method: formModal.mode === "add" ? "POST" : "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseErrorMessage(res));
			await loadBikes();
			closeForm();
		} catch (err) {
			setFormError(err.message || "Something went wrong.");
		} finally {
			setFormSubmitting(false);
		}
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		setDeleteSubmitting(true);
		try {
			const res = await fetch(apiUrl(`/api/bikes/${deleteTarget.id}`), {
				method: "DELETE",
			});
			if (!res.ok) {
				throw new Error(await parseErrorMessage(res));
			}
			await loadBikes();
			setDeleteTarget(null);
		} catch (err) {
			setListError(err.message || "Failed to delete bike.");
			setDeleteTarget(null);
		} finally {
			setDeleteSubmitting(false);
		}
	};

	return (
		<AdminLayout>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
					Bikes
				</h1>
				<button
					type="button"
					onClick={openAdd}
					className="inline-flex w-fit items-center justify-center rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
				>
					+ Add Bike
				</button>
			</div>

			{listError && (
				<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
					{listError}
					<button
						type="button"
						onClick={() => loadBikes()}
						className="ml-3 font-semibold text-red-900 underline hover:no-underline dark:text-red-100"
					>
						Retry
					</button>
				</div>
			)}

			<div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[520px] text-left text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-[#e8eef4] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
								<th className="whitespace-nowrap px-4 py-3 font-semibold">SN</th>
								<th className="whitespace-nowrap px-4 py-3 font-semibold">
									Image
								</th>
								<th className="whitespace-nowrap px-4 py-3 font-semibold">
									Name
								</th>
								<th className="whitespace-nowrap px-4 py-3 font-semibold">
									Price/Day
								</th>
								<th className="whitespace-nowrap px-4 py-3 font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
									>
										Loading bikes...
									</td>
								</tr>
							) : bikes.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
									>
										No bikes yet. Click &quot;+ Add Bike&quot; to create one.
									</td>
								</tr>
							) : (
								bikes.map((row, i) => (
									<tr
										key={row.id}
										className={`border-b border-slate-100 dark:border-slate-800 ${
											i % 2 === 0
												? "bg-white dark:bg-slate-900"
												: "bg-slate-50/80 dark:bg-slate-900/80"
										}`}
									>
										<td className="px-4 py-3 text-slate-600 dark:text-slate-300">
											{i + 1}
										</td>
										<td className="px-4 py-2">
											{row.image ? (
												<img
													src={row.image}
													alt=""
													className="h-12 w-16 rounded object-cover"
												/>
											) : (
												<span className="text-slate-400">—</span>
											)}
										</td>
										<td className="max-w-[280px] px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
											{row.name}
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
											{row.price}
										</td>
										<td className="px-4 py-3">
											<div className="flex flex-wrap gap-2">
												<button
													type="button"
													onClick={() => openEdit(row)}
													className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600"
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() => setDeleteTarget(row)}
													className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
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

			{formModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					role="presentation"
					onClick={closeForm}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="bike-form-title"
						className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start justify-between gap-4">
							<h2
								id="bike-form-title"
								className="text-lg font-semibold text-slate-800 dark:text-slate-100"
							>
								{formModal.mode === "add" ? "Add bike" : "Edit bike"}
							</h2>
							<button
								type="button"
								onClick={closeForm}
								disabled={formSubmitting}
								className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
								aria-label="Close"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<form className="mt-4 space-y-4" onSubmit={submitForm}>
							{formError && (
								<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
									{formError}
								</p>
							)}

							<div>
								<label htmlFor="bike-name" className={labelClass}>
									Name
								</label>
								<input
									id="bike-name"
									className={inputClass}
									value={draft.name}
									onChange={(e) =>
										setDraft((d) => ({ ...d, name: e.target.value }))
									}
									placeholder="Bike name"
									autoComplete="off"
									disabled={formSubmitting}
								/>
							</div>

							<div>
								<label htmlFor="bike-price" className={labelClass}>
									Price / day
								</label>
								<input
									id="bike-price"
									inputMode="decimal"
									className={inputClass}
									value={draft.price}
									onChange={(e) =>
										setDraft((d) => ({ ...d, price: e.target.value }))
									}
									placeholder="8000"
									disabled={formSubmitting}
								/>
							</div>

							<div>
								<label htmlFor="bike-image" className={labelClass}>
									Image{" "}
									{formModal.mode === "edit" && (
										<span className="font-normal text-slate-500">
											(optional — leave empty to keep current)
										</span>
									)}
								</label>
								<input
									id="bike-image"
									ref={imageInputRef}
									type="file"
									accept="image/*"
									className={inputClass}
									disabled={formSubmitting}
								/>
								{formModal.mode === "edit" && formModal.bike?.image && (
									<p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
										Current:{" "}
										<a
											href={formModal.bike.image}
											target="_blank"
											rel="noreferrer"
											className="text-teal-600 underline dark:text-teal-400"
										>
											view image
										</a>
									</p>
								)}
							</div>

							<div className="flex flex-wrap justify-end gap-2 pt-2">
								<button
									type="button"
									onClick={closeForm}
									disabled={formSubmitting}
									className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={formSubmitting}
									className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-50"
								>
									{formSubmitting
										? "Saving…"
										: formModal.mode === "add"
											? "Add bike"
											: "Save changes"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{deleteTarget && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					role="presentation"
					onClick={() => !deleteSubmitting && setDeleteTarget(null)}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="delete-title"
						className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
						onClick={(e) => e.stopPropagation()}
					>
						<h2
							id="delete-title"
							className="text-lg font-semibold text-slate-800 dark:text-slate-100"
						>
							Delete bike?
						</h2>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
							This will remove{" "}
							<span className="font-medium text-slate-800 dark:text-slate-100">
								{deleteTarget.name}
							</span>{" "}
							from the database. This cannot be undone.
						</p>
						<div className="mt-6 flex flex-wrap justify-end gap-2">
							<button
								type="button"
								onClick={() => setDeleteTarget(null)}
								disabled={deleteSubmitting}
								className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={confirmDelete}
								disabled={deleteSubmitting}
								className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
							>
								{deleteSubmitting ? "Deleting…" : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
};

export default Dashboard;
