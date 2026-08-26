"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityTimeline } from "@/components/audit-details/activity-timeline"
import { AttachmentsPanel } from "@/components/audit-details/attachments-panel"
import { AuditDetailsHeader } from "@/components/audit-details/audit-details-header"
import { AuditDetailsSkeleton } from "@/components/audit-details/audit-details-skeleton"
import { FindingsTable } from "@/components/audit-details/findings-table"
import { OverviewTab } from "@/components/audit-details/overview-tab"
import { SummaryPanel } from "@/components/audit-details/summary-panel"
import { getAuditDetails } from "@/lib/mock/audit-details.mock"

// No backend exists yet — simulates a fetch delay so AuditDetailsSkeleton has
// something to demonstrate. Replace with a TanStack Query hook against
// GET /api/v1/audits/{id} (docs/02_Engineering/21_API_Contracts.md) once
// audit-service.ts exists.
const MOCK_LOAD_DELAY_MS = 500

interface AuditDetailsViewProps {
  auditId: string
}

function AuditDetailsView({ auditId }: AuditDetailsViewProps) {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), MOCK_LOAD_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <PageContainer>
        <AuditDetailsSkeleton />
      </PageContainer>
    )
  }

  const audit = getAuditDetails(auditId)

  if (!audit) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-24 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <AlertTriangle className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">Audit not found</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              &ldquo;{auditId}&rdquo; doesn&apos;t match any audit in the system.
            </p>
          </div>
          <Button render={<Link href="/audits" />} nativeButton={false} variant="outline">
            Back to Audit List
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AuditDetailsHeader audit={audit} />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          <Tabs defaultValue="overview">
            <TabsList className="w-full sm:w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="findings">Findings</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <OverviewTab audit={audit} />
            </TabsContent>
            <TabsContent value="findings" className="mt-4">
              <FindingsTable
                findings={audit.findings}
                title="Findings"
                description="All findings recorded during this investigation."
              />
            </TabsContent>
            <TabsContent value="attachments" className="mt-4">
              <AttachmentsPanel attachments={audit.attachments} />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <ActivityTimeline activity={audit.activity} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="order-1 lg:order-2">
          <SummaryPanel audit={audit} />
        </div>
      </div>
    </PageContainer>
  )
}

export { AuditDetailsView }
