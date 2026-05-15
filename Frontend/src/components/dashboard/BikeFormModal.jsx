import Modal from "./Modal";
import { inputClass, labelClass } from "./bikeFormStyles";

export default function BikeFormModal({
	open,
	mode,
	bike,
	draft,
	onDraftChange,
	formError,
	submitting,
	imageInputRef,
	onClose,
	onSubmit,
}) {
	const isAdd = mode === "add";

	return (
		<Modal
			open={open}
			onClose={onClose}
			titleId="bike-form-title"
			title={isAdd ? "Add bike" : "Edit bike"}
			closeDisabled={submitting}
		>
			<form className="mt-4 space-y-4" onSubmit={onSubmit}>
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
							onDraftChange((d) => ({ ...d, name: e.target.value }))
						}
						placeholder="Bike name"
						autoComplete="off"
						disabled={submitting}
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
							onDraftChange((d) => ({ ...d, price: e.target.value }))
						}
						placeholder="8000"
						disabled={submitting}
					/>
				</div>

				<div>
					<label htmlFor="bike-image" className={labelClass}>
						Image{" "}
						{!isAdd && (
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
						disabled={submitting}
					/>
					{!isAdd && bike?.image && (
						<p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
							Current:{" "}
							<a
								href={bike.image}
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
						onClick={onClose}
						disabled={submitting}
						className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={submitting}
						className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-50"
					>
						{submitting ? "Saving…" : isAdd ? "Add bike" : "Save changes"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
