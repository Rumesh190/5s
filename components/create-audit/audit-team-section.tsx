"use client"

import { Controller, useFormContext, useWatch } from "react-hook-form"

import { FormField } from "@/components/create-audit/form-field"
import { FormSection } from "@/components/create-audit/form-section"
import { UserMultiSelect } from "@/components/create-audit/user-multi-select"
import { UserSelect } from "@/components/create-audit/user-select"
import { Input } from "@/components/ui/input"
import { AUDITORS, CURRENT_USER } from "@/lib/create-audit/master-data.mock"
import type { CreateAuditFormValues } from "@/lib/create-audit/schema"

function AuditTeamSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAuditFormValues>()
  const teamMembers = useWatch({ control, name: "teamMembers" }) ?? []
  const leadInvestigator = useWatch({ control, name: "leadInvestigator" })

  return (
    <FormSection
      id="audit-team"
      title="Audit Team"
      description="Who reported this issue, and who is investigating?"
    >
      <FormField label="Reported By" htmlFor="reportedBy">
        <Input
          id="reportedBy"
          value={`${CURRENT_USER.name} — ${CURRENT_USER.role}`}
          disabled
          readOnly
        />
      </FormField>

      <FormField
        label="Assigned Investigator"
        htmlFor="leadInvestigator"
        description="Optional"
        error={errors.leadInvestigator?.message}
      >
        <Controller
          control={control}
          name="leadInvestigator"
          render={({ field }) => (
            <UserSelect
              id="leadInvestigator"
              auditors={AUDITORS.filter((auditor) => !teamMembers.includes(auditor.id))}
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Assign an investigator"
            />
          )}
        />
      </FormField>

      <FormField
        label="Additional Team Members"
        htmlFor="teamMembers"
        description="Optional"
        className="sm:col-span-2"
      >
        <Controller
          control={control}
          name="teamMembers"
          render={({ field }) => (
            <UserMultiSelect
              auditors={AUDITORS.filter((auditor) => auditor.id !== leadInvestigator)}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>
    </FormSection>
  )
}

export { AuditTeamSection }
