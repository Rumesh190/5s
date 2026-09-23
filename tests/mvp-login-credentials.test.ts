import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { validateMvpCredentials } from "@/lib/auth/mvp-credentials";

describe("temporary MVP login credentials", () => {
  it("accepts the configured Admin login", () => {
    expect(validateMvpCredentials("admin", "unicorn")).toBe(true);
  });

  it("rejects the previous password", () => {
    expect(validateMvpCredentials("admin", "admin")).toBe(false);
  });

  it("rejects the correct password for a different username", () => {
    expect(validateMvpCredentials("wrong-user", "unicorn")).toBe(false);
  });

  it("does not disclose credentials on the Login screen", () => {
    const loginScreen = fs.readFileSync(path.join(process.cwd(), "components/auth/login-screen.tsx"), "utf8");
    expect(loginScreen).not.toContain("admin / admin");
    expect(loginScreen).not.toContain("unicorn");
  });
});
