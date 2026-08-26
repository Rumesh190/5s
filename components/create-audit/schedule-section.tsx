"use client"

import { useFormContext } from "react-hook-form"

import { FormField } from "@/components/create-audit/form-field"
import { FormSection } from "@/components/create-audit/form-section"
import { Input } from "@/components/ui/input"
import { TODAY_ISO, type CreateAuditFormValues } from "@/lib/create-audit/schema"

function ScheduleSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateAuditFormValues>()

  return (
    <FormSection
      id="schedule"
      title="Schedule"
      description="When did this occur, and when should it be resolved?"
    >
      <FormField label="Audit Date" htmlFor="auditDate" required error={errors.auditDate?.message}>
        <Input id="auditDate" type="date" max={TODAY_ISO} {...register("auditDate")} />
      </FormField>

      <FormField
        label="Target Completion Date"
        htmlFor="targetCompletionDate"
        description="Optional"
        error={errors.targetCompletionDate?.message}
      >
        <Input id="targetCompletionDate" type="date" {...register("targetCompletionDate")} />
      </FormField>
    </FormSection>
  )
}

export { ScheduleSection }
