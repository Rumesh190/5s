import { describe, expect, it, vi } from "vitest";

import { DEMO_USERS } from "@/lib/current-user";
import type { ContinuousImprovement } from "@/features/five-s/continuous-improvement/types";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

async function store(localStorage = storage()) {
  vi.resetModules();
  vi.stubGlobal("window", { localStorage, alert: vi.fn() });
  vi.stubGlobal("localStorage", window.localStorage);
  vi.stubGlobal("crypto", { randomUUID: () => "test-uuid" });
  return import("@/features/five-s/continuous-improvement/store");
}

describe("Continuous Improvement permissions", () => {
  it("recognizes configured zone members and visibility roles", async () => {
    const { canSeeImprovement, isZoneMember } = await store();
    expect(isZoneMember(DEMO_USERS.responsible)).toBe(true);
    expect(isZoneMember(DEMO_USERS.leader)).toBe(false);
    const item = {
      zoneLeaderId: DEMO_USERS.leader.id,
      proposedById: DEMO_USERS.responsible.id,
      memberIds: [DEMO_USERS.responsible.id],
    } as ContinuousImprovement;
    expect(canSeeImprovement(item, DEMO_USERS.leader)).toBe(true);
    expect(canSeeImprovement(item, DEMO_USERS.responsible)).toBe(true);
    expect(canSeeImprovement(item, DEMO_USERS.auditor)).toBe(false);
  });

  it("allows a zone member to create and rejects a zone leader", async () => {
    const { createImprovement } = await store();
    const input = { title: "Improve", issueDescription: "Issue", proposedSaving: 1, estimatedTime: 1, estimatedTimeUnit: "Hours" as const, memberIds: [], existingPhotos: [] };
    expect(createImprovement(input, DEMO_USERS.responsible)).toMatchObject({ status: "submitted", zone: "Zone B" });
    expect(() => createImprovement(input, DEMO_USERS.leader)).toThrow("Only Zone Members");
  });

  it("allows only the zone leader to review a submitted proposal", async () => {
    const { createImprovement, reviewImprovement } = await store();
    const item = createImprovement({ title: "Improve", issueDescription: "Issue", proposedSaving: 1, estimatedTime: 1, estimatedTimeUnit: "Hours", memberIds: [], existingPhotos: [] }, DEMO_USERS.responsible);
    expect(item).not.toBeNull();
    expect(() => reviewImprovement(item!.id, "approved", "Proceed", DEMO_USERS.responsible)).toThrow("not permitted");
    expect(() => reviewImprovement(item!.id, "approved", "Proceed", DEMO_USERS.leader)).not.toThrow();
  });

  it("persists proposal evidence for the Zone Leader after a reload", async () => {
    const localStorage = storage();
    const evidence = [{
      id: "existing-photo-1",
      name: "assembly-rack-before.jpg",
      url: "data:image/jpeg;base64,before-condition",
      uploadedAt: "2026-09-02T10:00:00.000Z",
      uploadedBy: DEMO_USERS.responsible.name,
    }];
    const { createImprovement } = await store(localStorage);
    const created = createImprovement({ title: "Improve rack", issueDescription: "Long retrieval walk", proposedSaving: 1000, estimatedTime: 2, estimatedTimeUnit: "Hours", memberIds: [], existingPhotos: evidence }, DEMO_USERS.responsible);

    expect(created?.existingPhotos).toEqual(evidence);

    const reloadedStore = await store(localStorage);
    const retrieved = reloadedStore.getImprovementById(created!.id);
    expect(retrieved?.existingPhotos).toEqual(evidence);
    expect(reloadedStore.canSeeImprovement(retrieved!, DEMO_USERS.leader)).toBe(true);
  });
});
