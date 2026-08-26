"use client"

import * as React from "react"

import { PageContainer } from "@/components/layout/page-container"
import { AuditTrendChart } from "@/components/dashboard/audit-trend-chart"
import { CriticalIssuesCard } from "@/components/dashboard/critical-issues-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { PlantCard } from "@/components/dashboard/plant-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentAuditsTable } from "@/components/dashboard/recent-audits-table"
import { RootCauseChart } from "@/components/dashboard/root-cause-chart"
import { DASHBOARD_MOCK } from "@/lib/mock/dashboard.mock"

// No backend exists yet — this simulates a fetch delay so DashboardSkeleton
// has something to demonstrate. Replace with a TanStack Query hook against
// GET /api/v1/dashboard (see docs/02_Engineering/21_API_Contracts.md) once
// dashboard-service.ts exists.
const MOCK_LOAD_DELAY_MS = 500

/** Composes every Dashboard section from mock data. Owns the loading state. */
function DashboardView() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_LOAD_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    )
  }

  const data = DASHBOARD_MOCK

  return (
    <PageContainer>
      <DashboardHeader />

      <section
        aria-label="Key performance indicators"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section
        aria-label="Audit trend and root cause distribution"
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <AuditTrendChart data={data.auditTrend} />
        <RootCauseChart data={data.rootCauseDistribution} />
      </section>

      <section aria-label="Plant performance" className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Plant Performance
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.plantPerformance.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </section>

      <section
        aria-label="Recent audits, critical issues, and quick actions"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <RecentAuditsTable audits={data.recentAudits} />
        </div>
        <div className="flex flex-col gap-4">
          <CriticalIssuesCard issues={data.criticalIssues} />
          <QuickActions actions={data.quickActions} />
        </div>
      </section>
    </PageContainer>
  )
}

export { DashboardView }
