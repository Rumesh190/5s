"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { authenticated, authReady } = useAuth();
  const router = useRouter();
  React.useEffect(() => { if (authReady && !authenticated) router.replace("/login"); }, [authReady, authenticated, router]);
  if (!authReady) return <div className="min-h-screen bg-muted/35 dark:bg-[#15171c]" aria-label="Loading 5S Management" />;
  return authenticated ? children : <div className="min-h-screen bg-muted/35 dark:bg-[#15171c]" aria-label="Returning to login" />;
}
