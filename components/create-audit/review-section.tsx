"use client"

import type { ReactNode } from "react"
import { useFormContext, useWatch } from "react-hook-form"

import { FormSection } from "@/components/create-audit/form-section"
import { AUDITORS, CURRENT_USER } from "@/lib/create-audit/master-data.mock"
import type { CreateAuditFormValues } from "@/lib/create-audit/schema"

interface ReviewSectionProps {
  attachmentCount: number
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">
        {value || <span className="text-muted-foreground">—</span>}
      </dd>
    </div>
  )
}

/** Read-only summary of every captured field — confirms the data before submission. */
function ReviewSection({ attachmentCount }: ReviewSectionProps) {
  const { control } = useFormContext<CreateAuditFormValues>()
  const values = useWatch({ control })

  const investigator = AUDITORS.find((auditor) => auditor.id === values.leadInvestigator)
  const team = (values.teamMembers ?? [])
    .map((id) => AUDITORS.find((auditor) => auditor.id === id)?.name)
    .filter(Boolean)
    .join(", ")

  return (
    <FormSection
      id="review"
      title="Review & Submit"
      description="Confirm the details below before creating the audit."
      contentClassName="grid-cols-1"
    >
      <dl className="grid gap-4 sm:grid-cols-3">
        <SummaryRow label="Audit Title" value={values.auditTitle} />
        <SummaryRow label="Audit Type" value={values.auditType} />
        <SummaryRow label="Severity" value={values.severity} />
        <SummaryRow label="Product / Part" value={values.productName} />
        <SummaryRow label="Region" value={values.region} />
        <SummaryRow label="Plant" value={values.plant} />
        <SummaryRow label="City" value={values.city} />
        <SummaryRow label="Department" value={values.department} />
        <SummaryRow label="Production Line" value={values.productionLine} />
        <SummaryRow label="Reported By" value={`${CURRENT_USER.name} — ${CURRENT_USER.role}`} />
        <SummaryRow
          label="Assigned Investigator"
          value={investigator ? `${investigator.name} — ${investigator.role}` : undefined}
        />
        <SummaryRow label="Team Members" value={team} />
        <SummaryRow label="Audit Date" value={values.auditDate} />
        <SummaryRow label="Target Completion" value={values.targetCompletionDate} />
        <SummaryRow
          label="Attachments"
          value={attachmentCount > 0 ? `${attachmentCount} file(s)` : undefined}
        />
      </dl>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Problem Description</p>
        <p className="mt-1 text-sm text-foreground">{values.problemDescription || "—"}</p>
      </div>
    </FormSection>
  )
}

export { ReviewSection }
