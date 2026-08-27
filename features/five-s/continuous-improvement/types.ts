export type ImprovementStatus = "draft" | "submitted" | "approved" | "rejected" | "on_hold" | "in_progress" | "completed";
export type TimeUnit = "Hours" | "Days" | "Weeks";

export interface ImprovementEvidence { id: string; name: string; url: string; uploadedAt: string; uploadedBy: string }
export interface ImprovementEvent { id: string; type: "created" | "submitted" | "approved" | "rejected" | "on_hold" | "started" | "completed"; actorId: string; actorName: string; at: string; remark?: string }
export interface ContinuousImprovement {
  id: string; plant: string; zone: string; zoneCode: string; zoneLeaderId: string; zoneLeaderName: string;
  title: string; issueDescription: string; proposedSaving: number; estimatedTime: number; estimatedTimeUnit: TimeUnit;
  existingPhotos?: ImprovementEvidence[];
  proposedById: string; proposedByName: string; memberIds: string[]; memberNames: string[]; status: ImprovementStatus;
  createdAt: string; submittedAt?: string; reviewedAt?: string; reviewedById?: string; reviewedByName?: string; reviewRemark?: string;
  actionTaken?: string; actualSaving?: number; evidence: ImprovementEvidence[]; startedAt?: string; completedAt?: string; completedById?: string; completedByName?: string;
  timeline: ImprovementEvent[];
}
