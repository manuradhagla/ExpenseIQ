import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const { pushToast } = useToast();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [income, setIncome] = useState(user?.monthly_income || 0);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/users/profile", { full_name: fullName, monthly_income: Number(income) });
      await refresh();
      setMsg("Settings updated.");
      pushToast("Profile updated.", "success");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form onSubmit={save} className="glass-card max-w-xl space-y-3 p-4">
        {msg && <p className="text-emerald-400">{msg}</p>}
        <input className="w-full rounded-lg bg-slate-800 p-3" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input className="w-full rounded-lg bg-slate-800 p-3" value={income} onChange={(e) => setIncome(e.target.value)} />
        <button disabled={saving} className="rounded-lg bg-brand-600 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
