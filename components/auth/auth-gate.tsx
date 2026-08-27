"use client";

import * as React from "react";
import { AuthLoginScreen } from "./login-screen";
import { useAuth } from "./auth-provider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { authenticated, authReady } = useAuth();
  if (!authReady) return <div className="min-h-screen bg-muted/35 dark:bg-[#15171c]" aria-label="Loading 5S Management" />;
  return authenticated ? children : <AuthLoginScreen />;
}
