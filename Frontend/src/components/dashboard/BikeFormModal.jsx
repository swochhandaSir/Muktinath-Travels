import { Save, X } from "lucide-react";
import DashboardButton from "./DashboardButton";
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
  licenseImageInputRef,
  onClose,
  onSubmit,
}) {
  const isAdd = mode === "add";
  const updateDraft = (field, value) =>
    onDraftChange((d) => ({ ...d, [field]: value }));

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
            onChange={(e) => updateDraft("name", e.target.value)}
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
            onChange={(e) => updateDraft("price", e.target.value)}
            placeholder="8000"
            disabled={submitting}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-model" className={labelClass}>
              Model
            </label>
            <input
              id="bike-model"
              className={inputClass}
              value={draft.model}
              onChange={(e) => updateDraft("model", e.target.value)}
              placeholder="Duke 250"
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-color" className={labelClass}>
              Color
            </label>
            <input
              id="bike-color"
              className={inputClass}
              value={draft.color}
              onChange={(e) => updateDraft("color", e.target.value)}
              placeholder="Black"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-plate" className={labelClass}>
              Plate number
            </label>
            <input
              id="bike-plate"
              className={inputClass}
              value={draft.plateNumber}
              onChange={(e) => updateDraft("plateNumber", e.target.value)}
              placeholder="BA 00 PA 0000"
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-blue-book" className={labelClass}>
              Blue book number
            </label>
            <input
              id="bike-blue-book"
              className={inputClass}
              value={draft.blueBookNumber}
              onChange={(e) => updateDraft("blueBookNumber", e.target.value)}
              placeholder="Blue book number"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-chassis" className={labelClass}>
              Chassis number
            </label>
            <input
              id="bike-chassis"
              className={inputClass}
              value={draft.chassisNumber}
              onChange={(e) => updateDraft("chassisNumber", e.target.value)}
              placeholder="Chassis number"
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-engine" className={labelClass}>
              Engine number
            </label>
            <input
              id="bike-engine"
              className={inputClass}
              value={draft.engineNumber}
              onChange={(e) => updateDraft("engineNumber", e.target.value)}
              placeholder="Engine number"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bike-mileage" className={labelClass}>
              Mileage
            </label>
            <input
              id="bike-mileage"
              inputMode="decimal"
              className={inputClass}
              value={draft.mileage}
              onChange={(e) => updateDraft("mileage", e.target.value)}
              placeholder="35"
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="bike-engine-capacity" className={labelClass}>
              Engine capacity
            </label>
            <input
              id="bike-engine-capacity"
              inputMode="decimal"
              className={inputClass}
              value={draft.engineCapacity}
              onChange={(e) => updateDraft("engineCapacity", e.target.value)}
              placeholder="250"
              disabled={submitting}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={draft.available}
            onChange={(e) => updateDraft("available", e.target.checked)}
            disabled={submitting}
            className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          Available
        </label>

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
                className="text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
              >
                view image
              </a>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="bike-license-image" className={labelClass}>
            License image{" "}
            {!isAdd && (
              <span className="font-normal text-slate-500">
                (optional - leave empty to keep current)
              </span>
            )}
          </label>
          <input
            id="bike-license-image"
            ref={licenseImageInputRef}
            type="file"
            accept="image/*"
            className={inputClass}
            disabled={submitting}
          />
          {!isAdd && bike?.licenseImage && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Current:{" "}
              <a
                href={bike.licenseImage}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-primary)] underline dark:text-[var(--color-primary)]"
              >
                view license image
              </a>
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <DashboardButton
            type="button"
            onClick={onClose}
            disabled={submitting}
            variant="secondary"
            icon={X}
          >
            Cancel
          </DashboardButton>
          <DashboardButton
            type="submit"
            disabled={submitting}
            variant="primary"
            icon={Save}
          >
            {submitting ? "Saving…" : isAdd ? "Add bike" : "Save changes"}
          </DashboardButton>
        </div>
      </form>
    </Modal>
  );
}
