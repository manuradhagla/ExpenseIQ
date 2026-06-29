import { useEffect, useState } from "react";
import api from "../services/api";

export default function BudgetPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [threshold, setThreshold] = useState("");
  const [budgets, setBudgets] = useState([]);

  async function load() {
    const { data } = await api.get(`/api/budgets/?month=${month}`);
    setBudgets(data.items);
  }
  useEffect(() => { load(); }, [month]);

  async function save(e) {
    e.preventDefault();
    await api.post("/api/budgets/", { month, threshold: Number(threshold) });
    setThreshold("");
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Budget Planner</h1>
      <form onSubmit={save} className="glass-card flex flex-wrap gap-3 p-4">
        <input type="month" className="rounded-lg bg-slate-800 p-3" value={month} onChange={(e) => setMonth(e.target.value)} />
        <input className="rounded-lg bg-slate-800 p-3" value={threshold} placeholder="Monthly budget amount" onChange={(e) => setThreshold(e.target.value)} />
        <button className="rounded-lg bg-brand-600 px-4 py-3 font-semibold text-slate-950">Save Budget</button>
      </form>
      <div className="glass-card p-4">
        {budgets.map((b) => <div key={b.id} className="rounded-lg bg-slate-800 p-3">{b.month} | ${b.threshold.toFixed(2)}</div>)}
      </div>
    </div>
  );
}
