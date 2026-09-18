import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "features/five-s/dashboard-page.tsx"), "utf8");

describe("Non-Compliance custom export selection", () => {
  it("uses one stable-ID selection state for desktop rows and mobile cards", () => {
    expect(source).toContain("const [selectedIds,setSelectedIds]=useState<string[]>([])");
    expect(source).toContain("selectedIds.includes(action.id)");
    expect(source.match(/aria-label={`Select Non-Compliance \$\{action\.id\}`}/g)).toHaveLength(2);
    expect(source).toContain('className="grid size-11 shrink-0 place-items-center"');
  });

  it("provides filtered master selection and an indeterminate state", () => {
    expect(source).toContain("toggleAllVisibleActionIds(current,filteredActions)");
    expect(source.match(/indeterminate={someSelected}/g)).toHaveLength(2);
    expect(source.match(/aria-label="Select all Non-Compliance records"/g)).toHaveLength(2);
    expect(source).toContain("setSelectedIds((current)=>reconcileSelectedActionIds(current,filteredActions))");
  });

  it("disables zero-selection export and directly exports selected rows", () => {
    expect((source.match(/disabled={!selectedCount}/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(source).toContain("selectActionsByIds(filteredActions,selectedIds)");
    expect(source).toContain("exportNonComplianceCsv(selected)");
    expect(source).not.toContain("ExportNCSummaryDialog");
  });
});
