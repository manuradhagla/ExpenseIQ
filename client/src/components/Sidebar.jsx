import { Link, useLocation } from "react-router-dom";

const links = [
  ["Dashboard", "/app/dashboard"],
  ["Add Expense", "/app/expenses"],
  ["Analytics", "/app/analytics"],
  ["Budget Planner", "/app/budget"],
  ["Reports", "/app/reports"],
  ["Settings", "/app/settings"],
];

export default function Sidebar({ onLogout }) {
  const { pathname } = useLocation();
  return (
    <aside className="min-h-screen w-64 border-r border-slate-800 bg-slate-950 p-4">
      <div className="mb-8 text-2xl font-bold text-brand-500">ExpenseIQ</div>
      <div className="space-y-2">
        {links.map(([name, href]) => (
          <Link
            key={name}
            to={href}
            className={`block rounded-lg px-3 py-2 ${pathname === href ? "bg-brand-600 text-slate-950" : "text-slate-200 hover:bg-slate-800"}`}
          >
            {name}
          </Link>
        ))}
      </div>
      <button onClick={onLogout} className="mt-8 w-full rounded-lg border border-rose-500 px-3 py-2 text-rose-400">
        Logout
      </button>
    </aside>
  );
}
