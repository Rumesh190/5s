import { DetailSection } from "@/components/audit-details/detail-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { PreventiveAction } from "@/types/investigation"

const EMPTY_ACTION: PreventiveAction = {
  description: "",
  owner: "",
  targetDate: "",
  notes: "",
}

interface PreventiveActionSectionProps {
  action: PreventiveAction | null
  onChange: (patch: Partial<PreventiveAction>) => void
  disabled?: boolean
}

/** Captures the action required to prevent recurrence elsewhere. */
function PreventiveActionSection({ action, onChange, disabled }: PreventiveActionSectionProps) {
  const value = action ?? EMPTY_ACTION

  return (
    <DetailSection
      title="Preventive Action"
      description="Actions required to prevent this issue from recurring elsewhere."
    >
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="preventive-description">
          Preventive Action Description
        </label>
        <Textarea
          id="preventive-description"
          rows={2}
          disabled={disabled}
          value={value.description}
          placeholder="What will prevent this issue from recurring?"
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="preventive-owner">
          Owner
        </label>
        <Input
          id="preventive-owner"
          disabled={disabled}
          value={value.owner}
          onChange={(event) => onChange({ owner: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="preventive-target-date">
          Target Completion Date
        </label>
        <Input
          id="preventive-target-date"
          disabled={disabled}
          value={value.targetDate}
          placeholder="e.g. Aug 20, 2026"
          onChange={(event) => onChange({ targetDate: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="preventive-notes">
          Additional Notes
        </label>
        <Textarea
          id="preventive-notes"
          rows={2}
          disabled={disabled}
          value={value.notes ?? ""}
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      </div>
    </DetailSection>
  )
}

export { PreventiveActionSection }
