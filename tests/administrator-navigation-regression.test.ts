import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { hasPermission } from "@/features/five-s/administration/permissions";
import type { AdminUser } from "@/features/five-s/administration/types";
import { MAIN_NAV, isNavGroup } from "@/lib/navigation";

const read = (path: string) => readFileSync(resolve(path), "utf8");
const administrationEntry = MAIN_NAV.find(isNavGroup)?.children.find((item) => item.href === "/administration/users");

describe("Administrator navigation regression", () => {
  it("keeps one permission-protected Administration destination", () => {
    const entries = MAIN_NAV.find(isNavGroup)?.children.filter((item) => item.href === "/administration/users") ?? [];
    expect(entries).toHaveLength(1);
    expect(administrationEntry).toMatchObject({ label: "Administration", requiredPermission: "administration.view" });
  });

  it("shows Administration only when the existing permission allows it", () => {
    const admin = { permissions: ["administration.view"] } satisfies Pick<AdminUser, "permissions">;
    const member = { permissions: [] } satisfies Pick<AdminUser, "permissions">;
    expect(hasPermission(admin, administrationEntry!.requiredPermission!)).toBe(true);
    expect(hasPermission(member, administrationEntry!.requiredPermission!)).toBe(false);
  });

  it("shows Administration directly in ProductNav without a More menu", () => {
    const productNav = read("components/navigation/product-nav.tsx");
    expect(productNav).toContain('const secondaryItems = items.filter((item) => !item.href.startsWith("/5s"))');
    expect(productNav).toContain("secondaryItems.map((item) =>");
    expect(productNav).not.toContain("MoreHorizontal");
    expect(productNav).not.toContain("DropdownMenu");
  });

  it("keeps desktop Sidebar and mobile drawer on the same permission-filtered navigation", () => {
    const sidebar = read("components/navigation/sidebar-nav.tsx");
    const drawer = read("components/navigation/mobile-nav-drawer.tsx");
    expect(sidebar).toContain("hasPermission(adminUser,item.requiredPermission)");
    expect(drawer).toContain("<SidebarNav onNavigate={() => setOpen(false)} />");
  });

  it("keeps direct-route protection and Audit Configuration ownership separate", () => {
    const administration = read("features/five-s/administration/users-page.tsx");
    const auditList = read("features/five-s/components/FiveSAuditList.tsx");
    expect(administration).toContain('hasPermission(admin,"administration.view")');
    expect(administration).toContain("Administration access required");
    expect(auditList).toContain('router.push("/5s/audits/configuration")');
    expect(administration).not.toContain("/5s/audits/configuration");
  });
});
