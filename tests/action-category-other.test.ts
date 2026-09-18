import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  getActionCategoryDisplay,
  getCustomActionCategory,
  isActionCategoryValid,
} from "@/lib/five-s/action-category";
import { FIVE_S_ACTION_CATEGORIES } from "@/lib/five-s/configuration";

describe("Action Category Other support", () => {
  it("preserves the predefined categories and places Other last", () => {
    expect(FIVE_S_ACTION_CATEGORIES.slice(0, -1)).toEqual([
      "Organization & Layout",
      "Cleanliness & Hygiene",
      "Standardization Lapses",
      "Equipment Maintenance",
      "Resource Management",
      "Training & Knowledge Gaps",
      "Environmental Sustainability",
      "Customer Satisfaction",
    ]);
    expect(FIVE_S_ACTION_CATEGORIES.at(-1)).toBe("Other");
  });

  it("requires meaningful custom text only for Other", () => {
    expect(isActionCategoryValid("Other", "")).toBe(false);
    expect(isActionCategoryValid("Other", "   ")).toBe(false);
    expect(isActionCategoryValid("Other", " Machine Guarding ")).toBe(true);
    expect(isActionCategoryValid("Cleanliness & Hygiene", "")).toBe(true);
  });

  it("trims custom values and ignores them for predefined categories", () => {
    expect(getCustomActionCategory("Other", " Machine Guarding ")).toBe("Machine Guarding");
    expect(getCustomActionCategory("Other", "   ")).toBeUndefined();
    expect(getCustomActionCategory("Cleanliness & Hygiene", "Machine Guarding")).toBeUndefined();
  });

  it("renders custom and legacy categories meaningfully", () => {
    expect(getActionCategoryDisplay({ actionCategory: "Other", customActionCategory: "Machine Guarding" })).toBe("Machine Guarding");
    expect(getActionCategoryDisplay({ actionCategory: "Cleanliness & Hygiene" })).toBe("Cleanliness & Hygiene");
    expect(getActionCategoryDisplay({})).toBe("—");
  });

  it("keeps the conditional field inline, required, labelled, and submission-blocking", () => {
    const source = readFileSync(resolve(process.cwd(), "features/five-s/components/FiveSAuditExecution.tsx"), "utf8");
    expect(source).toContain('state.actionCategory === "Other"');
    expect(source).toContain("Specify Action Category<RequiredMark />");
    expect(source).toContain('placeholder="Enter action category"');
    expect(source).toContain('htmlFor="action-category"');
    expect(source).toContain("Enter an action category.");
    expect(source.match(/isActionCategoryValid\(state\.actionCategory, state\.customActionCategory\)/g)).toHaveLength(2);
  });

  it("uses the display helper in detail, reports, export, and searchable action surfaces", () => {
    const paths = [
      "features/five-s/action-detail-page.tsx",
      "features/five-s/action-report-page.tsx",
      "features/five-s/components/FiveSAuditReport.tsx",
      "features/five-s/dashboard-page.tsx",
      "features/five-s/actions-page.tsx",
      "lib/five-s/dashboard-action-filters.ts",
    ];
    for (const path of paths) {
      expect(readFileSync(resolve(process.cwd(), path), "utf8"), path).toContain("getActionCategoryDisplay");
    }
  });
});
