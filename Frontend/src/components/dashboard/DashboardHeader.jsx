export default function DashboardHeader({ title, addLabel, onAdd }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h1>
      {addLabel && onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex w-fit items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}
