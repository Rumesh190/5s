import {
  BarChart3,
  ClipboardCheck,
  Factory,
  Building2,
  ShieldCheck,
} from "lucide-react";

import { ReportItem } from "../types/reports";

export const reports: ReportItem[] = [
  {
    id: "audit-performance",
    title: "Audit Performance",
    description:
      "Monitor audit completion, overdue audits and compliance trends across manufacturing plants.",
    href: "/reports/audit-performance",
    icon: BarChart3,
  },
  {
    id: "investigation-performance",
    title: "Investigation Performance",
    description:
      "Analyze investigations, root causes and average resolution time.",
    href: "/reports/investigation-performance",
    icon: ClipboardCheck,
  },
  {
    id: "plant-performance",
    title: "Plant Performance",
    description:
      "Compare quality metrics and audit scores across all manufacturing plants.",
    href: "/reports/plant-performance",
    icon: Factory,
  },
  {
    id: "department-performance",
    title: "Department Performance",
    description:
      "Measure department-wise quality performance and audit statistics.",
    href: "/reports/department-performance",
    icon: Building2,
  },
  {
    id: "compliance-summary",
    title: "Compliance Summary",
    description:
      "View organization-wide compliance score and quality health indicators.",
    href: "/reports/compliance-summary",
    icon: ShieldCheck,
  },
];