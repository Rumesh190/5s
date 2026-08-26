import { CheckCircle2, Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { DetailSection } from "@/components/audit-details/detail-section"
import { ProgressBar } from "@/components/ui/progress-bar"
import { checklistProgress } from "@/lib/mock/audit-details.mock"
import type { ChecklistItem } from "@/types/audit-details"

interface ChecklistSummaryProps {
  checklist: ChecklistItem[]
}

function ChecklistSummary({ checklist }: ChecklistSummaryProps) {
  const { done, total } = checklistProgress(checklist)
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <DetailSection
      title="Checklist Summary"
      description={total > 0 ? `${done} of ${total} items completed` : undefined}
    >
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">No checklist items recorded for this audit.</p>
      ) : (
        <>
          <ProgressBar value={percent} />
          <ul className="flex flex-col gap-2">
            {checklist.map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-sm">
                {item.checked ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                )}
                <span className={cn(item.checked ? "text-foreground" : "text-muted-foreground")}>
                  <span className="mr-1.5 text-xs text-muted-foreground">{item.category}</span>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </DetailSection>
  )
}

export { ChecklistSummary }
