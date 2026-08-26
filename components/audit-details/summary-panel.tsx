import { AlertOctagon, CalendarClock, ListChecks } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress-bar"
import { criticalFindingsCount, openFindingsCount } from "@/lib/mock/audit-details.mock"
import type { AuditDetails } from "@/types/audit-details"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

interface SummaryPanelProps {
  audit: AuditDetails
}

/** Sticky sidebar with the facts a reviewer scans for first — mirrors the
 * GitHub/Linear issue-sidebar pattern referenced in the screen spec. */
function SummaryPanel({ audit }: SummaryPanelProps) {
  const open = openFindingsCount(audit.findings)
  const critical = criticalFindingsCount(audit.findings)
  const assignee = audit.assignedInvestigator ?? audit.assignedTo

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{audit.progress}%</span>
          </div>
          <ProgressBar value={audit.progress} />
        </div>

        <dl className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <ListChecks className="size-4" /> Open Findings
            </dt>
            <dd className="font-medium text-foreground">{open}</dd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <AlertOctagon className="size-4" /> Critical Findings
            </dt>
            <dd
              className={cn(
                "font-medium",
                critical > 0 ? "text-red-600 dark:text-red-400" : "text-foreground"
              )}
            >
              {critical}
            </dd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="size-4" /> Due Date
            </dt>
            <dd className="font-medium text-foreground">{audit.dueDate ?? "—"}</dd>
          </div>
        </dl>

        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Avatar size="sm">
            <AvatarFallback>{initials(assignee)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Assigned Auditor</span>
            <span className="text-sm font-medium text-foreground">{assignee}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { SummaryPanel }
