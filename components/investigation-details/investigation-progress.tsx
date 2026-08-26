import { DetailSection } from "@/components/audit-details/detail-section"
import { ProgressBar } from "@/components/ui/progress-bar"
import type { WhyStep } from "@/types/investigation"

interface InvestigationProgressProps {
  progress: number
  whySteps: WhyStep[]
  hasRootCause: boolean
}

function currentStepLabel(whySteps: WhyStep[], hasRootCause: boolean): string {
  if (hasRootCause) return "Corrective Action"
  const nextWhy = whySteps.find((why) => !why.answer.trim())
  if (!nextWhy) return "Root Cause"
  return `Why ${nextWhy.step}`
}

/** Progress Percentage, Current Step, Investigation Status — per the spec. */
function InvestigationProgress({ progress, whySteps, hasRootCause }: InvestigationProgressProps) {
  return (
    <DetailSection title="Investigation Progress" contentClassName="gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Current step: {currentStepLabel(whySteps, hasRootCause)}</span>
        <span className="font-medium text-foreground">{progress}%</span>
      </div>
      <ProgressBar value={progress} />
    </DetailSection>
  )
}

export { InvestigationProgress }
