import type { AuditStatus } from "@/types/dashboard"

// Re-exported so audit components only need to import from one place.
export type { AuditStatus }

export type AuditSeverity = "Critical" | "High" | "Medium" | "Low"

export interface AuditRecord {
  id: string
  title: string
  region: string
  plant: string
  department: string
  severity: AuditSeverity
  status: AuditStatus
  assignedTo: string
  /** 0-100, shown by the row's progress indicator. */
  progress: number
  /** Days before the mock "today" reference — avoids Date() calls that would
   *  differ between server and client render and break hydration. */
  createdDaysAgo: number
  updatedDaysAgo: number
}

export type DateRangeFilter = "all" | "today" | "7d" | "30d" | "quarter"

export interface AuditFilters {
  search: string
  status: AuditStatus | "all"
  severity: AuditSeverity | "all"
  region: string | "all"
  plant: string | "all"
  dateRange: DateRangeFilter
}

export const DEFAULT_AUDIT_FILTERS: AuditFilters = {
  search: "",
  status: "all",
  severity: "all",
  region: "all",
  plant: "all",
  dateRange: "all",
}
