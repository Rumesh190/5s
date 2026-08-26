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
  | "Fail"
  | "NA";

export type FiveSActionStatus =
  | "Open"
  | "In Progress"
  | "Completed"
  | "Overdue";

/* =========================================================
   EVIDENCE
   ========================================================= */

export interface FiveSEvidence {
  id: string;
  name: string;

  type:
    | "image"
    | "document";

  size: number;

  dataUrl: string;

  uploadedAt: string;

  uploadedBy: string;
}

/* =========================================================
   QUESTION
   ========================================================= */

export interface FiveSQuestion {
  id: string;

  category: FiveSCategory;

  question: string;

  description?: string;

  maxScore: number;

  score: number | null;

  status: FiveSQuestionStatus;

  observation?: string;

  evidence?: FiveSEvidence[];

  actionRequired: boolean;

  actionId?: string;
}

/* =========================================================
   SECTION
   ========================================================= */

export interface FiveSSection {
  category: FiveSCategory;

  description: string;

  questions: FiveSQuestion[];

  score: number;

  maxScore: number;
}

/* =========================================================
   AUDIT
   ========================================================= */

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

/* =========================================================
   ACTION
   ========================================================= */

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

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

  dueDate: string;

  createdAt: string;

  completedAt?: string;

  evidence?: FiveSEvidence[];
}