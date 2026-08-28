export type MyActionStatus =
  | "Awaiting Assignment"
  | "Assigned"
  | "Open"
  | "In Progress"
  | "Overdue"
  | "Pending Review"
  | "Pending Auditor Review"
  | "Awaiting Review"
  | "Rework Required"
  | "Completed";

export type MyActionActivityType =
  | "created"
  | "awaiting_assignment"
  | "assigned"
  | "started"
  | "submitted"
  | "resubmitted"
  | "reviewed"
  | "sent_back"
  | "closed";

export interface MyActionActivity {
  id: string;
  type: MyActionActivityType;
  actorId: string;
  actorName: string;
  createdAt: string;
  remark?: string;
}

export type MyActionPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type MyActionSource =
  "5S Audit";

export interface MyActionEvidence {
  id: string;
  /** Action-level ownership metadata; optional for legacy evidence. */
  actionId?: string;
  evidenceType?: "finding" | "resolution";
  name: string;

  type:
    | "image"
    | "document";

  uploadedAt: string;
  uploadedBy: string;
  mimeType?: string;

  url?: string;
}

export interface MyAction {
  id: string;

  /** Stable audit link for newly created actions; legacy records use sourceTitle. */
  auditId?: string;
  questionId?: string;
  questionText?: string;
  sectionId?: string;
  zoneId?: string;

  title: string;
  description: string;

  source: MyActionSource;
  sourceTitle: string;

  category?: string;

  /** Operational classification selected when the action is created. */
  actionCategory?: string;
  /** Resolution classification selected by the responsible member. */
  correctiveActionCategory?: string;
  improvementTheme?: string;
  improvementClassification?: "Basic Improvement" | "Improvement Case" | "Trouble / Corrective Case";
  originalFinding?: string;

  plant: string;
  department: string;
  area: string;

  assignedTo: string;

  responsiblePersonId?: string;
  responsiblePersonName?: string;
  zoneLeaderId?: string;
  zoneLeaderName?: string;
  assignedByUserId?: string;
  assignedByName?: string;
  assignedAt?: string;
  createdByUserId?: string;
  createdByName?: string;

  /**
   * Auditor responsible for verifying the completed action.
   * Optional so existing/demo actions continue to work.
   */
  auditor?: string;

  status: MyActionStatus;
  priority: MyActionPriority;

  dueDate: string;
  createdAt: string;

  /**
   * Description entered by the responsible person
   * before submitting the action for auditor review.
   */
  actionTakenDescription?: string;
  resolutionObservation?: string;
  costSaving?: number;
  currency?: string;

  /**
   * Date the responsible person submitted the action
   * to the auditor for verification.
   */
  submittedForReviewAt?: string;

  /**
   * Final auditor verification details.
   */
  reviewedAt?: string;
  reviewedBy?: string;

  completedAt?: string;
  completedByUserId?: string;
  completedByName?: string;
  reviewHistory?: MyActionActivity[];
  activityHistory?: MyActionActivity[];

  /**
   * Evidence captured when the issue was originally
   * identified during the audit.
   *
   * Used as BEFORE evidence in the closure report.
   */
  issueEvidence?: MyActionEvidence[];

  /**
   * Evidence uploaded by the action owner when
   * completing the corrective action.
   *
   * Used as AFTER evidence in the closure report.
   */
  evidence: MyActionEvidence[];
}
