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
import type { AuditFilters, AuditSeverity, AuditStatus, DateRangeFilter } from "@/types/audit"

const STATUS_OPTIONS: AuditStatus[] = ["Draft", "Open", "In Progress", "Pending Review", "Closed"]
const SEVERITY_OPTIONS: AuditSeverity[] = ["Critical", "High", "Medium", "Low"]
const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "quarter", label: "Last quarter" },
]
const DATE_RANGE_LABELS = Object.fromEntries(
  DATE_RANGE_OPTIONS.map((option) => [option.value, option.label])
) as Record<DateRangeFilter, string>

// Base UI's Select.Value can't read labels from <SelectItem> children while
// the popup is closed (they're unmounted), so each trigger resolves its own
// label explicitly instead of relying on the default lookup.
const asAllLabel = (prefix: string) => (value: string | null) =>
  value === "all" || value == null ? `All ${prefix}` : value

interface AuditFilterBarProps {
  filters: AuditFilters
  regions: string[]
  plants: string[]
  hasActiveFilters: boolean
  onChange: (patch: Partial<AuditFilters>) => void
  onClear: () => void
}

/** Status, Priority, Region, Plant, and Date Range filters — all combinable, per the spec. */
function AuditFilterBar({
  filters,
  regions,
  plants,
  hasActiveFilters,
  onChange,
  onClear,
}: AuditFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ status: value as AuditFilters["status"] })}
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
        onValueChange={(value) => onChange({ severity: value as AuditFilters["severity"] })}
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

      <Select value={filters.region} onValueChange={(value) => onChange({ region: value ?? "all" })}>
        <SelectTrigger size="sm" aria-label="Filter by region">
          <SelectValue placeholder="Region">{asAllLabel("regions")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All regions</SelectItem>
          {regions.map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.plant} onValueChange={(value) => onChange({ plant: value ?? "all" })}>
        <SelectTrigger size="sm" aria-label="Filter by plant">
          <SelectValue placeholder="Plant">{asAllLabel("plants")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All plants</SelectItem>
          {plants.map((plant) => (
            <SelectItem key={plant} value={plant}>
              {plant}
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
            {(value: DateRangeFilter | null) => (value ? DATE_RANGE_LABELS[value] : "Date range")}
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

export { AuditFilterBar }
