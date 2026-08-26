import { cn } from "@/lib/utils"
import { SEVERITY_STYLES } from "@/lib/dashboard/accent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CriticalIssue } from "@/types/dashboard"

interface CriticalIssuesCardProps {
  issues: CriticalIssue[]
}

function CriticalIssuesCard({ issues }: CriticalIssuesCardProps) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Critical Issues</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {issues.map((issue) => (
          <div key={issue.id} className="flex flex-col gap-1 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{issue.id}</span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
                  SEVERITY_STYLES[issue.severity]
                )}
              >
                {issue.severity}
              </span>
            </div>
            <p className="text-sm text-foreground">{issue.title}</p>
            <p className="text-xs text-muted-foreground">
              {issue.owner} · {issue.daysOpen} days open
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { CriticalIssuesCard }
