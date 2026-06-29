import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", monthly_income: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ ...form, monthly_income: Number(form.monthly_income || 0) });
      setMessage("Account created. Please log in.");
      pushToast("Registration successful.", "success");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      pushToast("Registration failed.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form onSubmit={submit} className="glass-card w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-slate-100">Register</h1>
        {error && <p className="mt-3 text-rose-400">{error}</p>}
        {message && <p className="mt-3 text-emerald-400">{message}</p>}
        <input className="mt-4 w-full rounded-lg bg-slate-800 p-3" placeholder="Full Name" onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input className="mt-3 w-full rounded-lg bg-slate-800 p-3" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="mt-3 w-full rounded-lg bg-slate-800 p-3" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="mt-3 w-full rounded-lg bg-slate-800 p-3" placeholder="Monthly Income" onChange={(e) => setForm({ ...form, monthly_income: e.target.value })} />
        <button disabled={submitting} className="mt-4 w-full rounded-lg bg-brand-600 p-3 font-semibold text-slate-950 disabled:opacity-60">
          {submitting ? "Creating..." : "Create Account"}
        </button>
        <p className="mt-3 text-sm text-slate-400">Have an account? <Link className="text-brand-500" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
