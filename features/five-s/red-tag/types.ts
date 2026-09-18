export const RED_TAG_REASONS = [
  "Undefined Items", "Mix Up", "Same Material in Different Areas", "No Material Labelling",
  "No Quantity Mentioned", "Unclean Area", "Waste", "Others",
] as const;

export const RED_TAG_SECTIONS = [
  "Production", "Assembly", "Quality", "Maintenance", "Stores", "Warehouse", "Utilities", "Office", "Other",
] as const;

export type RedTagStatus = "Open" | "Assigned" | "In Progress" | "Awaiting Review" | "Rework Required" | "Closed";
export type RedTagDisplayStatus = "Raised" | "In Progress" | "Awaiting Review" | "Rework Required" | "Closed";
export type RedTagPriority = "Low" | "Medium" | "High" | "Critical";
export type RedTagReason = (typeof RED_TAG_REASONS)[number];

export function getRedTagDisplayStatus(status: RedTagStatus): RedTagDisplayStatus {
  if (status === "Open") return "Raised";
  if (status === "Assigned") return "In Progress";
  return status;
}

export interface RedTagHistoryEvent {
  id: string;
  type: "created" | "printed" | "planned" | "assigned" | "started" | "submitted" | "resubmitted" | "rework" | "closed";
  label: string;
  actor: string;
  actorRole?: "Auditor" | "Zone Leader" | "Zone Member";
  at: string;
  comment?: string;
}

export interface RedTag {
  id: string;
  tagNumber: string;
  plant: string;
  zone: string;
  section: string;
  itemName: string;
  quantity: number;
  reason: RedTagReason;
  customReason?: string;
  remarks: string;
  requiredAction: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
  targetDate: string;
  status: RedTagStatus;
  createdById: string;
  createdByName: string;
  createdAt: string;
  imageUrl?: string;
  history: RedTagHistoryEvent[];
  /** New closure workflow fields are optional so legacy localStorage remains readable. */
  actionPlan?: string;
  priority?: RedTagPriority;
  dueDate?: string;
  instructions?: string;
  actionId?: string;
  zoneLeaderId?: string;
  zoneLeaderName?: string;
  assignedById?: string;
  assignedByName?: string;
  assignedAt?: string;
  closureImageUrl?: string;
  closureEvidenceHistory?: Array<{ imageUrl: string; comment: string; submittedByName: string; submittedAt: string }>;
  completionComment?: string;
  submittedById?: string;
  submittedByName?: string;
  submittedAt?: string;
  reviewComment?: string;
  reviewedBy?: string;
  reviewedByRole?: "Zone Leader";
  reviewedAt?: string;
  closedBy?: string;
  closedByRole?: "Zone Leader";
  closedAt?: string;
}
