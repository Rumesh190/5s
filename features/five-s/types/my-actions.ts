export type MyActionStatus =
  | "Awaiting Assignment"
  | "Assigned"
  | "Open"
  | "In Progress"
  | "Overdue"
  | "Awaiting Review"
  | "Rework Required"
  | "Completed";

export type MyActionActivityType =
  | "created"
  | "proposed"
  | "awaiting_assignment"
  | "assigned"
  | "started"
  | "submitted"
  | "resubmitted"
  | "review_requested"
  | "reviewed"
  | "sent_back"
  | "closed";

export interface MyActionActivity {
  id: string;
  type: MyActionActivityType;
  actorId: string;
  actorName: string;
  actorRole?: "Auditor" | "Zone Leader" | "Zone Member";
  createdAt: string;
  remark?: string;
}

export type MyActionPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type MyActionSource = "5S Audit" | "Red Tag";

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
  /** Cross-module origin used to prevent duplicate canonical actions. */
  sourceModule?: "5S Audit" | "Red Tag";
  sourceId?: string;

  category?: string;

  /** Operational classification selected when the action is created. */
  actionCategory?: string;
  /** Record-specific classification required when actionCategory is "Other". */
  customActionCategory?: string;
  /** Resolution classification selected by the responsible member. */
  correctiveActionCategory?: string;
  improvementTheme?: string;
  improvementClassification?: "Basic Improvement" | "Improvement Case" | "Trouble / Corrective Case";
  originalFinding?: string;

  /** Auditor-authored recommendation captured with the finding. */
  proposedAction?: string;
  proposedActionByUserId?: string;
  proposedActionByName?: string;
  proposedActionAt?: string;

  /** Final plan approved by the Zone Leader for the responsible person. */
  actionPlan?: string;
  actionPlanEditedByUserId?: string;
  actionPlanEditedByName?: string;
  actionPlanEditedAt?: string;

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

  /** Legacy creator/auditor identity retained for display and compatibility. */
  auditor?: string;

  status: MyActionStatus;
  priority: MyActionPriority;

  dueDate: string;
  createdAt: string;

  /**
   * Description entered by the responsible person
   * before submitting the action for Zone Leader review.
   */
  actionTakenDescription?: string;
  resolutionObservation?: string;
  costSaving?: number;
  currency?: string;

  /**
   * Date the responsible person submitted the action
   * to the Zone Leader for verification.
   */
  submittedForReviewAt?: string;

  /**
   * Final Zone Leader review and closure details. Role fields are optional for
   * older browser records created before reviewer ownership was normalized.
   */
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByRole?: "Zone Leader";
  reviewComment?: string;
  closedBy?: string;
  closedByRole?: "Zone Leader";
  closedAt?: string;

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
