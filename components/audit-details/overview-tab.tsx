import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChecklistSummary } from "@/components/audit-details/checklist-summary"
import { DetailRow } from "@/components/audit-details/detail-row"
import { DetailSection } from "@/components/audit-details/detail-section"
import { FindingsTable } from "@/components/audit-details/findings-table"
import { RelatedInvestigations } from "@/components/audit-details/related-investigations"
import { formatDaysAgo } from "@/lib/audits/format"
import type { AuditDetails } from "@/types/audit-details"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

interface OverviewTabProps {
  audit: AuditDetails
}

function OverviewTab({ audit }: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <DetailSection title="Audit Overview" description="What happened, and what's been done so far.">
        <DetailRow label="Problem Statement" value={audit.problemStatement} />
        <DetailRow label="Immediate Action Taken" value={audit.immediateAction} />
      </DetailSection>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailSection title="Location Information">
          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="Region" value={audit.region} />
            <DetailRow label="Plant" value={audit.plant} />
            <DetailRow label="City" value={audit.city} />
            <DetailRow label="Department" value={audit.department} />
            <DetailRow label="Production Line" value={audit.productionLine} />
            <DetailRow label="Product / Part" value={audit.productName} />
          </dl>
        </DetailSection>

        <div className="flex flex-col gap-4">
          <DetailSection title="Audit Team">
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{initials(audit.reportedBy)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Reported By</span>
                <span className="text-sm font-medium text-foreground">{audit.reportedBy}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{initials(audit.assignedInvestigator ?? "?")}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Assigned Investigator</span>
                <span className="text-sm font-medium text-foreground">
                  {audit.assignedInvestigator ?? "Unassigned"}
                </span>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Schedule & Timeline">
            <dl className="grid grid-cols-2 gap-4">
              <DetailRow label="Created" value={formatDaysAgo(audit.createdDaysAgo)} />
              <DetailRow label="Last Updated" value={formatDaysAgo(audit.updatedDaysAgo)} />
              <DetailRow label="Due Date" value={audit.dueDate} />
            </dl>
          </DetailSection>
        </div>
      </div>

      <ChecklistSummary checklist={audit.checklist} />

      <FindingsTable
        findings={audit.findings}
        title="Findings Summary"
        description="Top findings from this investigation."
        limit={3}
      />

      <RelatedInvestigations investigations={audit.relatedInvestigations} />
    </div>
  )
}

export { OverviewTab }
