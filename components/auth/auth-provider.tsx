"use client";

import * as React from "react";
import { safeSetStorage } from "@/lib/browser-storage";

const AUTH_KEY = "5s-auth-session";
interface DemoAuthSession { authenticated: true; username: "admin"; version: 1 }
interface AuthContextValue { authenticated: boolean; authReady: boolean; login: (username: string, password: string) => Promise<boolean>; logout: () => void }
const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = React.useState(false); const [authReady, setAuthReady] = React.useState(false);
  React.useEffect(() => { try { const value = JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null") as Partial<DemoAuthSession> | null; setAuthenticated(value?.authenticated === true && value.username === "admin" && value.version === 1); } catch { setAuthenticated(false); } finally { setAuthReady(true); } }, []);
  const login = React.useCallback(async (username: string, password: string) => { await new Promise((resolve) => window.setTimeout(resolve, 280)); if (username !== "admin" || password !== "admin") return false; const result = safeSetStorage(AUTH_KEY, { authenticated: true, username: "admin", version: 1 } satisfies DemoAuthSession); if (!result.success) return false; setAuthenticated(true); return true; }, []);
  const logout = React.useCallback(() => { localStorage.removeItem(AUTH_KEY); setAuthenticated(false); }, []);
  const value = React.useMemo(() => ({ authenticated, authReady, login, logout }), [authenticated, authReady, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = React.useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
