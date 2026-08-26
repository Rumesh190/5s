import type { AuditFilters, AuditRecord } from "@/types/audit"

const DATE_RANGE_MAX_DAYS: Record<Exclude<AuditFilters["dateRange"], "all">, number> = {
  today: 0,
  "7d": 7,
  "30d": 30,
  quarter: 90,
}

/** Pure filter/search over the mock dataset — kept out of components so the
 *  matching rules live in one testable place (per the Development Guide's
 *  "business logic belongs in services/utilities, not UI components" rule). */
export function filterAudits(audits: AuditRecord[], filters: AuditFilters): AuditRecord[] {
  const search = filters.search.trim().toLowerCase()

  return audits.filter((audit) => {
    if (search) {
      const matchesSearch =
        audit.id.toLowerCase().includes(search) ||
        audit.title.toLowerCase().includes(search) ||
        audit.department.toLowerCase().includes(search)
      if (!matchesSearch) return false
    }

    if (filters.status !== "all" && audit.status !== filters.status) return false
    if (filters.severity !== "all" && audit.severity !== filters.severity) return false
    if (filters.region !== "all" && audit.region !== filters.region) return false
    if (filters.plant !== "all" && audit.plant !== filters.plant) return false

    if (filters.dateRange !== "all") {
      const maxDays = DATE_RANGE_MAX_DAYS[filters.dateRange]
      if (audit.updatedDaysAgo > maxDays) return false
    }

    return true
  })
}

export function hasActiveFilters(filters: AuditFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.severity !== "all" ||
    filters.region !== "all" ||
    filters.plant !== "all" ||
    filters.dateRange !== "all"
  )
}
