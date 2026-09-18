import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("Audit Configuration navigation ownership", () => {
  it("places an accessible Admin-only configuration action beside the independent Refresh action", () => {
    const source = read("features/five-s/components/FiveSAuditList.tsx");
    expect(source).toContain('aria-label="Restore demo data"');
    expect(source).toContain("handleRestoreDemoData");
    expect(source).toContain("canManageQuestions && <Tooltip>");
    expect(source).toContain('aria-label="5S Question Configuration"');
    expect(source).toContain("<TooltipContent>5S Question Configuration</TooltipContent>");
    expect(source).toContain('router.push("/5s/audits/configuration")');
    expect(source.indexOf('aria-label="Restore demo data"')).toBeLessThan(source.indexOf('aria-label="5S Question Configuration"'));
  });

  it("uses the existing permission and Admin role for visibility", () => {
    const source = read("features/five-s/components/FiveSAuditList.tsx");
    expect(source).toContain('adminUser.roles.includes("Admin")');
    expect(source).toContain('hasPermission(adminUser, "administration.manage_questions")');
  });

  it("reuses the existing configuration page at its Audit-owned route", () => {
    const route = read("app/(app)/5s/audits/configuration/page.tsx");
    const page = read("features/five-s/question-configuration/questions-page.tsx");
    expect(route).toContain('import FiveSQuestionsPage from "@/features/five-s/question-configuration/questions-page"');
    expect(page).toContain('eyebrow="Audit / Audit Configuration"');
    expect(page).toContain('title="Audit Configuration"');
    expect(page).toContain('router.push("/5s/audits")');
    expect(page).toContain("if (!canManage)");
  });

  it("removes the Settings menu entry and redirects the legacy URL", () => {
    const menu = read("components/navigation/user-menu.tsx");
    const legacyRoute = read("app/(app)/settings/audit-configuration/questions/page.tsx");
    expect(menu).not.toContain("Audit Configuration");
    expect(menu).not.toContain("/settings/audit-configuration/questions");
    expect(legacyRoute).toContain('redirect("/5s/audits/configuration")');
  });
});
