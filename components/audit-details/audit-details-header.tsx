"use client"

import * as React from "react"
import { Download, Loader2, Pencil } from "lucide-react"

import { AuditSeverityBadge } from "@/components/audits/audit-severity-badge"
import { AuditStatusBadge } from "@/components/audits/audit-status-badge"
import { Button } from "@/components/ui/button"
import { formatDaysAgo } from "@/lib/audits/format"
import type { AuditDetails } from "@/types/audit-details"

interface AuditDetailsHeaderProps {
  audit: AuditDetails
}

function AuditDetailsHeader({ audit }: AuditDetailsHeaderProps) {
  const [exporting, setExporting] = React.useState(false)

  function handleExport() {
    setExporting(true)
    // No backend yet — simulate generating an export.
    setTimeout(() => setExporting(false), 900)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-medium text-muted-foreground">{audit.id}</span>
          <AuditStatusBadge status={audit.status} />
          <AuditSeverityBadge severity={audit.severity} />
        </div>
        <h1 className="font-heading text-[32px] leading-tight font-semibold tracking-tight text-foreground">
          {audit.title}
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated {formatDaysAgo(audit.updatedDaysAgo)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Not wired to a route yet — a dedicated edit form ships in a later sprint. */}
        <Button variant="outline">
          <Pencil className="size-4" />
          Edit Audit
        </Button>
        <Button variant="outline" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Export
        </Button>
      </div>
    </div>
  )
}

export { AuditDetailsHeader }
