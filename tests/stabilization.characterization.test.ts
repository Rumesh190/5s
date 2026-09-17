import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { ROLE_PRESETS } from "@/features/five-s/administration/permissions";
import { DEMO_STORAGE_KEYS, readStorageJson, resetStandaloneFiveSDemo } from "@/lib/browser-storage";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("stabilized architecture", () => {
  it("keeps corrective-action review and closure out of the Auditor preset", () => {
    expect(ROLE_PRESETS.Auditor).not.toContain("actions.review");
    expect(ROLE_PRESETS.Auditor).not.toContain("actions.close");
    expect(ROLE_PRESETS["Zone Leader"]).toEqual(expect.arrayContaining(["actions.review", "actions.close"]));
  });

  it("has one canonical corrective-action type and review status", () => {
    expect(read("features/five-s/types/five-s.ts")).not.toContain("interface FiveSAction");
    expect(read("features/five-s/types/my-actions.ts")).not.toContain('"Pending Auditor Review"');
    expect(read("features/five-s/types/my-actions.ts")).toContain('"Awaiting Review"');
  });

  it("reads typed browser records through the persistence boundary", () => {
    const localStorage = { getItem: vi.fn(() => '{"id":"A"}'), removeItem: vi.fn(), setItem: vi.fn() };
    vi.stubGlobal("window", { localStorage, location: { reload: vi.fn() } });
    expect(readStorageJson<{ id: string }>("record")).toEqual({ id: "A" });
  });

  it("clears all registered domain keys during demo reset", () => {
    const localStorage = { getItem: vi.fn(() => null), removeItem: vi.fn(), setItem: vi.fn() };
    const reload = vi.fn();
    vi.stubGlobal("window", { localStorage, location: { reload } });
    expect(resetStandaloneFiveSDemo()).toBe(true);
    for (const key of DEMO_STORAGE_KEYS) expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    expect(reload).toHaveBeenCalledOnce();
  });

  it("keeps the AI guide concise and names the critical ownership rule", () => {
    const guide = read("AGENTS.md");
    expect(guide.split("\n").length).toBeLessThanOrEqual(350);
    expect(guide).toContain("AUDITOR DOES NOT REVIEW OR CLOSE CORRECTIVE ACTIONS");
    expect(guide).toContain("ZONE LEADER REVIEWS AND CLOSES CORRECTIVE ACTIONS");
  });
});
