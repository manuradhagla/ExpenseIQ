import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <section id="home" className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold leading-tight">Take Control of Your Money with Smart Expense Tracking</h1>
          <p className="mt-5 text-lg text-slate-300">ExpenseIQ helps you track spending, manage budgets, and detect unusual patterns with intelligent visual analytics.</p>
          <div className="mt-8 flex gap-4">
            <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-slate-950">Get Started</Link>
            <Link to="/app/dashboard" className="rounded-xl border border-slate-700 px-6 py-3">View Demo</Link>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold">Dashboard Preview</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-800 p-3">Monthly Expense: $1,240</div>
            <div className="rounded-lg bg-slate-800 p-3">Savings: $760</div>
            <div className="rounded-lg bg-slate-800 p-3">Budget Use: 78%</div>
            <div className="rounded-lg bg-slate-800 p-3">Alerts: 2 Active</div>
          </div>
        </div>
      </section>
      <section id="features" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">Features</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {["Expense Tracking", "Budget Planning", "Spending Analytics", "Threshold Alerts", "Category Management", "Trend Analysis", "Secure Login", "Export Reports"].map((f) => (
            <div key={f} className="glass-card p-4">{f}</div>
          ))}
        </div>
      </section>
      <section id="about" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">Why Choose ExpenseIQ</h2>
        <p className="mt-4 text-slate-300">Built as a modern fintech SaaS platform for students, professionals, and families who need insights beyond spreadsheets.</p>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">Testimonials</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            '"ExpenseIQ replaced my monthly spreadsheet chaos with clean insights." - Product Analyst',
            '"Budget alerts helped me reduce overspending in two months." - Software Engineer',
            '"The dashboard makes personal finance planning super practical." - MBA Student',
          ].map((t) => <div key={t} className="glass-card p-4 text-slate-300">{t}</div>)}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">Pricing</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Basic - Free", "Pro - $9/mo", "Enterprise - Custom"].map((p) => <div key={p} className="glass-card p-4">{p}</div>)}
        </div>
      </section>
      <section id="contact" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">Contact</h2>
        <form className="mt-6 grid gap-3 md:max-w-xl">
          <input className="rounded-lg bg-slate-800 p-3" placeholder="Name" />
          <input className="rounded-lg bg-slate-800 p-3" placeholder="Email" />
          <textarea className="rounded-lg bg-slate-800 p-3" placeholder="Message" rows={4} />
          <button className="rounded-lg bg-brand-600 px-4 py-3 font-semibold text-slate-950">Submit</button>
        </form>
      </section>
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-slate-400">
        <p>ExpenseIQ - Smart visual finance tracking for modern users.</p>
        <p className="mt-2">Quick Links: Home | Features | Dashboard | About | Contact</p>
      </footer>
    </div>
  );
}
