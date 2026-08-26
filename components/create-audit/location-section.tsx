"use client"

import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

import { FormField } from "@/components/create-audit/form-field"
import { FormSection } from "@/components/create-audit/form-section"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DEPARTMENTS,
  PRODUCTION_LINES,
  REGIONS,
  cityForPlant,
  plantsForRegion,
} from "@/lib/create-audit/master-data.mock"
import type { CreateAuditFormValues } from "@/lib/create-audit/schema"

/**
 * Region → Plant → City cascading selects. Changing Region clears Plant and
 * City; changing Plant re-derives City from the master data (each plant maps
 * to exactly one city), which is how "reset" reads for a 1:1 relationship —
 * the stale value never persists, it's immediately replaced by the correct one.
 */
function LocationSection() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateAuditFormValues>()

  const region = watch("region")
  const plant = watch("plant")

  const availablePlants = React.useMemo(() => plantsForRegion(region), [region])
  const availableCity = plant ? cityForPlant(plant) : undefined

  return (
    <FormSection
      id="location"
      title="Location"
      description="Where did this issue occur?"
    >
      <FormField label="Region" htmlFor="region" required error={errors.region?.message}>
        <Controller
          control={control}
          name="region"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value ?? "")
                setValue("plant", "", { shouldValidate: false })
                setValue("city", "", { shouldValidate: false })
              }}
            >
              <SelectTrigger id="region" className="w-full">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="Plant" htmlFor="plant" required error={errors.plant?.message}>
        <Controller
          control={control}
          name="plant"
          render={({ field }) => (
            <Select
              value={field.value}
              disabled={!region}
              onValueChange={(value) => {
                field.onChange(value ?? "")
                setValue("city", cityForPlant(value ?? "") ?? "", { shouldValidate: false })
              }}
            >
              <SelectTrigger id="plant" className="w-full">
                <SelectValue placeholder={region ? "Select plant" : "Select a region first"} />
              </SelectTrigger>
              <SelectContent>
                {availablePlants.map((option) => (
                  <SelectItem key={option.id} value={option.name}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="City" htmlFor="city" required error={errors.city?.message}>
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <Select value={field.value} disabled={!plant} onValueChange={(value) => field.onChange(value ?? "")}>
              <SelectTrigger id="city" className="w-full">
                <SelectValue placeholder={plant ? "Select city" : "Select a plant first"} />
              </SelectTrigger>
              <SelectContent>
                {availableCity && <SelectItem value={availableCity}>{availableCity}</SelectItem>}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="Department" htmlFor="department" required error={errors.department?.message}>
        <Controller
          control={control}
          name="department"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
              <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Production Line"
        htmlFor="productionLine"
        required
        error={errors.productionLine?.message}
      >
        <Controller
          control={control}
          name="productionLine"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
              <SelectTrigger id="productionLine" className="w-full">
                <SelectValue placeholder="Select production line" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCTION_LINES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
    </FormSection>
  )
}

export { LocationSection }
