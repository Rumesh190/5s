"use client"

import { Controller, useFormContext } from "react-hook-form"

import { FormField } from "@/components/create-audit/form-field"
import { FormSection } from "@/components/create-audit/form-section"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AUDIT_TYPES, SEVERITIES } from "@/lib/create-audit/master-data.mock"
import type { CreateAuditFormValues } from "@/lib/create-audit/schema"

function BasicInformationSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateAuditFormValues>()

  return (
    <FormSection
      id="basic-information"
      title="Basic Information"
      description="High-level details about the audit."
    >
      <FormField
        label="Audit Title"
        htmlFor="auditTitle"
        required
        error={errors.auditTitle?.message}
        className="sm:col-span-2"
      >
        <Input
          id="auditTitle"
          placeholder="e.g. Weld Seam Inspection — Line 3"
          {...register("auditTitle")}
        />
      </FormField>

      <FormField label="Audit Type" htmlFor="auditType" required error={errors.auditType?.message}>
        <Controller
          control={control}
          name="auditType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
              <SelectTrigger id="auditType" className="w-full">
                <SelectValue placeholder="Select audit type" />
              </SelectTrigger>
              <SelectContent>
                {AUDIT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="Severity" htmlFor="severity" required error={errors.severity?.message}>
        <Controller
          control={control}
          name="severity"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
              <SelectTrigger id="severity" className="w-full">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {SEVERITIES.map((severity) => (
                  <SelectItem key={severity} value={severity}>
                    {severity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Product / Part Name"
        htmlFor="productName"
        description="Optional"
        className="sm:col-span-2"
      >
        <Input
          id="productName"
          placeholder="e.g. Bracket Assembly 44B"
          {...register("productName")}
        />
      </FormField>
    </FormSection>
  )
}

export { BasicInformationSection }
