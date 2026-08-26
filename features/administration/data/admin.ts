import {
  Users,
  ShieldCheck,
  Factory,
  Building2,
  ClipboardList,
  Bell,
  Database,
  Settings,
} from "lucide-react";

import { AdminModule } from "../types/admin";

export const adminModules: AdminModule[] = [
  {
    id: "users",
    title: "User Management",
    description:
      "Create, edit and manage user accounts across the organization.",
    href: "/administration/users",
    icon: Users,
  },
  {
    id: "roles",
    title: "Roles & Permissions",
    description:
      "Control access levels and permissions for every user role.",
    href: "/administration/roles",
    icon: ShieldCheck,
  },
  {
    id: "plants",
    title: "Plant Management",
    description:
      "Manage manufacturing plants and their operational information.",
    href: "/administration/plants",
    icon: Factory,
  },
  {
    id: "departments",
    title: "Department Management",
    description:
      "Configure departments and assign organizational ownership.",
    href: "/administration/departments",
    icon: Building2,
  },
  {
    id: "audit-templates",
    title: "Audit Templates",
    description:
      "Create reusable audit templates for different manufacturing processes.",
    href: "/administration/audit-templates",
    icon: ClipboardList,
  },
  {
    id: "notifications",
    title: "Notification Rules",
    description:
      "Configure email alerts, reminders and escalation workflows.",
    href: "/administration/notifications",
    icon: Bell,
  },
  {
    id: "master-data",
    title: "Master Data",
    description:
      "Manage defect categories, severity levels and lookup values.",
    href: "/administration/master-data",
    icon: Database,
  },
  {
    id: "settings",
    title: "System Settings",
    description:
      "Configure global application preferences and system behavior.",
    href: "/administration/settings",
    icon: Settings,
  },
];