import type { AuditSeverity } from "@/types/audit"
import type { AuditAttachment } from "@/types/audit-details"

// Re-exported so investigation components only need to import from one place.
export type { AuditAttachment }

export type InvestigationStatus = "Open" | "In Progress" | "Awaiting Verification" | "Closed"

export interface InvestigationRecord {
  id: string
  title: string
  linkedAuditId: string
  linkedAuditTitle: string
  linkedFindingId?: string
  linkedFindingTitle?: string
  plant: string
  department: string
  productionLine: string
  severity: AuditSeverity
  status: InvestigationStatus
  owner: string
  progress: number
  createdDaysAgo: number
  updatedDaysAgo: number
  dueDate: string
}

export type DateRangeFilter = "all" | "today" | "7d" | "30d" | "quarter"

export interface InvestigationFilters {
  search: string
  status: InvestigationStatus | "all"
  severity: AuditSeverity | "all"
  owner: string | "all"
  dateRange: DateRangeFilter
}

export const DEFAULT_INVESTIGATION_FILTERS: InvestigationFilters = {
  search: "",
  status: "all",
  severity: "all",
  owner: "all",
  dateRange: "all",
}

export interface WhyStep {
  step: 1 | 2 | 3 | 4 | 5
  question: string
  answer: string
  notes: string
  evidenceFileName?: string
}

export type RootCauseCategory =
  | "Human Error"
  | "Machine Failure"
  | "Material Defect"
  | "Method / Process"
  | "Measurement"
  | "Environment"

export interface RootCause {
  category: RootCauseCategory
  description: string
  contributingFactors: string[]
  summary: string
}

export interface CorrectiveAction {
  description: string
  owner: string
  targetDate: string
  priority: AuditSeverity
  notes?: string
}

export interface PreventiveAction {
  description: string
  owner: string
  targetDate: string
  notes?: string
}

export type InvestigationEventType =
  | "Investigation Started"
  | "Why Answered"
  | "Root Cause Documented"
  | "Corrective Action Added"
  | "Preventive Action Added"
  | "Status Changed"
  | "Comment Added"
  | "Attachment Uploaded"
  | "Investigation Completed"
  | "Verification Passed"
  | "Verification Failed"

export interface InvestigationEvent {
  id: string
  type: InvestigationEventType
  description: string
  actor: string
  timestamp: string
}

export interface InvestigationDetails extends InvestigationRecord {
  problemStatement: string
  whySteps: WhyStep[]
  rootCause: RootCause | null
  correctiveAction: CorrectiveAction | null
  preventiveAction: PreventiveAction | null
  timeline: InvestigationEvent[]
  attachments: AuditAttachment[]
}
