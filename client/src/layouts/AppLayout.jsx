import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-800" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded bg-slate-800" />
          <div className="h-28 animate-pulse rounded bg-slate-800" />
          <div className="h-28 animate-pulse rounded bg-slate-800" />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex bg-slate-950 text-slate-100">
      <Sidebar onLogout={logout} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
