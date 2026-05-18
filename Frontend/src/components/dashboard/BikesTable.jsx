export default function BikesTable({ bikes, loading, onEdit, onDelete }) {
  return (
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
                        onClick={() => onEdit(row)}
                        className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
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
  );
}
