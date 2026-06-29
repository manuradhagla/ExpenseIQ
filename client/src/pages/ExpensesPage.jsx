import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const categories = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"];
const paymentModes = ["Cash", "UPI", "Card", "Bank Transfer", "Wallet"];

export default function ExpensesPage() {
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", payment_mode: "UPI", note: "", spent_on: new Date().toISOString().slice(0, 10) });
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/expenses/?limit=8&page=${page}&search=${encodeURIComponent(query)}`);
      setItems(data.items);
      setMeta({ total: data.total, pages: data.pages || 1 });
    } catch (err) {
      if (err.response?.status === 401) {
        pushToast("Session expired. Please log in again.", "error");
        navigate("/login");
      } else {
        pushToast("Could not load expenses.", "error");
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [page, query]);

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || Number(form.amount) <= 0) {
      pushToast("Enter valid title and amount.", "error");
      return;
    }
    await api.post("/api/expenses/", { ...form, amount: Number(form.amount) });
    setForm({ ...form, title: "", amount: "", note: "" });
    pushToast("Expense added.", "success");
    load();
  }

  async function remove(id) {
    await api.delete(`/api/expenses/${id}`);
    pushToast("Expense deleted.", "success");
    load();
  }

  async function saveEdit(e) {
    e.preventDefault();
    await api.put(`/api/expenses/${editing.id}`, { ...editing, amount: Number(editing.amount) });
    setEditing(null);
    pushToast("Expense updated.", "success");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Add Expense</h1>
        <input
          className="rounded-lg bg-slate-800 p-3"
          placeholder="Search by title/category"
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
        />
      </div>
      <form onSubmit={submit} className="glass-card grid gap-3 p-4 md:grid-cols-3">
        <input className="rounded-lg bg-slate-800 p-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-lg bg-slate-800 p-3" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input type="date" className="rounded-lg bg-slate-800 p-3" value={form.spent_on} onChange={(e) => setForm({ ...form, spent_on: e.target.value })} />
        <select className="rounded-lg bg-slate-800 p-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="rounded-lg bg-slate-800 p-3" value={form.payment_mode} onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}>{paymentModes.map((p) => <option key={p}>{p}</option>)}</select>
        <input className="rounded-lg bg-slate-800 p-3" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <button className="rounded-lg bg-brand-600 p-3 font-semibold text-slate-950 md:col-span-3">Save Expense</button>
      </form>
      <div className="glass-card overflow-x-auto p-4">
        {loading && <p className="mb-2 text-slate-400">Loading expenses...</p>}
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-400"><th>Title</th><th>Date</th><th>Category</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id} className="border-t border-slate-800">
                <td className="py-2">{x.title}</td><td>{x.spent_on}</td><td>{x.category}</td><td>${x.amount.toFixed(2)}</td>
                <td className="space-x-3">
                  <button onClick={() => setEditing(x)} className="text-sky-400">Edit</button>
                  <button onClick={() => remove(x.id)} className="text-rose-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <p>Total: {meta.total}</p>
          <div className="space-x-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40">Prev</button>
            <span>Page {page} / {meta.pages || 1}</span>
            <button disabled={page >= (meta.pages || 1)} onClick={() => setPage((p) => p + 1)} className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-4">
          <form onSubmit={saveEdit} className="glass-card w-full max-w-xl space-y-3 p-5">
            <h2 className="text-xl font-semibold">Edit Expense</h2>
            <input className="w-full rounded-lg bg-slate-800 p-3" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <input className="w-full rounded-lg bg-slate-800 p-3" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: e.target.value })} />
            <input type="date" className="w-full rounded-lg bg-slate-800 p-3" value={editing.spent_on} onChange={(e) => setEditing({ ...editing, spent_on: e.target.value })} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-700 px-4 py-2">Cancel</button>
              <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-slate-950">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
