import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/api/axios";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  sport?: string;
  city?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("sportzzbook_token");
    const storedUser = localStorage.getItem("sportzzbook_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("sportzzbook_token", res.data.token);
    localStorage.setItem("sportzzbook_user", JSON.stringify(res.data.user));
  }

  async function register(data: any) {
    const res = await api.post("/auth/register", data);
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("sportzzbook_token", res.data.token);
    localStorage.setItem("sportzzbook_user", JSON.stringify(res.data.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sportzzbook_token");
    localStorage.removeItem("sportzzbook_user");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}