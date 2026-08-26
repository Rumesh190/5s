import type { InvestigationFilters, InvestigationRecord } from "@/types/investigation"

const DATE_RANGE_MAX_DAYS: Record<Exclude<InvestigationFilters["dateRange"], "all">, number> = {
  today: 0,
  "7d": 7,
  "30d": 30,
  quarter: 90,
}

/** Pure filter/search over the mock dataset, mirroring lib/audits/filter-audits.ts. */
export function filterInvestigations(
  investigations: InvestigationRecord[],
  filters: InvestigationFilters
): InvestigationRecord[] {
  const search = filters.search.trim().toLowerCase()

  return investigations.filter((investigation) => {
    if (search) {
      const matchesSearch =
        investigation.id.toLowerCase().includes(search) ||
        investigation.title.toLowerCase().includes(search) ||
        investigation.linkedAuditId.toLowerCase().includes(search)
      if (!matchesSearch) return false
    }

    if (filters.status !== "all" && investigation.status !== filters.status) return false
    if (filters.severity !== "all" && investigation.severity !== filters.severity) return false
    if (filters.owner !== "all" && investigation.owner !== filters.owner) return false

    if (filters.dateRange !== "all") {
      const maxDays = DATE_RANGE_MAX_DAYS[filters.dateRange]
      if (investigation.updatedDaysAgo > maxDays) return false
    }

    return true
  })
}

export function hasActiveInvestigationFilters(filters: InvestigationFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.severity !== "all" ||
    filters.owner !== "all" ||
    filters.dateRange !== "all"
  )
}
