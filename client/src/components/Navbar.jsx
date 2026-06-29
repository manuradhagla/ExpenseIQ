import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-slate-200">
        <Link to="/" className="text-xl font-bold text-brand-500">
          ExpenseIQ
        </Link>
        <div className="hidden gap-6 md:flex">
          {["Home", "Features", "Dashboard", "About", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-brand-500">
              {item}
            </a>
          ))}
        </div>
        <div className="flex gap-3">
          <Link className="rounded-lg border border-slate-700 px-4 py-2" to="/login">
            Login
          </Link>
          <Link className="rounded-lg bg-brand-600 px-4 py-2 text-slate-950 font-semibold" to="/register">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
