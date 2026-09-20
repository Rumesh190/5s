import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { getAuditCompletionRate } from "@/features/five-s/components/DesktopDashboardOverview";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

describe("desktop Dashboard overview", () => {
  const overview = read("features/five-s/components/DesktopDashboardOverview.tsx");
  const dashboard = read("features/five-s/dashboard-page.tsx");

  it("calculates completion rate safely", () => {
    expect(getAuditCompletionRate(48, 39)).toBe(81);
    expect(getAuditCompletionRate(0, 0)).toBe(0);
  });

  it("renders the approved KPI and analytics structure", () => {
    for (const copy of ["Total Audits", "Completed Audits", "Draft Audits", "In Progress", "Avg. Audit Score", "Action Summary", "Audit Performance", "5S Performance by Zone", "Attention Required"]) expect(overview).toContain(copy);
  });

  it("uses configured zones and never introduces Zone E", () => {
    expect(overview).toContain("FIVE_S_ZONE_CONFIGURATION");
    expect(overview).not.toContain("Zone E");
    expect(FIVE_S_ZONE_CONFIGURATION.map((zone) => zone.name)).not.toContain("Zone E");
  });

  it("keeps the purpose-built mobile Dashboard and shared metrics", () => {
    expect(dashboard).toContain('<MobileDashboard');
    expect(dashboard).toContain('className="md:hidden"');
    expect(dashboard).toContain('<DesktopDashboardOverview metrics={metrics}');
  });

  it("preserves all three Dashboard views and shared filters", () => {
    expect(dashboard).toContain('["overview", t("dashboard.overview")]');
    expect(dashboard).toContain('["nc-summary", t("dashboard.ncSummary")]');
    expect(dashboard).toContain('["before-after", t("dashboard.beforeAfter")]');
    expect(dashboard).toContain('setZoneMemberFilter("All")');
    expect(dashboard).toContain('period === "custom"');
  });

  it("keeps Action navigation on the existing route", () => {
    expect(dashboard).toContain('router.push(`/5s/actions/${encodeURIComponent(action.id)}`)');
    expect(overview).toContain("onOpenAction(action)");
  });
});
