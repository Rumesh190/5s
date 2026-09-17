import { beforeEach, describe, expect, it } from "vitest";

import type { MyAction } from "@/features/five-s/types/my-actions";
import {
  addActionEvidence,
  assignActionToZoneMember,
  closeReviewedAction,
  getActionById,
  normalizeLegacyActionStatus,
  sendActionBack,
  setActions,
  startAssignedAction,
  submitActionForReview,
} from "@/lib/actions/action-store";

const leader = { id: "USR-RUMESH", name: "Rumesh" };
const responsible = { id: "USR-SIVA-KUMAR", name: "Siva Kumar" };
const stranger = { id: "USR-STRANGER", name: "Stranger" };

function action(overrides: Partial<MyAction> = {}): MyAction {
  return {
    id: "ACT-TEST",
    title: "Test action",
    description: "Test",
    source: "5S Audit",
    sourceTitle: "5S-EGM-ZB-001",
    plant: "Egmore Plant",
    department: "Production",
    area: "Zone B",
    assignedTo: "",
    zoneLeaderId: leader.id,
    zoneLeaderName: leader.name,
    createdByUserId: "USR-LAKSHMAN",
    createdByName: "Lakshman",
    auditor: "Lakshman",
    status: "Awaiting Assignment",
    priority: "Medium",
    dueDate: "2026-09-02",
    createdAt: "2026-08-31",
    evidence: [],
    ...overrides,
  };
}

function validResolution() {
  return { observation: "Corrected", correctiveActionCategory: "Communication", costSaving: 0 };
}

describe("authoritative action-store transitions", () => {
  beforeEach(() => setActions([action()]));

  it("allows only the configured zone leader to assign a waiting action", () => {
    const assignment = { memberId: responsible.id, actionPlan: "Move the fabric bundles to WIP Rack B02." };
    expect(assignActionToZoneMember("ACT-TEST", stranger, assignment)).toBeUndefined();
    expect(assignActionToZoneMember("ACT-TEST", leader, assignment)).toMatchObject({
      status: "Assigned",
      responsiblePersonId: responsible.id,
      actionPlan: assignment.actionPlan,
    });
  });

  it("preserves the auditor proposal when the Zone Leader edits the final action plan", () => {
    const proposedAction = "Move the fabric bundles to the designated WIP storage area.";
    const actionPlan = "Move all fabric bundles to WIP Rack B02 and maintain the marked pedestrian walkway clear at all times.";
    setActions([action({
      originalFinding: "Fabric bundles are stored in the marked walkway.",
      proposedAction,
      proposedActionByUserId: "USR-LAKSHMAN",
      proposedActionByName: "Lakshman",
      proposedActionAt: "2026-09-17T09:00:00.000Z",
      actionPlan: proposedAction,
    })]);

    const assigned = assignActionToZoneMember("ACT-TEST", leader, { memberId: responsible.id, actionPlan });

    expect(assigned).toMatchObject({
      proposedAction,
      proposedActionByName: "Lakshman",
      actionPlan,
      actionPlanEditedByUserId: leader.id,
      actionPlanEditedByName: leader.name,
      responsiblePersonId: responsible.id,
    });
    expect(getActionById("ACT-TEST")?.proposedAction).toBe(proposedAction);
  });

  it("uses the auditor proposal unchanged when the Zone Leader does not edit it", () => {
    const proposedAction = "Move the fabric bundles to the designated WIP storage area.";
    setActions([action({ proposedAction, actionPlan: proposedAction })]);
    expect(assignActionToZoneMember("ACT-TEST", leader, { memberId: responsible.id, actionPlan: proposedAction })).toMatchObject({
      actionPlan: proposedAction,
      actionPlanEditedByUserId: undefined,
    });
  });

  it("keeps legacy actions assignable by using their description as the initial plan", () => {
    setActions([action({ proposedAction: undefined, actionPlan: undefined, description: "Legacy corrective action" })]);
    expect(assignActionToZoneMember("ACT-TEST", leader, { memberId: responsible.id, actionPlan: "Legacy corrective action" })).toMatchObject({
      status: "Assigned",
      actionPlan: "Legacy corrective action",
    });
  });

  it("allows the responsible member, but not another actor, to start", () => {
    setActions([action({ status: "Assigned", assignedTo: responsible.name, responsiblePersonId: responsible.id })]);
    expect(startAssignedAction("ACT-TEST", stranger)).toBeUndefined();
    expect(startAssignedAction("ACT-TEST", responsible)?.status).toBe("In Progress");
  });

  it("requires responsibility, resolution fields, and evidence before submission", () => {
    setActions([action({
      status: "In Progress",
      assignedTo: responsible.name,
      responsiblePersonId: responsible.id,
      evidence: [{ id: "EV", name: "after", type: "image", uploadedAt: "2026-08-31", uploadedBy: responsible.name }],
    })]);
    expect(submitActionForReview("ACT-TEST", stranger, validResolution())).toBeUndefined();
    expect(submitActionForReview("ACT-TEST", responsible, validResolution())?.status).toBe("Awaiting Review");
  });

  it("stores an After photo as resolution evidence without replacing the Before evidence", () => {
    const before = { id: "BEFORE", name: "Before photo.jpg", type: "image" as const, evidenceType: "finding" as const, uploadedAt: "2026-08-31", uploadedBy: "Lakshman", url: "data:image/jpeg;base64,before" };
    setActions([action({ issueEvidence: [before], status: "In Progress", assignedTo: responsible.name, responsiblePersonId: responsible.id })]);

    const updated = addActionEvidence("ACT-TEST", {
      id: "AFTER",
      name: "After photo.jpg",
      type: "image",
      evidenceType: "resolution",
      mimeType: "image/jpeg",
      uploadedAt: "2026-09-17T10:00:00.000Z",
      uploadedBy: responsible.name,
      url: "data:image/jpeg;base64,after",
    });

    expect(updated?.issueEvidence).toEqual([expect.objectContaining({ ...before, actionId: "ACT-TEST" })]);
    expect(updated?.evidence).toEqual([
      expect.objectContaining({ id: "AFTER", evidenceType: "resolution", url: "data:image/jpeg;base64,after" }),
    ]);
  });

  it("allows only the Zone Leader to return work and the responsible member to resubmit", () => {
    const auditor = { id: "USR-LAKSHMAN", name: "Lakshman" };
    setActions([action({
      status: "Awaiting Review",
      assignedTo: responsible.name,
      responsiblePersonId: responsible.id,
      evidence: [{ id: "EV", name: "after", type: "image", uploadedAt: "2026-08-31", uploadedBy: responsible.name }],
    })]);
    expect(sendActionBack("ACT-TEST", stranger, "Revise")).toBeUndefined();
    expect(sendActionBack("ACT-TEST", auditor, "Revise")).toBeUndefined();
    expect(sendActionBack("ACT-TEST", responsible, "Revise")).toBeUndefined();
    expect(sendActionBack("ACT-TEST", leader, "Revise")).toMatchObject({
      status: "Rework Required",
      reviewComment: "Revise",
      reviewHistory: expect.arrayContaining([expect.objectContaining({ actorName: leader.name, actorRole: "Zone Leader", remark: "Revise" })]),
    });
    expect(submitActionForReview("ACT-TEST", responsible, validResolution())).toMatchObject({
      status: "Awaiting Review",
      activityHistory: expect.arrayContaining([
        expect.objectContaining({ type: "resubmitted", actorRole: "Zone Member" }),
        expect.objectContaining({ type: "review_requested", actorId: leader.id, actorName: leader.name, actorRole: "Zone Leader" }),
      ]),
    });
  });

  it("allows only the Zone Leader to approve and close a reviewed action", () => {
    const auditor = { id: "USR-LAKSHMAN", name: "Lakshman" };
    setActions([action({
      status: "Awaiting Review",
      assignedTo: responsible.name,
      responsiblePersonId: responsible.id,
    })]);
    expect(closeReviewedAction("ACT-TEST", stranger)).toBeUndefined();
    expect(closeReviewedAction("ACT-TEST", auditor)).toBeUndefined();
    expect(closeReviewedAction("ACT-TEST", responsible)).toBeUndefined();
    expect(closeReviewedAction("ACT-TEST", leader)).toMatchObject({
      status: "Completed",
      reviewedBy: leader.name,
      reviewedByRole: "Zone Leader",
      closedBy: leader.name,
      closedByRole: "Zone Leader",
      reviewedAt: expect.any(String),
      closedAt: expect.any(String),
      activityHistory: expect.arrayContaining([
        expect.objectContaining({ type: "reviewed", actorRole: "Zone Leader" }),
        expect.objectContaining({ type: "closed", actorRole: "Zone Leader" }),
      ]),
    });
  });

  it("uses the canonical zone relationship instead of stale stored reviewer metadata", () => {
    const staleLeader = { id: "USR-OLD-LEADER", name: "Old Leader" };
    setActions([action({
      status: "Awaiting Review",
      zoneLeaderId: staleLeader.id,
      zoneLeaderName: staleLeader.name,
      assignedTo: responsible.name,
      responsiblePersonId: responsible.id,
    })]);

    expect(closeReviewedAction("ACT-TEST", staleLeader)).toBeUndefined();
    expect(closeReviewedAction("ACT-TEST", leader)).toMatchObject({
      status: "Completed",
      reviewedBy: leader.name,
      closedBy: leader.name,
    });
  });

  it("does not grant legacy actions creator-based closure authority", () => {
    setActions([action({ status: "Awaiting Review", createdByUserId: undefined, auditor: undefined, zoneLeaderId: undefined, zoneLeaderName: undefined })]);
    expect(closeReviewedAction("ACT-TEST", stranger)).toBeUndefined();
    expect(closeReviewedAction("ACT-TEST", leader)?.status).toBe("Completed");
  });

  it("normalizes legacy auditor-review status names at the persistence boundary", () => {
    expect(normalizeLegacyActionStatus("Pending Review")).toBe("Awaiting Review");
    expect(normalizeLegacyActionStatus("Pending Auditor Review")).toBe("Awaiting Review");
    expect(normalizeLegacyActionStatus("In Progress")).toBe("In Progress");
  });
});
