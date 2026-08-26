"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AuditSeverity } from "@/types/audit"
import type { DateRangeFilter, InvestigationFilters, InvestigationStatus } from "@/types/investigation"

const STATUS_OPTIONS: InvestigationStatus[] = ["Open", "In Progress", "Awaiting Verification", "Closed"]
const SEVERITY_OPTIONS: AuditSeverity[] = ["Critical", "High", "Medium", "Low"]
const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "quarter", label: "Last quarter" },
]

// Base UI's Select.Value can't read labels from <SelectItem> children while
// the popup is closed (they're unmounted), so each trigger resolves its own
// label explicitly instead of relying on the default lookup.
const asAllLabel = (prefix: string) => (value: string | null) =>
  value === "all" || value == null ? `All ${prefix}` : value

interface InvestigationFilterBarProps {
  filters: InvestigationFilters
  owners: string[]
  hasActiveFilters: boolean
  onChange: (patch: Partial<InvestigationFilters>) => void
  onClear: () => void
}

/** Status, Priority, Assigned To, and Date Range filters — all combinable. */
function InvestigationFilterBar({
  filters,
  owners,
  hasActiveFilters,
  onChange,
  onClear,
}: InvestigationFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ status: value as InvestigationFilters["status"] })}
      >
        <SelectTrigger size="sm" aria-label="Filter by status">
          <SelectValue placeholder="Status">{asAllLabel("statuses")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.severity}
        onValueChange={(value) => onChange({ severity: value as InvestigationFilters["severity"] })}
      >
        <SelectTrigger size="sm" aria-label="Filter by priority">
          <SelectValue placeholder="Priority">{asAllLabel("priorities")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {SEVERITY_OPTIONS.map((severity) => (
            <SelectItem key={severity} value={severity}>
              {severity}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.owner} onValueChange={(value) => onChange({ owner: value ?? "all" })}>
        <SelectTrigger size="sm" aria-label="Filter by assigned to">
          <SelectValue placeholder="Assigned To">{asAllLabel("owners")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All owners</SelectItem>
          {owners.map((owner) => (
            <SelectItem key={owner} value={owner}>
              {owner}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.dateRange}
        onValueChange={(value) => onChange({ dateRange: value as DateRangeFilter })}
      >
        <SelectTrigger size="sm" aria-label="Filter by date range">
          <SelectValue placeholder="Date range">
            {(value: DateRangeFilter | null) =>
              DATE_RANGE_OPTIONS.find((option) => option.value === value)?.label ?? "Date range"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {DATE_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="size-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}

export { InvestigationFilterBar }
