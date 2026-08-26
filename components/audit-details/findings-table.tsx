import { cn } from "@/lib/utils"
import { AuditSeverityBadge } from "@/components/audits/audit-severity-badge"
import { DetailSection } from "@/components/audit-details/detail-section"
import { ProgressBar } from "@/components/ui/progress-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Finding, FindingStatus } from "@/types/audit-details"

const FINDING_STATUS_STYLES: Record<FindingStatus, string> = {
  Open: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "In Progress": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Closed: "bg-muted text-muted-foreground",
}

interface FindingsTableProps {
  findings: Finding[]
  title?: string
  description?: string
  /** When set, only the first N findings render — used by the Overview tab's summary. */
  limit?: number
}

/** Used both as the Overview tab's "Findings Summary" (with a limit) and the full Findings tab. */
function FindingsTable({ findings, title = "Findings", description, limit }: FindingsTableProps) {
  const visible = limit ? findings.slice(0, limit) : findings
  const hiddenCount = limit ? Math.max(0, findings.length - limit) : 0

  return (
    <DetailSection title={title} description={description} contentClassName="gap-3">
      {findings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No findings recorded for this audit.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Finding</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-32">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium text-foreground">
                    <span className="block">{finding.id}</span>
                    <span className="block max-w-72 truncate text-xs font-normal text-muted-foreground">
                      {finding.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <AuditSeverityBadge severity={finding.severity} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                        FINDING_STATUS_STYLES[finding.status]
                      )}
                    >
                      {finding.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{finding.owner}</TableCell>
                  <TableCell className="text-muted-foreground">{finding.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={finding.progress} className="w-16" />
                      <span className="text-xs text-muted-foreground">{finding.progress}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {hiddenCount > 0 && (
            <p className="text-xs text-muted-foreground">
              +{hiddenCount} more — open the Findings tab for the full list.
            </p>
          )}
        </>
      )}
    </DetailSection>
  )
}

export { FindingsTable }
