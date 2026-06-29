import { useState } from "react";

export default function ReportsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="glass-card flex flex-wrap gap-3 p-4">
        <input type="month" className="rounded-lg bg-slate-800 p-3" value={month} onChange={(e) => setMonth(e.target.value)} />
        <a href={`${apiBase}/api/reports/export/csv?month=${month}`} className="rounded-lg bg-brand-600 px-4 py-3 font-semibold text-slate-950">Download CSV</a>
        <a href={`${apiBase}/api/reports/export/pdf?month=${month}`} className="rounded-lg border border-slate-700 px-4 py-3">Download PDF</a>
      </div>
    </div>
  );
}
