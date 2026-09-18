"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthLoginScreen } from "@/components/auth/login-screen";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage() {
  const { authenticated } = useAuth();
  const router = useRouter();
  React.useEffect(() => { if (authenticated) router.replace("/5s"); }, [authenticated, router]);
  return authenticated ? <div className="min-h-screen bg-muted/35 dark:bg-[#15171c]" aria-label="Opening dashboard" /> : <AuthLoginScreen />;
}
