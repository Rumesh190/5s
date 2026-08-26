"use client"

import { useFormContext } from "react-hook-form"

import { FormField } from "@/components/create-audit/form-field"
import { FormSection } from "@/components/create-audit/form-section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CreateAuditFormValues } from "@/lib/create-audit/schema"

function AuditDetailsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateAuditFormValues>()

  return (
    <FormSection
      id="audit-details"
      title="Audit Details"
      description="Describe the issue in detail."
    >
      <FormField
        label="Problem Description"
        htmlFor="problemDescription"
        required
        error={errors.problemDescription?.message}
        className="sm:col-span-2"
      >
        <Textarea
          id="problemDescription"
          rows={4}
          placeholder="What happened, and where?"
          {...register("problemDescription")}
        />
      </FormField>

      <FormField
        label="Observation"
        htmlFor="observation"
        description="Optional"
        className="sm:col-span-2"
      >
        <Textarea
          id="observation"
          rows={3}
          placeholder="What did you observe during inspection?"
          {...register("observation")}
        />
      </FormField>

      <FormField label="Quantity Affected" htmlFor="quantityAffected" description="Optional">
        <Input
          id="quantityAffected"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="e.g. 12"
          {...register("quantityAffected")}
        />
      </FormField>

      <FormField label="Immediate Action Taken" htmlFor="immediateAction" description="Optional">
        <Input
          id="immediateAction"
          placeholder="e.g. Line stopped, batch quarantined"
          {...register("immediateAction")}
        />
      </FormField>

      <FormField
        label="Additional Notes"
        htmlFor="additionalNotes"
        description="Optional"
        className="sm:col-span-2"
      >
        <Textarea
          id="additionalNotes"
          rows={3}
          placeholder="Anything else worth noting?"
          {...register("additionalNotes")}
        />
      </FormField>
    </FormSection>
  )
}

export { AuditDetailsSection }
