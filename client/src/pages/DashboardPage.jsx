import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from "chart.js";
import api from "../services/api";
import KpiCard from "../components/KpiCard";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    api.get(`/api/analytics/overview?month=${month}`).then((res) => setData(res.data));
  }, [month]);

  if (!data) return <div>Loading dashboard...</div>;
  const summary = data.summary;
  const pie = {
    labels: Object.keys(summary.category_breakdown),
    datasets: [{ data: Object.values(summary.category_breakdown), backgroundColor: ["#14b8a6", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444"] }],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Finance Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Monthly Expense" value={`$${summary.total_expense.toFixed(2)}`} hint="Current month total" />
        <KpiCard label="Budget" value={`$${summary.budget.toFixed(2)}`} hint="Configured monthly limit" />
        <KpiCard label="Budget Utilization" value={`${summary.budget_utilization}%`} hint="Expense vs budget ratio" />
        <KpiCard label="Anomalies" value={data.anomalies.filter((x) => x.is_unusual).length} hint="Unusual transactions detected" />
      </div>
      <div className="glass-card max-w-xl p-4">
        <h2 className="mb-3 text-lg font-semibold">Category Spending Breakdown</h2>
        <Pie data={pie} />
      </div>
    </div>
  );
}
