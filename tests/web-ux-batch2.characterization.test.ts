import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Web UX batch 2 characterization", () => {
  it("keeps every operational module directly available in ProductNav", async () => {
    const source = await readFile("components/navigation/product-nav.tsx", "utf8");
    expect(source).toContain('item.href.startsWith("/5s")');
    expect(source).not.toContain("items.slice(0, 4)");
  });

  it("persists the sidebar collapsed state through the UI preference boundary", async () => {
    const preferences = await readFile("lib/ui-preferences.ts", "utf8");
    const shell = await readFile("components/layout/app-shell.tsx", "utf8");
    expect(preferences).toContain("sidebarCollapsed: boolean");
    expect(shell).toContain("useUiPreferences()");
  });

  it("explains that question deactivation preserves audit snapshots", async () => {
    const source = await readFile("features/five-s/question-configuration/questions-page.tsx", "utf8");
    expect(source).toContain("will no longer appear in new audits");
    expect(source).toContain("audit snapshots remain unchanged");
  });
});
