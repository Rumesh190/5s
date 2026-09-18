import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";
import { getRedTagDisplayStatus } from "@/features/five-s/red-tag/types";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("Red Tag closure workflow", () => {
  const types = read("features/five-s/red-tag/types.ts");
  const store = read("features/five-s/red-tag/store.ts");
  const page = read("features/five-s/red-tag/red-tag-module.tsx");

  it("uses the direct-assignment lifecycle without a direct Raised to Closed transition", () => {
    expect(getRedTagDisplayStatus("Open")).toBe("Raised");
    expect(getRedTagDisplayStatus("Assigned")).toBe("In Progress");
    for (const status of ["Raised", "In Progress", "Awaiting Review", "Rework Required", "Closed"]) expect(page).toContain(`\"${status}\"`);
    expect(store).toContain('status: "In Progress", priority: input.priority');
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

  it("combines Action Plan and member assignment without a second start action", () => {
    expect(page).toContain("Assign Action");
    expect(page).toContain('placeholder="Select Zone Member"');
    expect(page).not.toContain("Start Action");
    expect(store).toContain('event("planned", `Action Plan Assigned to ${member.name}`');
    expect(store).toContain("recipientUserId: member.id");
  });

  it("retains the responsible member through rework", () => {
    expect(store).toContain('status: "Rework Required", reviewComment: remark');
    expect(store).not.toContain('status: "Awaiting Assignment", reviewComment: remark');
    expect(store).toContain("recipientUserId: tag.responsiblePersonId");
  });

  it("normalizes legacy Resolved records and tolerates missing history", () => {
    expect(store).toContain('legacyStatus === "Resolved"');
    expect(store).toContain('legacyStatus === "Awaiting Assignment"');
    expect(types).toContain('status === "Assigned"');
    expect(store).toContain("Array.isArray(tag.history) ? tag.history : []");
  });
});
