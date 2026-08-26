import type {
  AuditStatus,
  DashboardAccent,
  IssueSeverity,
  PlantStatus,
} from "@/types/dashboard"

/**
 * Centralized color mapping for the Dashboard module. Keeping this in one
 * place (rather than repeating Tailwind color classes per component) is what
 * lets KpiCard, PlantCard, and the charts stay visually consistent and
 * avoids hardcoding the same color strings in multiple files.
 */
export const ACCENT_STYLES: Record<
  DashboardAccent,
  { icon: string; text: string; hex: string }
> = {
  blue: {
    icon: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
    hex: "#2563eb",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    hex: "#059669",
  },
  red: {
    icon: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    text: "text-red-600 dark:text-red-400",
    hex: "#dc2626",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    hex: "#d97706",
  },
}

export const PLANT_STATUS_STYLES: Record<
  PlantStatus,
  { label: string; dot: string; text: string }
> = {
  "on-track": {
    label: "On Track",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  "at-risk": {
    label: "At Risk",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  attention: {
    label: "Needs Attention",
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-400",
  },
}

export const SEVERITY_STYLES: Record<IssueSeverity, string> = {
  Critical: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  Major: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Minor: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
}

export const AUDIT_STATUS_STYLES: Record<AuditStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Open: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "In Progress":
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "Pending Review":
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  Closed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
}
