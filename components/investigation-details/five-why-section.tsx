"use client"

import * as React from "react"
import { CheckCircle2, ChevronDown, Circle, Paperclip } from "lucide-react"

import { cn } from "@/lib/utils"
import { DetailSection } from "@/components/audit-details/detail-section"
import { Textarea } from "@/components/ui/textarea"
import { isWhyStepUnlocked } from "@/lib/mock/investigations.mock"
import type { WhyStep } from "@/types/investigation"

interface FiveWhySectionProps {
  whySteps: WhyStep[]
  onChange: (step: number, patch: Partial<WhyStep>) => void
  disabled?: boolean
}

/** Five sequential Why steps — only one expanded at a time, and each step
 *  unlocks once the previous one has an answer, per the screen spec's UX notes. */
function FiveWhySection({ whySteps, onChange, disabled }: FiveWhySectionProps) {
  const firstIncomplete =
    whySteps.find((why) => !why.answer.trim())?.step ?? whySteps[whySteps.length - 1].step
  const [activeStep, setActiveStep] = React.useState<number>(firstIncomplete)

  return (
    <DetailSection
      title="Five Why Analysis"
      description="Each Why should build on the previous answer. Steps unlock sequentially."
      contentClassName="gap-3"
    >
      {whySteps.map((why) => {
        const unlocked = isWhyStepUnlocked(whySteps, why.step)
        const complete = Boolean(why.answer.trim())
        const isActive = activeStep === why.step

        return (
          <div key={why.step} className={cn("rounded-lg border border-border", !unlocked && "opacity-50")}>
            <button
              type="button"
              disabled={!unlocked}
              onClick={() => setActiveStep(isActive ? -1 : why.step)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-not-allowed"
            >
              {complete ? (
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground" />
              )}
              <span className="flex-1">
                <span className="block text-sm font-medium text-foreground">Why {why.step}</span>
                <span className="block text-xs text-muted-foreground">{why.question}</span>
              </span>
              {unlocked && (
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    isActive && "rotate-180"
                  )}
                />
              )}
            </button>

            {isActive && unlocked && (
              <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-medium text-muted-foreground"
                    htmlFor={`why-${why.step}-answer`}
                  >
                    Answer *
                  </label>
                  <Textarea
                    id={`why-${why.step}-answer`}
                    rows={2}
                    value={why.answer}
                    disabled={disabled}
                    placeholder="Record the answer for this step..."
                    onChange={(event) => onChange(why.step, { answer: event.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-medium text-muted-foreground"
                    htmlFor={`why-${why.step}-notes`}
                  >
                    Supporting Notes
                  </label>
                  <Textarea
                    id={`why-${why.step}-notes`}
                    rows={2}
                    value={why.notes}
                    disabled={disabled}
                    placeholder="Optional supporting notes or evidence description..."
                    onChange={(event) => onChange(why.step, { notes: event.target.value })}
                  />
                </div>
                {why.evidenceFileName && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Paperclip className="size-3.5" />
                    {why.evidenceFileName}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </DetailSection>
  )
}

export { FiveWhySection }
