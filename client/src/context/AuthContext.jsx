import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(payload) {
    const { data } = await api.post("/api/auth/login", payload);
    localStorage.setItem("expenseiq_token", data.token);
    setUser(data.user);
  }

  async function register(payload) {
    await api.post("/api/auth/register", payload);
  }

  async function logout() {
    await api.post("/api/auth/logout");
    localStorage.removeItem("expenseiq_token");
    setUser(null);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
