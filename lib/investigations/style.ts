import type { InvestigationStatus } from "@/types/investigation"

export const INVESTIGATION_STATUS_STYLES: Record<InvestigationStatus, string> = {
  Open: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "In Progress": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "Awaiting Verification":
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  Closed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
}
