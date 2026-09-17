import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { AUDIT_SCORE_LABELS, getAuditScoreLabel } from "@/lib/five-s/audit-score";

const read = (path: string) => readFileSync(path, "utf8");

describe("web UX/UI batch 1", () => {
  it("uses one canonical set of audit score labels", () => {
    expect(AUDIT_SCORE_LABELS).toEqual({ 0: "Non-Compliant", 1: "Partially Compliant", 2: "Fully Compliant" });
    expect(getAuditScoreLabel(1)).toBe("Partially Compliant");
    const relevant = [read("features/five-s/components/FiveSAuditExecution.tsx"), read("features/five-s/components/FiveSAuditReport.tsx"), read("lib/i18n.ts")].join("\n");
    expect(relevant).not.toContain("Partially Compliance");
    expect(relevant).not.toContain("Fully Compliance");
  });

  it("exposes score selection as a mutually exclusive accessible group", () => {
    const source = read("features/five-s/components/FiveSAuditExecution.tsx");
    expect(source).toContain('role="radiogroup"');
    expect(source).toContain('role="radio"');
    expect(source).toContain("aria-checked={selected}");
  });

  it("ties dashboard sample disclosure to the actual fixture-selection condition", () => {
    const source = read("features/five-s/dashboard-page.tsx");
    expect(source).toContain("usingSampleData: useMvpDemo");
    expect(source).toContain('metrics.usingSampleData && <Badge variant="secondary">Showing sample data</Badge>');
  });

  it("provides zone restriction, question state, and verification guidance", () => {
    expect(read("features/five-s/components/FiveSAuditCreate.tsx")).toContain("You cannot audit this zone based on your current assignment.");
    const execution = read("features/five-s/components/FiveSAuditExecution.tsx");
    expect(execution).toContain('aria-label={state.score !== null ? "Answered" : "Not started"}');
    const verification = read("features/five-s/components/FinalAuditVerificationDialog.tsx");
    expect(verification).toContain("Capture your live photo and add your signature to continue.");
    expect(verification).not.toContain('aspect-[16/5]');
  });

  it("gives collapsed navigation links an explicit accessible name", () => {
    expect(read("components/navigation/sidebar-nav.tsx")).toContain("aria-label={collapsed ? label : undefined}");
  });
});
