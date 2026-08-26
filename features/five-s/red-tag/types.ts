export const RED_TAG_REASONS = [
  "Undefined Items", "Mix Up", "Same Material in Different Areas", "No Material Labelling",
  "No Quantity Mentioned", "Unclean Area", "Waste", "Others",
] as const;

export const RED_TAG_SECTIONS = [
  "Production", "Assembly", "Quality", "Maintenance", "Stores", "Warehouse", "Utilities", "Office", "Other",
] as const;

export type RedTagStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type RedTagReason = (typeof RED_TAG_REASONS)[number];

export interface RedTagHistoryEvent {
  id: string;
  type: "created" | "printed" | "started" | "resolved" | "closed";
  label: string;
  actor: string;
  at: string;
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
}
