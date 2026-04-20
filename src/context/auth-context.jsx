import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "artcraft_user";
const ACCOUNTS_KEY = "artcraft_accounts";
const AuthContext = createContext(null);

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(STORAGE_KEY, null));

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async (email, password) => {
    const accounts = readJson(ACCOUNTS_KEY, []);
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account) return { success: false, error: "Пользователь с таким email не найден" };
    if (account.password !== password) return { success: false, error: "Неверный пароль" };
    setUser({
      id: btoa(email),
      name: account.name,
      email: account.email,
      joinDate: new Date().toISOString(),
    });
    return { success: true };
  };

  const register = async (name, email, password) => {
    const accounts = readJson(ACCOUNTS_KEY, []);
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Пользователь с таким email уже зарегистрирован" };
    }
    accounts.push({ name, email, password });
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    setUser({ id: btoa(email), name, email, joinDate: new Date().toISOString() });
    return { success: true };
  };

  const resetPassword = async (email) => {
    const accounts = readJson(ACCOUNTS_KEY, []);
    if (!accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Пользователь с таким email не найден" };
    }
    return { success: true };
  };

  const updateProfile = (data) => setUser((prev) => (prev ? { ...prev, ...data } : prev));
  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, resetPassword, updateProfile, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

