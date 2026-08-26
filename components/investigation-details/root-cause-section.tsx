import { Badge } from "@/components/ui/badge"
import { DetailSection } from "@/components/audit-details/detail-section"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { RootCause, RootCauseCategory } from "@/types/investigation"

const CATEGORIES: RootCauseCategory[] = [
  "Human Error",
  "Machine Failure",
  "Material Defect",
  "Method / Process",
  "Measurement",
  "Environment",
]

const EMPTY_ROOT_CAUSE: RootCause = {
  category: "Method / Process",
  description: "",
  contributingFactors: [],
  summary: "",
}

interface RootCauseSectionProps {
  rootCause: RootCause | null
  onChange: (patch: Partial<RootCause>) => void
  disabled?: boolean
}

/** Documents the investigation's final conclusion — mandatory before completion. */
function RootCauseSection({ rootCause, onChange, disabled }: RootCauseSectionProps) {
  const value = rootCause ?? EMPTY_ROOT_CAUSE

  return (
    <DetailSection
      title="Root Cause"
      description="Document the final conclusion of the investigation."
      contentClassName="gap-4"
    >
      <div className="flex flex-col gap-1.5 sm:max-w-64">
        <span className="text-xs font-medium text-muted-foreground">Root Cause Category</span>
        <Select
          value={value.category}
          onValueChange={(category) => category && onChange({ category: category as RootCauseCategory })}
        >
          <SelectTrigger disabled={disabled} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="root-cause-description">
          Root Cause *
        </label>
        <Textarea
          id="root-cause-description"
          rows={3}
          disabled={disabled}
          value={value.description}
          placeholder="Describe the confirmed root cause..."
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Contributing Factors</span>
        {value.contributingFactors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contributing factors recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {value.contributingFactors.map((factor) => (
              <Badge key={factor} variant="secondary">
                {factor}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="investigation-summary">
          Investigation Summary
        </label>
        <Textarea
          id="investigation-summary"
          rows={2}
          disabled={disabled}
          value={value.summary}
          placeholder="Summarize the investigation's conclusion..."
          onChange={(event) => onChange({ summary: event.target.value })}
        />
      </div>
    </DetailSection>
  )
}

export { RootCauseSection }
