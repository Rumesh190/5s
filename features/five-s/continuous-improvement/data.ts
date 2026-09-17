import type { ContinuousImprovement } from "./types";

export const CONTINUOUS_IMPROVEMENT_DEMO_DATA: ContinuousImprovement[] = [{
  id: "CI-EGM-ZB-001", plant: "Egmore Plant", zone: "Zone B", zoneCode: "ZB", zoneLeaderId: "USR-RUMESH", zoneLeaderName: "Rumesh",
  title: "Reduce material retrieval time near assembly rack", issueDescription: "Operators walk approximately 20 metres to retrieve frequently used fasteners, increasing assembly cycle time.",
  proposedSaving: 10000, estimatedTime: 2, estimatedTimeUnit: "Hours", proposedById: "USR-SIVA-KUMAR", proposedByName: "Siva Kumar", memberIds: ["USR-SIVA-KUMAR", "USR-RAMAN"], memberNames: ["Siva Kumar", "Raman"], status: "completed",
  createdAt: "2026-08-27T08:45:00+05:30", submittedAt: "2026-08-27T09:00:00+05:30", reviewedAt: "2026-08-27T10:15:00+05:30", reviewedById: "USR-RUMESH", reviewedByName: "Rumesh", reviewRemark: "Approved. Move the frequently used material closer to the workstation and maintain clear min/max stock levels.",
  actionTaken: "Moved frequently used fasteners to a labelled rack beside the workstation and introduced min/max inventory markings.", actualSaving: 8600, evidence: [{ id: "CI-EV-001", name: "Completed improvement", url: "/demo-5s/good-example.png", uploadedAt: "2026-08-27T14:15:00+05:30", uploadedBy: "Siva Kumar" }], startedAt: "2026-08-27T10:30:00+05:30", completedAt: "2026-08-27T14:30:00+05:30", completedById: "USR-SIVA-KUMAR", completedByName: "Siva Kumar",
  timeline: [
    { id: "CIH-1", type: "created", actorId: "USR-SIVA-KUMAR", actorName: "Siva Kumar", at: "2026-08-27T08:45:00+05:30" },
    { id: "CIH-2", type: "submitted", actorId: "USR-SIVA-KUMAR", actorName: "Siva Kumar", at: "2026-08-27T09:00:00+05:30" },
    { id: "CIH-3", type: "approved", actorId: "USR-RUMESH", actorName: "Rumesh", at: "2026-08-27T10:15:00+05:30", remark: "Approved. Move the frequently used material closer to the workstation and maintain clear min/max stock levels." },
    { id: "CIH-4", type: "started", actorId: "USR-SIVA-KUMAR", actorName: "Siva Kumar", at: "2026-08-27T10:30:00+05:30" },
    { id: "CIH-5", type: "completed", actorId: "USR-SIVA-KUMAR", actorName: "Siva Kumar", at: "2026-08-27T14:30:00+05:30" },
  ],
}];
