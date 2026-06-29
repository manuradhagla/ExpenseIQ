import { useEffect, useState } from "react";
import api from "../services/api";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const month = new Date().toISOString().slice(0, 7);
  useEffect(() => { api.get(`/api/analytics/overview?month=${month}`).then((r) => setData(r.data)); }, [month]);
  if (!data) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expense Analytics</h1>
      <div className="glass-card p-4">
        <h2 className="font-semibold">Anomaly Detection</h2>
        <div className="mt-3 space-y-2">
          {data.anomalies.slice(0, 10).map((a) => (
            <div key={a.expense_id} className="rounded-lg bg-slate-800 p-3 text-sm">
              {a.title} | ${a.amount.toFixed(2)} | score: {a.anomaly_score} {a.is_unusual ? "(Unusual)" : ""}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.charts.pie_chart && <img className="glass-card w-full p-2" src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/analytics/charts/${data.charts.pie_chart}`} alt="Pie chart" />}
        {data.charts.bar_chart && <img className="glass-card w-full p-2" src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/analytics/charts/${data.charts.bar_chart}`} alt="Bar chart" />}
      </div>
    </div>
  );
}
