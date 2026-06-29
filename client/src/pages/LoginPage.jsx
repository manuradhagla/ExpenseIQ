import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      pushToast("Welcome back!", "success");
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      pushToast("Login failed. Check credentials.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form onSubmit={submit} className="glass-card w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-slate-100">Login</h1>
        {error && <p className="mt-3 text-rose-400">{error}</p>}
        <input className="mt-4 w-full rounded-lg bg-slate-800 p-3" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="mt-3 w-full rounded-lg bg-slate-800 p-3" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={submitting} className="mt-4 w-full rounded-lg bg-brand-600 p-3 font-semibold text-slate-950 disabled:opacity-60">
          {submitting ? "Logging in..." : "Login"}
        </button>
        <p className="mt-3 text-sm text-slate-400">No account? <Link className="text-brand-500" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
