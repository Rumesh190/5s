import { DetailSection } from "@/components/audit-details/detail-section"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { AuditSeverity } from "@/types/audit"
import type { CorrectiveAction } from "@/types/investigation"

const PRIORITIES: AuditSeverity[] = ["Critical", "High", "Medium", "Low"]

const EMPTY_ACTION: CorrectiveAction = {
  description: "",
  owner: "",
  targetDate: "",
  priority: "Medium",
  notes: "",
}

interface CorrectiveActionSectionProps {
  action: CorrectiveAction | null
  onChange: (patch: Partial<CorrectiveAction>) => void
  disabled?: boolean
}

/** Captures the action required to eliminate the identified root cause — mandatory before completion. */
function CorrectiveActionSection({ action, onChange, disabled }: CorrectiveActionSectionProps) {
  const value = action ?? EMPTY_ACTION

  return (
    <DetailSection
      title="Corrective Action"
      description="Actions required to eliminate or reduce the identified root cause."
    >
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="corrective-description">
          Corrective Action Description *
        </label>
        <Textarea
          id="corrective-description"
          rows={2}
          disabled={disabled}
          value={value.description}
          placeholder="What action will eliminate the root cause?"
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="corrective-owner">
          Action Owner *
        </label>
        <Input
          id="corrective-owner"
          disabled={disabled}
          value={value.owner}
          onChange={(event) => onChange({ owner: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="corrective-target-date">
          Target Completion Date *
        </label>
        <Input
          id="corrective-target-date"
          disabled={disabled}
          value={value.targetDate}
          placeholder="e.g. Aug 20, 2026"
          onChange={(event) => onChange({ targetDate: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Priority</span>
        <Select
          value={value.priority}
          onValueChange={(priority) => priority && onChange({ priority: priority as AuditSeverity })}
        >
          <SelectTrigger disabled={disabled} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="corrective-notes">
          Additional Notes
        </label>
        <Textarea
          id="corrective-notes"
          rows={2}
          disabled={disabled}
          value={value.notes ?? ""}
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      </div>
    </DetailSection>
  )
}

export { CorrectiveActionSection }
