import Link from "next/link"

import { DetailRow } from "@/components/audit-details/detail-row"
import { DetailSection } from "@/components/audit-details/detail-section"
import { InvestigationStatusBadge } from "@/components/investigations/investigation-status-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { InvestigationDetails, InvestigationStatus } from "@/types/investigation"

const STATUS_WORKFLOW: InvestigationStatus[] = ["Open", "In Progress", "Awaiting Verification", "Closed"]

interface InvestigationSummaryProps {
  investigation: InvestigationDetails
  onStatusChange: (status: InvestigationStatus) => void
}

/** Investigation Summary: Problem Statement context, Linked Audit/Finding,
 *  Assigned Owner, Due Date, and the Status workflow control. */
function InvestigationSummary({ investigation, onStatusChange }: InvestigationSummaryProps) {
  return (
    <DetailSection
      title="Investigation Summary"
      description="Provides context carried over from the source audit and finding."
    >
      <DetailRow label="Problem Statement" value={investigation.problemStatement} />

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <DetailRow
          label="Linked Audit"
          value={
            <Link href={`/audits/${investigation.linkedAuditId}`} className="text-blue-600 hover:underline dark:text-blue-400">
              {investigation.linkedAuditId}
            </Link>
          }
        />
        <DetailRow label="Linked Finding" value={investigation.linkedFindingId ?? "—"} />
        <DetailRow label="Assigned Owner" value={investigation.owner} />
        <DetailRow label="Plant" value={investigation.plant} />
        <DetailRow label="Department" value={investigation.department} />
        <DetailRow label="Production Line" value={investigation.productionLine} />
        <DetailRow label="Due Date" value={investigation.dueDate} />
        <DetailRow
          label="Current Status"
          value={<InvestigationStatusBadge status={investigation.status} />}
        />
      </dl>

      <div className="flex flex-col gap-1.5 sm:max-w-64">
        <span className="text-xs font-medium text-muted-foreground">Change Status</span>
        <Select value={investigation.status} onValueChange={(value) => value && onStatusChange(value as InvestigationStatus)}>
          <SelectTrigger aria-label="Change investigation status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_WORKFLOW.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </DetailSection>
  )
}

export { InvestigationSummary }
