import { AuditSeverityBadge } from "@/components/audits/audit-severity-badge"
import { InvestigationStatusBadge } from "@/components/investigations/investigation-status-badge"
import { formatDaysAgo } from "@/lib/audits/format"
import type { InvestigationDetails } from "@/types/investigation"

interface InvestigationDetailsHeaderProps {
  investigation: InvestigationDetails
}

function InvestigationDetailsHeader({ investigation }: InvestigationDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-medium text-muted-foreground">{investigation.id}</span>
        <InvestigationStatusBadge status={investigation.status} />
        <AuditSeverityBadge severity={investigation.severity} />
      </div>
      <h1 className="font-heading text-[32px] leading-tight font-semibold tracking-tight text-foreground">
        {investigation.title}
      </h1>
      <p className="text-xs text-muted-foreground">
        Last updated {formatDaysAgo(investigation.updatedDaysAgo)}
      </p>
    </div>
  )
}

export { InvestigationDetailsHeader }
