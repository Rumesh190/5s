import { z } from "zod"

// Fixed "today" reference (matches the session's current date) so date
// validation is deterministic and never depends on the runtime clock or
// causes a server/client render mismatch.
export const TODAY_ISO = "2026-08-06"

export const createAuditSchema = z
  .object({
    // Basic Information
    auditTitle: z
      .string()
      .trim()
      .min(5, "Audit title must be at least 5 characters."),
    auditType: z.string().min(1, "Select an audit type."),
    severity: z.string().min(1, "Select a severity."),
    productName: z.string().optional(),

    // Location
    region: z.string().min(1, "Select a region."),
    plant: z.string().min(1, "Select a plant."),
    city: z.string().min(1, "Select a city."),
    department: z.string().min(1, "Select a department."),
    productionLine: z.string().min(1, "Select a production line."),

    // Audit Details
    problemDescription: z
      .string()
      .trim()
      .min(20, "Describe the problem in at least 20 characters."),
    observation: z.string().optional(),
    quantityAffected: z.string().optional(),
    immediateAction: z.string().optional(),
    additionalNotes: z.string().optional(),

    // Audit Team
    leadInvestigator: z.string().optional(),
    teamMembers: z.array(z.string()),

    // Schedule
    auditDate: z
      .string()
      .min(1, "Audit date is required.")
      .refine((value) => value <= TODAY_ISO, {
        message: "Audit date cannot be in the future.",
      }),
    targetCompletionDate: z.string().optional(),
  })
  .refine(
    (data) => !data.targetCompletionDate || data.targetCompletionDate >= data.auditDate,
    {
      message: "Target completion date must be on or after the audit date.",
      path: ["targetCompletionDate"],
    }
  )

export type CreateAuditFormValues = z.infer<typeof createAuditSchema>

export const CREATE_AUDIT_DEFAULT_VALUES: CreateAuditFormValues = {
  auditTitle: "",
  auditType: "",
  severity: "",
  productName: "",
  region: "",
  plant: "",
  city: "",
  department: "",
  productionLine: "",
  problemDescription: "",
  observation: "",
  quantityAffected: "",
  immediateAction: "",
  additionalNotes: "",
  leadInvestigator: "",
  teamMembers: [],
  auditDate: "",
  targetCompletionDate: "",
}

/** Section keys, in display order — used by both the form and the section nav. */
export const CREATE_AUDIT_SECTIONS = [
  "basic-information",
  "location",
  "audit-details",
  "audit-team",
  "schedule",
  "attachments",
  "review",
] as const

export type CreateAuditSection = (typeof CREATE_AUDIT_SECTIONS)[number]

/** Field-level required indicators, per the screen spec's validation rules. */
export const REQUIRED_FIELDS: Partial<Record<keyof CreateAuditFormValues, boolean>> = {
  auditTitle: true,
  auditType: true,
  severity: true,
  region: true,
  plant: true,
  city: true,
  department: true,
  productionLine: true,
  problemDescription: true,
  auditDate: true,
}
