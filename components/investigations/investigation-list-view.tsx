"use client"

import * as React from "react"

import { AuditPagination } from "@/components/audits/audit-pagination"
import { PageContainer } from "@/components/layout/page-container"
import { InvestigationEmptyState } from "@/components/investigations/investigation-empty-state"
import { InvestigationFilterBar } from "@/components/investigations/investigation-filter-bar"
import { InvestigationListHeader } from "@/components/investigations/investigation-list-header"
import { InvestigationListSkeleton } from "@/components/investigations/investigation-list-skeleton"
import { InvestigationTable } from "@/components/investigations/investigation-table"
import { filterInvestigations, hasActiveInvestigationFilters } from "@/lib/investigations/filter-investigations"
import { INVESTIGATIONS_MOCK } from "@/lib/mock/investigations.mock"
import {
  DEFAULT_INVESTIGATION_FILTERS,
  type InvestigationFilters,
} from "@/types/investigation"

// No backend exists yet — simulates a fetch delay so InvestigationListSkeleton
// has something to demonstrate.
const MOCK_LOAD_DELAY_MS = 500
const DEFAULT_PAGE_SIZE = 10

const OWNERS = Array.from(new Set(INVESTIGATIONS_MOCK.map((investigation) => investigation.owner))).sort()

function InvestigationListView() {
  const [loading, setLoading] = React.useState(true)
  const [filters, setFilters] = React.useState<InvestigationFilters>(DEFAULT_INVESTIGATION_FILTERS)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_LOAD_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = React.useCallback(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), MOCK_LOAD_DELAY_MS)
  }, [])

  const filtered = React.useMemo(
    () => filterInvestigations(INVESTIGATIONS_MOCK, filters),
    [filters]
  )
  const activeFilters = hasActiveInvestigationFilters(filters)

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function updateFilters(patch: Partial<InvestigationFilters>) {
    setFilters((previous) => ({ ...previous, ...patch }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(DEFAULT_INVESTIGATION_FILTERS)
    setPage(1)
  }

  if (loading) {
    return (
      <PageContainer>
        <InvestigationListSkeleton />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <InvestigationListHeader
        totalCount={INVESTIGATIONS_MOCK.length}
        search={filters.search}
        onSearchChange={(value) => updateFilters({ search: value })}
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      <InvestigationFilterBar
        filters={filters}
        owners={OWNERS}
        hasActiveFilters={activeFilters}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {filtered.length === 0 ? (
        <InvestigationEmptyState
          filtered={INVESTIGATIONS_MOCK.length > 0}
          onClearFilters={activeFilters ? clearFilters : undefined}
        />
      ) : (
        <>
          <InvestigationTable investigations={paginated} />
          <AuditPagination
            page={currentPage}
            pageCount={pageCount}
            pageSize={pageSize}
            totalRecords={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </>
      )}
    </PageContainer>
  )
}

export { InvestigationListView }
