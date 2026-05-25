import { Edit, ExternalLink, QrCode, Trash2 } from "lucide-react";
import DashboardButton from "./DashboardButton";

export default function BikesTable({ bikes, loading, onEdit, onDelete }) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
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
                Model / Plate
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                Price/Day
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">
                QR Code
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
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  Loading bikes...
                </td>
              </tr>
            ) : bikes.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    <div className="font-medium">{row.model || "-"}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {row.plateNumber || "No plate"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                    {row.price}
                  </td>
                  <td className="px-4 py-2">
                    {row.qrCode ? (
                      <a
                        href={`/bike-details/${row.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-[var(--color-primary)] dark:text-slate-200"
                      >
                        <img
                          src={row.qrCode}
                          alt={`QR code for ${row.name}`}
                          className="h-16 w-16 rounded border border-slate-200 bg-white object-contain p-1 dark:border-slate-700"
                        />
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <QrCode className="h-4 w-4" aria-hidden="true" />
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <DashboardButton
                        onClick={() => onEdit(row)}
                        variant="primary"
                        size="sm"
                        icon={Edit}
                      >
                        Edit
                      </DashboardButton>
                      <DashboardButton
                        onClick={() => onDelete(row)}
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                      >
                        Delete
                      </DashboardButton>
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
