import type { FiveSAudit } from "@/features/five-s/types/five-s";
import type { MyActionStatus } from "@/features/five-s/types/my-actions";

export type AuditLifecycleStage = "Start" | "Draft" | "In Progress" | "Completion";
export type ActionLifecycleStage = "Assigned" | "In Progress" | "Submitted for Review" | "Under Review" | "Closed";

export const AUDIT_LIFECYCLE_STAGES: AuditLifecycleStage[] = ["Start", "Draft", "In Progress", "Completion"];
export const ACTION_LIFECYCLE_STAGES: ActionLifecycleStage[] = ["Assigned", "In Progress", "Submitted for Review", "Under Review", "Closed"];

export function getAuditLifecycleStage(audit: FiveSAudit): AuditLifecycleStage {
  if (audit.status === "Completed") return "Completion";
  if (audit.status === "In Progress") return "In Progress";
  return audit.completionPercentage > 0 ? "Draft" : "Start";
}

export function getActionLifecycleStage(status: MyActionStatus): ActionLifecycleStage {
  if (status === "Completed") return "Closed";
  if (["Pending Review", "Awaiting Review"].includes(status)) return "Under Review";
  if (status === "Pending Auditor Review") return "Submitted for Review";
  if (["In Progress", "Overdue", "Rework Required"].includes(status)) return "In Progress";
  return "Assigned";
}
