import type { AuditSeverity } from "@/types/audit"

// Status colors are shared with the Dashboard module (same AuditStatus enum)
// — re-exported here so audit components only import from `lib/audits/*`.
export { AUDIT_STATUS_STYLES } from "@/lib/dashboard/accent"

export const AUDIT_SEVERITY_STYLES: Record<AuditSeverity, string> = {
  Critical: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  High: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Medium: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Low: "bg-muted text-muted-foreground",
}
