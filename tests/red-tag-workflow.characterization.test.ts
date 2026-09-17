import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("Red Tag closure workflow", () => {
  const types = read("features/five-s/red-tag/types.ts");
  const store = read("features/five-s/red-tag/store.ts");
  const page = read("features/five-s/red-tag/red-tag-module.tsx");

  it("supports the required lifecycle without a direct Open to Closed transition", () => {
    for (const status of ["Open", "Assigned", "In Progress", "Awaiting Review", "Rework Required", "Closed"]) {
      expect(types).toContain(`\"${status}\"`);
    }
    expect(store).toContain('tag.status !== "Awaiting Review"');
    expect(store).toContain("!tag.actionPlan || !tag.responsiblePersonId || !tag.closureImageUrl || !tag.submittedAt");
  });

  it("keeps assignment and closure approval with the configured Zone Leader", () => {
    expect(store).toContain("zoneLeader(tag, actor)");
    expect(store).toContain('reviewedByRole: "Zone Leader"');
    expect(store).toContain('closedByRole: "Zone Leader"');
  });

  it("links one canonical action by Red Tag source metadata", () => {
    expect(store).toContain('action.sourceModule === "Red Tag" && action.sourceId === tag.id');
    expect(store).toContain('source: "Red Tag", sourceModule: "Red Tag", sourceId: tag.id');
    expect(types).toContain("actionId?: string");
  });

  it("reuses guided Before/After capture and exposes both review outcomes", () => {
    expect(page).toContain("<AfterPhotoCaptureDialog");
    expect(page).toContain("Return for Rework");
    expect(page).toContain("Approve & Close");
    expect(page).toContain("Submit for Review");
  });

  it("normalizes legacy Resolved records and tolerates missing history", () => {
    expect(store).toContain('(tag.status as string) === "Resolved" ? "Awaiting Review"');
    expect(store).toContain("Array.isArray(tag.history) ? tag.history : []");
  });
});
