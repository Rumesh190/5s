import type { LucideIcon } from "lucide-react";

import {
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  Flag,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import type { PermissionCode } from "@/features/five-s/administration/types";

export interface NavLeaf {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: PermissionCode;
}

export interface NavGroup extends NavLeaf {
  children: NavLeaf[];
}

export type NavEntry = NavLeaf | NavGroup;

export function isNavGroup(
  entry: NavEntry
): entry is NavGroup {
  return (
    "children" in entry &&
    Array.isArray(entry.children)
  );
}

/* =========================================================
   MAIN NAVIGATION
   ========================================================= */

export const MAIN_NAV: NavEntry[] = [
  {
    label: "5S",
    href: "/5s",
    icon: ClipboardCheck,

    children: [
      {
        label: "Dashboard",
        href: "/5s",
        icon: LayoutDashboard,
      },

      {
        label: "Audits",
        href: "/5s/audits",
        icon: ClipboardList,
      },

      {
        label: "Actions",
        href: "/5s/actions",
        icon: ListTodo,
      },

      {
        label: "Reports",
        href: "/5s/reports",
        icon: BarChart3,
      },

      {
        label: "Continuous Improvement",
        href: "/5s/continuous-improvement",
        icon: TrendingUp,
      },

      {
        label: "Red Tag",
        href: "/5s/red",
        icon: Flag,
      },
      {
        label: "Administration",
        href: "/administration/users",
        icon: ShieldCheck,
        requiredPermission: "administration.view",
      },
    ],
  },
];

/* =========================================================
   ROUTE LABELS
   ========================================================= */

export const ROUTE_LABELS: Record<
  string,
  string
> = {
  "/5s": "Dashboard",
  "/5s/audits": "Audits",
  "/5s/listing": "Audits",
  "/5s/actions": "Actions",
  "/5s/reports": "Reports",
  "/5s/continuous-improvement": "Continuous Improvement",
  "/5s/red": "Red Tag",
  "/administration/users": "Users & Access",

  /*
   * Keep Profile temporarily because the shared
   * user menu may still link to it.
   */
  "/profile": "Profile Settings",
};

/* =========================================================
   ACTIVE ROUTE
   ========================================================= */

export function isNavItemActive(
  pathname: string,
  href: string
): boolean {
  /*
   * 5S dashboard should use exact matching.
   *
   * This prevents /5s from appearing active
   * at the same time as /5s/audits,
   * /5s/actions, etc.
   */
  if (href === "/5s") {
    return pathname === href;
  }

  /*
   * Nested routes.
   *
   * Example:
   *
   * /5s/actions
   * /5s/actions/123
   *
   * Both activate Actions.
   */
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}
