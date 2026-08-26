import type { AuditRecord, AuditSeverity } from "@/types/audit"

export type FindingStatus = "Open" | "In Progress" | "Resolved" | "Closed"

export interface Finding {
  id: string
  title: string
  severity: AuditSeverity
  status: FindingStatus
  owner: string
  dueDate: string
  progress: number
}

export interface ChecklistItem {
  id: string
  category: string
  label: string
  checked: boolean
}

export type AttachmentType = "image" | "document" | "pdf"

export interface AuditAttachment {
  id: string
  name: string
  type: AttachmentType
  sizeLabel: string
  uploadedBy: string
  uploadedAt: string
}

export type ActivityEventType =
  | "Audit Created"
  | "Status Changed"
  | "User Assigned"
  | "Investigation Updated"
  | "Corrective Action Added"
  | "Attachment Uploaded"
  | "Audit Closed"
  | "Comment Added"

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  description: string
  actor: string
  timestamp: string
}

export interface RelatedInvestigation {
  id: string
  title: string
  status: string
  severity: AuditSeverity
}

/** Everything the Audit Details page needs, layered on top of the Audit
 * List's base AuditRecord so both features describe the same underlying audit. */
export interface AuditDetails extends AuditRecord {
  productionLine: string
  productName?: string
  city: string
  reportedBy: string
  assignedInvestigator?: string
  dueDate?: string
  problemStatement?: string
  immediateAction?: string
  checklist: ChecklistItem[]
  findings: Finding[]
  attachments: AuditAttachment[]
  activity: ActivityEvent[]
  relatedInvestigations: RelatedInvestigation[]
}
