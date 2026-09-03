import { beforeEach, describe, expect, it } from "vitest";

import type { MyAction } from "@/features/five-s/types/my-actions";
import {
  assignActionToZoneMember,
  closeReviewedAction,
  getActionById,
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
    expect(assignActionToZoneMember("ACT-TEST", stranger, responsible.id)).toBeUndefined();
    expect(assignActionToZoneMember("ACT-TEST", leader, responsible.id)).toMatchObject({
      status: "Assigned",
      responsiblePersonId: responsible.id,
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
    expect(submitActionForReview("ACT-TEST", responsible, validResolution())?.status).toBe("Pending Auditor Review");
  });

  it("allows the creator to send back and the responsible member to resubmit", () => {
    const creator = { id: "USR-LAKSHMAN", name: "Lakshman" };
    setActions([action({
      status: "Pending Auditor Review",
      assignedTo: responsible.name,
      responsiblePersonId: responsible.id,
      evidence: [{ id: "EV", name: "after", type: "image", uploadedAt: "2026-08-31", uploadedBy: responsible.name }],
    })]);
    expect(sendActionBack("ACT-TEST", stranger, "Revise")).toBeUndefined();
    expect(sendActionBack("ACT-TEST", creator, "Revise")?.status).toBe("Rework Required");
    expect(submitActionForReview("ACT-TEST", responsible, validResolution())).toMatchObject({
      status: "Pending Auditor Review",
      activityHistory: expect.arrayContaining([expect.objectContaining({ type: "resubmitted" })]),
    });
  });

  it("allows only the creator to close a reviewed action", () => {
    const creator = { id: "USR-LAKSHMAN", name: "Lakshman" };
    setActions([action({
      status: "Pending Auditor Review",
      assignedTo: responsible.name,
      responsiblePersonId: responsible.id,
    })]);
    expect(closeReviewedAction("ACT-TEST", stranger)).toBeUndefined();
    expect(closeReviewedAction("ACT-TEST", creator)).toMatchObject({
      status: "Completed",
      reviewedBy: creator.name,
    });
  });

  it("characterizes the store's legacy missing-auditor creator fallback", () => {
    setActions([action({ status: "Pending Review", createdByUserId: undefined, auditor: undefined })]);
    expect(closeReviewedAction("ACT-TEST", stranger)?.status).toBe("Completed");
    expect(getActionById("ACT-TEST")?.reviewedBy).toBe(stranger.name);
  });
});
