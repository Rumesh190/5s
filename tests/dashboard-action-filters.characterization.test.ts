import { describe, expect, it } from "vitest";

import type { MyAction } from "@/features/five-s/types/my-actions";
import {
  filterActionsByZoneMember,
  getDashboardZoneMembers,
  getSelectionState,
  hasBeforeAfterEvidence,
  reconcileSelectedActionIds,
  searchNCActions,
  selectActionsByIds,
  toggleAllVisibleActionIds,
} from "@/lib/five-s/dashboard-action-filters";

function action(overrides: Partial<MyAction>): MyAction {
  return {
    id: "ACT-1", title: "Action", description: "Finding", source: "5S Audit", sourceTitle: "AUD-1",
    plant: "Egmore Plant", department: "Production", area: "Zone B", assignedTo: "Siva Kumar",
    responsiblePersonId: "USR-SIVA-KUMAR", responsiblePersonName: "Siva Kumar", status: "In Progress",
    priority: "Medium", dueDate: "2026-09-20", createdAt: "2026-09-17", evidence: [], ...overrides,
  };
}

describe("dashboard Zone Member filtering", () => {
  it("uses canonical members for the selected zone and excludes other zones", () => {
    const members = getDashboardZoneMembers([], "Zone B");
    expect(members.map((member) => member.id)).toContain("USR-SIVA-KUMAR");
    expect(members.some((member) => member.id === "USR-MANOJ-GURU")).toBe(false);
  });

  it("filters by stable responsible-person ID", () => {
    const actions = [action({ id: "SIVA" }), action({ id: "OTHER", responsiblePersonId: "USR-KARTHIK", responsiblePersonName: "Karthik", assignedTo: "Karthik" })];
    const members = getDashboardZoneMembers(actions, "Zone B");
    expect(filterActionsByZoneMember(actions, "USR-SIVA-KUMAR", members).map((item) => item.id)).toEqual(["SIVA"]);
  });

  it("falls back to the responsible name for legacy actions", () => {
    const legacy = action({ id: "LEGACY", responsiblePersonId: undefined });
    const members = getDashboardZoneMembers([legacy], "Zone B");
    expect(filterActionsByZoneMember([legacy], "USR-SIVA-KUMAR", members)).toEqual([legacy]);
  });

  it("limits Before/After records to actions with image evidence", () => {
    const withBefore = action({ issueEvidence: [{ id: "B", name: "Before", type: "image", uploadedAt: "2026-09-17", uploadedBy: "Auditor", url: "data:image/jpeg;base64,before" }] });
    expect(hasBeforeAfterEvidence(withBefore)).toBe(true);
    expect(hasBeforeAfterEvidence(action({}))).toBe(false);
  });

  it("searches only inside the already-filtered NC candidate set", () => {
    const scoped = [action({ id: "NC-ZB-1" }), action({ id: "NC-ZB-2", responsiblePersonName: "Karthik", assignedTo: "Karthik" })];
    expect(searchNCActions(scoped, "Siva").map((item) => item.id)).toEqual(["NC-ZB-1"]);
    expect(searchNCActions(scoped, "Zone A")).toEqual([]);
  });

  it("returns only selected NC records in canonical display order", () => {
    const scoped = [action({ id: "NC-1" }), action({ id: "NC-2" }), action({ id: "NC-3" })];
    expect(selectActionsByIds(scoped, ["NC-3", "NC-1"]).map((item) => item.id)).toEqual(["NC-1", "NC-3"]);
    expect(selectActionsByIds(scoped, [])).toEqual([]);
  });

  it("supports filtered select-all, indeterminate state, deselect-all, and reconciliation", () => {
    const visible = [action({ id: "NC-1" }), action({ id: "NC-2" }), action({ id: "NC-3" })];
    expect(toggleAllVisibleActionIds([], visible)).toEqual(["NC-1", "NC-2", "NC-3"]);
    expect(toggleAllVisibleActionIds(["NC-1", "NC-2", "NC-3"], visible)).toEqual([]);
    expect(getSelectionState(["NC-2"], visible)).toEqual({ selectedCount: 1, allSelected: false, someSelected: true });
    expect(reconcileSelectedActionIds(["NC-1", "HIDDEN"], visible)).toEqual(["NC-1"]);
  });

  it("selects only the records remaining in the active Zone and Zone Member scope", () => {
    const actions = [
      action({ id: "ZONE-B-SIVA" }),
      action({ id: "ZONE-B-KARTHIK", responsiblePersonId: "USR-KARTHIK", responsiblePersonName: "Karthik", assignedTo: "Karthik" }),
      action({ id: "ZONE-A-RITIKA", area: "Zone A", responsiblePersonId: "USR-RITIKA", responsiblePersonName: "Ritika", assignedTo: "Ritika" }),
    ];
    const zoneScoped = actions.filter((item) => item.area === "Zone B");
    const members = getDashboardZoneMembers(zoneScoped, "Zone B");
    const memberScoped = filterActionsByZoneMember(zoneScoped, "USR-SIVA-KUMAR", members);

    expect(toggleAllVisibleActionIds([], zoneScoped)).toEqual(["ZONE-B-SIVA", "ZONE-B-KARTHIK"]);
    expect(toggleAllVisibleActionIds([], memberScoped)).toEqual(["ZONE-B-SIVA"]);
  });
});
