"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateMvpCredentials } from "@/lib/auth/mvp-credentials";
import { getSessionActivityState, hiddenSessionHasExpired } from "@/lib/auth/session-policy";

const AUTH_KEY = "5s-auth-session";
export type SessionStatus = "unauthenticated" | "authenticated" | "expired";
interface AuthContextValue { authenticated: boolean; authReady: boolean; status: SessionStatus; login: (username: string, password: string) => Promise<boolean>; logout: () => void; staySignedIn: () => void }
const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = React.useState<SessionStatus>("unauthenticated");
  const [warningOpen, setWarningOpen] = React.useState(false);
  const lastActivityAtRef = React.useRef(0);
  const lastActivitySignalAtRef = React.useRef(0);
  const hiddenAtRef = React.useRef<number | null>(null);
  const statusRef = React.useRef<SessionStatus>("unauthenticated");
  const warningOpenRef = React.useRef(false);

  const updateStatus = React.useCallback((next: SessionStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  React.useEffect(() => {
    // Remove the legacy persistent demo session. Authentication is deliberately
    // runtime-only; product records and UI preferences use separate keys.
    try { window.localStorage.removeItem(AUTH_KEY); } catch { /* Storage availability must not control runtime authentication. */ }
  }, []);

  const endSession = React.useCallback((reason: "logout" | "expired") => {
    hiddenAtRef.current = null;
    warningOpenRef.current = false;
    setWarningOpen(false);
    updateStatus(reason === "expired" ? "expired" : "unauthenticated");
    router.replace("/login");
  }, [router, updateStatus]);

  const login = React.useCallback(async (username: string, password: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 280));
    if (!validateMvpCredentials(username, password)) return false;
    lastActivityAtRef.current = Date.now();
    hiddenAtRef.current = null;
    warningOpenRef.current = false;
    setWarningOpen(false);
    updateStatus("authenticated");
    router.replace("/5s");
    return true;
  }, [router, updateStatus]);

  const logout = React.useCallback(() => endSession("logout"), [endSession]);
  const staySignedIn = React.useCallback(() => {
    if (statusRef.current !== "authenticated" || document.visibilityState === "hidden") return;
    lastActivityAtRef.current = Date.now();
    warningOpenRef.current = false;
    setWarningOpen(false);
  }, []);

  React.useEffect(() => {
    if (status !== "authenticated") return;

    const expire = () => endSession("expired");
    const evaluateActiveInactivity = () => {
      if (document.visibilityState === "hidden" || statusRef.current !== "authenticated") return;
      const activityState = getSessionActivityState(lastActivityAtRef.current, Date.now());
      if (activityState === "expired") expire();
      else if (activityState === "warning" && !warningOpenRef.current) {
        warningOpenRef.current = true;
        setWarningOpen(true);
      }
    };
    const recordActivity = () => {
      if (document.visibilityState === "hidden" || warningOpenRef.current || statusRef.current !== "authenticated") return;
      const now = Date.now();
      if (now - lastActivitySignalAtRef.current < 1000) return;
      lastActivitySignalAtRef.current = now;
      lastActivityAtRef.current = now;
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAtRef.current = Date.now();
        return;
      }
      if (hiddenSessionHasExpired(hiddenAtRef.current, Date.now())) {
        expire();
        return;
      }
      hiddenAtRef.current = null;
      evaluateActiveInactivity();
    };

    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, recordActivity, { passive: true, capture: true }));
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = window.setInterval(evaluateActiveInactivity, 1000);
    evaluateActiveInactivity();
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity, { capture: true }));
    };
  }, [endSession, status]);

  React.useEffect(() => {
    if (status !== "authenticated" && pathname !== "/login") router.replace("/login");
  }, [pathname, router, status]);

  const authenticated = status === "authenticated";
  const value = React.useMemo(() => ({ authenticated, authReady: true, status, login, logout, staySignedIn }), [authenticated, login, logout, status, staySignedIn]);
  return <AuthContext.Provider value={value}>
    {children}
    <Dialog open={warningOpen} onOpenChange={() => undefined}>
      <DialogContent showCloseButton={false} className="sm:!max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expiring</DialogTitle>
          <DialogDescription>Your session will expire in 1 minute due to inactivity.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" className="min-h-11" onClick={logout}>Sign Out</Button>
          <Button type="button" className="min-h-11" onClick={staySignedIn}>Stay Signed In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </AuthContext.Provider>;
}

export function useAuth() { const context = React.useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
