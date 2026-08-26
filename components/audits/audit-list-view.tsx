"use client"

import * as React from "react"

import { PageContainer } from "@/components/layout/page-container"
import { AuditBulkToolbar } from "@/components/audits/audit-bulk-toolbar"
import { AuditEmptyState } from "@/components/audits/audit-empty-state"
import { AuditFilterBar } from "@/components/audits/audit-filter-bar"
import { AuditListHeader } from "@/components/audits/audit-list-header"
import { AuditListSkeleton } from "@/components/audits/audit-list-skeleton"
import { AuditPagination } from "@/components/audits/audit-pagination"
import { AuditTable } from "@/components/audits/audit-table"
import { filterAudits, hasActiveFilters } from "@/lib/audits/filter-audits"
import { AUDITS_MOCK } from "@/lib/mock/audits.mock"
import { DEFAULT_AUDIT_FILTERS, type AuditFilters, type AuditRecord } from "@/types/audit"

// No backend exists yet — simulates a fetch delay so AuditListSkeleton has
// something to demonstrate. Replace with a TanStack Query hook against
// GET /api/v1/audits (docs/02_Engineering/21_API_Contracts.md) once
// audit-service.ts exists.
const MOCK_LOAD_DELAY_MS = 500
const DEFAULT_PAGE_SIZE = 10

const REGIONS = Array.from(new Set(AUDITS_MOCK.map((audit) => audit.region))).sort()
const PLANTS = Array.from(new Set(AUDITS_MOCK.map((audit) => audit.plant))).sort()

function AuditListView() {
  const [loading, setLoading] = React.useState(true)
  const [audits, setAudits] = React.useState<AuditRecord[]>(AUDITS_MOCK)
  const [filters, setFilters] = React.useState<AuditFilters>(DEFAULT_AUDIT_FILTERS)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
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

  const filtered = React.useMemo(() => filterAudits(audits, filters), [audits, filters])
  const activeFilters = hasActiveFilters(filters)

  // Derived (not stored) so a filter/page-size change that shrinks the
  // result set can't leave `page` pointing past the end — no effect needed.
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function updateFilters(patch: Partial<AuditFilters>) {
    setFilters((previous) => ({ ...previous, ...patch }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(DEFAULT_AUDIT_FILTERS)
    setPage(1)
  }

  function toggleRow(id: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll(checked: boolean) {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (checked) paginated.forEach((audit) => next.add(audit.id))
      else paginated.forEach((audit) => next.delete(audit.id))
      return next
    })
  }

  function deleteAudit(id: string) {
    setAudits((previous) => previous.filter((audit) => audit.id !== id))
    setSelectedIds((previous) => {
      const next = new Set(previous)
      next.delete(id)
      return next
    })
  }

  if (loading) {
    return (
      <PageContainer>
        <AuditListSkeleton />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AuditListHeader
        totalCount={audits.length}
        search={filters.search}
        onSearchChange={(value) => updateFilters({ search: value })}
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      <AuditFilterBar
        filters={filters}
        regions={REGIONS}
        plants={PLANTS}
        hasActiveFilters={activeFilters}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      <AuditBulkToolbar count={selectedIds.size} onClear={() => setSelectedIds(new Set())} />

      {filtered.length === 0 ? (
        <AuditEmptyState
          filtered={audits.length > 0}
          onClearFilters={activeFilters ? clearFilters : undefined}
        />
      ) : (
        <>
          <AuditTable
            audits={paginated}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            onDelete={deleteAudit}
          />
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

export { AuditListView }
