export type FiveSCategory =
  | "Sort"
  | "Set in Order"
  | "Shine"
  | "Standardize"
  | "Sustain";

export type FiveSAuditStatus =
  | "Draft"
  | "In Progress"
  | "Completed";

export type FiveSQuestionStatus =
  | "Not Started"
  | "Pass"
  | "Fail";

export type FiveSActionStatus =
  | "Open"
  | "In Progress"
  | "Completed";

export type FiveSActionPriority =
  | "Low"
  | "Medium"
  | "High";

export interface FiveSEvidence {
  id: string;
  name: string;
  type: "image" | "document";
  uploadedAt: string;
  uploadedBy: string;
}

export interface FiveSQuestion {
  id: string;
  category: FiveSCategory;
  question: string;

  maxScore: number;
  score: number | null;

  status: FiveSQuestionStatus;

  observation?: string;

  actionRequired: boolean;
  actionId?: string;

  evidence: FiveSEvidence[];
}

export interface FiveSSection {
  category: FiveSCategory;
  description: string;

  questions: FiveSQuestion[];

  score: number;
  maxScore: number;
}

export interface FiveSAudit {
  id: string;
  title: string;

  plant: string;
  department: string;
  area: string;

  auditor: string;

  status: FiveSAuditStatus;

  score: number;
  maxScore: number;

  completionPercentage: number;

  startedAt?: string;
  completedAt?: string;
  dueDate: string;

  sections: FiveSSection[];
}

export interface FiveSAction {
  id: string;

  auditId: string;
  auditTitle: string;

  title: string;
  description: string;

  category: FiveSCategory;

  plant: string;
  department: string;
  area: string;

  assignedTo: string;

  status: FiveSActionStatus;
  priority: FiveSActionPriority;

  dueDate: string;
  createdAt: string;
  completedAt?: string;

  evidence: FiveSEvidence[];
}