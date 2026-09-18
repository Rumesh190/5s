import { describe, expect, it } from "vitest";
import { getSessionActivityState, hiddenSessionHasExpired, SESSION_INACTIVITY_MS, SESSION_WARNING_MS } from "@/lib/auth/session-policy";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("MVP runtime session policy", () => {
  it("centralizes the ten-minute timeout and one-minute warning", () => {
    expect(SESSION_INACTIVITY_MS).toBe(10 * 60 * 1000);
    expect(SESSION_WARNING_MS).toBe(9 * 60 * 1000);
  });

  it("warns and expires visible inactivity at the configured thresholds", () => {
    expect(getSessionActivityState(1_000, 1_000 + SESSION_WARNING_MS - 1)).toBe("active");
    expect(getSessionActivityState(1_000, 1_000 + SESSION_WARNING_MS)).toBe("warning");
    expect(getSessionActivityState(1_000, 1_000 + SESSION_INACTIVITY_MS)).toBe("expired");
  });

  it("expires only after ten continuous hidden minutes", () => {
    expect(hiddenSessionHasExpired(1_000, 1_000 + SESSION_INACTIVITY_MS - 1)).toBe(false);
    expect(hiddenSessionHasExpired(1_000, 1_000 + SESSION_INACTIVITY_MS)).toBe(true);
    expect(hiddenSessionHasExpired(null, Number.MAX_SAFE_INTEGER)).toBe(false);
  });

  it("keeps authentication runtime-only and protects the app route group", () => {
    const provider = read("components/auth/auth-provider.tsx");
    const gate = read("components/auth/auth-gate.tsx");
    expect(provider).not.toContain("safeSetStorage(AUTH_KEY");
    expect(provider).not.toContain("sessionStorage");
    expect(provider).toContain('router.replace("/login")');
    expect(gate).toContain('router.replace("/login")');
    expect(read("app/(app)/layout.tsx")).toContain("<AuthGate>");
  });

  it("keeps Login public and redirects successful login to Dashboard", () => {
    expect(read("app/login/page.tsx")).toContain("<AuthLoginScreen />");
    expect(read("components/auth/auth-provider.tsx")).toContain('router.replace("/5s")');
  });

  it("preserves domain data and preferences when ending a session", () => {
    const provider = read("components/auth/auth-provider.tsx");
    expect(provider).not.toContain("localStorage.clear");
    expect(provider).not.toContain("resetStandaloneFiveSDemo");
    expect(provider).not.toContain("UI_PREFERENCES_STORAGE_KEY");
  });

  it("uses protected unmount cleanup for every live camera flow", () => {
    for (const file of [
      "features/five-s/components/OperationalPhotoCaptureDialog.tsx",
      "features/five-s/components/AfterPhotoCaptureDialog.tsx",
      "features/five-s/components/FinalAuditVerificationDialog.tsx",
    ]) {
      expect(read(file)).toContain("stopCamera()");
      expect(read(file)).toContain("return () =>");
    }
  });
});
