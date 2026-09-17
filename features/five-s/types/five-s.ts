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

export interface FiveSQuestionReference {
  image: string;
  title: string;
  description: string;
}

/* =========================================================
   QUESTION
   ========================================================= */

export interface FiveSQuestion {
  id: string;

  category: FiveSCategory;

  question: string;

  description?: string;

  referenceImage?: string;

  referenceTitleKey?: string;

  referenceGuidanceKey?: string;

  referenceAltKey?: string;

  reference?: FiveSQuestionReference;

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

  completedByUserId?: string;
  completedByName?: string;

  auditorVerification?: {
    auditorId: string;
    auditorName: string;
    capturedAt: string;
    /** Frontend MVP data URL; replaceable with an object-storage URL/key. */
    photo: string;
    /** Frontend MVP data URL; replaceable with an object-storage URL/key. */
    signature: string;
    photoUrl?: string;
    photoObjectStorageKey?: string;
    signatureUrl?: string;
    signatureObjectStorageKey?: string;
  };

  auditorSignature?: {
    userId: string;
    userName: string;
    signedAt: string;
    signatureImage: string;
  };

  dueDate: string;

  sections: FiveSSection[];
}
