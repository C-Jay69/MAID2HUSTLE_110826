import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type User } from "./api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("m2h_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("m2h_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem("m2h_token", token);
    setUser(user);
    return user;
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: string }) => {
    const { token, user } = await api.register(data);
    localStorage.setItem("m2h_token", token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("m2h_token");
    setUser(null);
  };

  const refresh = async () => {
    const token = localStorage.getItem("m2h_token");
    if (!token) return;
    try {
      setUser(await api.me());
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}