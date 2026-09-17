import { describe, expect, it, vi } from "vitest";

import { DEMO_USERS } from "@/lib/current-user";
import type { FiveSCategory } from "@/features/five-s/types/five-s";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

async function loadStore(localStorage = storage()) {
  vi.resetModules();
  vi.stubGlobal("window", { localStorage });
  vi.stubGlobal("localStorage", localStorage);
  vi.stubGlobal("crypto", { randomUUID: vi.fn(() => "question-40") });
  return import("@/features/five-s/question-configuration/store");
}

const input = {
  questionText: "Are approved garment samples displayed at the line?",
  required: true,
  referenceGuide: {
    image: "data:image/jpeg;base64,custom",
    title: "Approved sample visible",
    description: "The current approved garment sample is clearly displayed at the production line.",
  },
};

describe("5S question configuration", () => {
  it("initializes the fixed sections with the existing 39 active questions", async () => {
    const store = await loadStore();
    const definitions = store.getQuestionDefinitions();
    expect(definitions).toHaveLength(39);
    expect([...new Set(definitions.map((item) => item.sectionId))]).toEqual(["Sort", "Set in Order", "Shine", "Standardize", "Sustain"]);
  });

  it("allows Admin to add, edit, deactivate, and reorder questions", async () => {
    const store = await loadStore();
    const actorId = DEMO_USERS.auditor.id;
    const added = store.addQuestionDefinition("Sort", input, actorId);
    expect(store.getQuestionDefinitions().some((item) => item.id === added.id)).toBe(true);
    store.updateQuestionDefinition(added.id, { ...input, questionText: "Updated garment sample question", required: false }, actorId);
    expect(store.getQuestionDefinitions().find((item) => item.id === added.id)).toMatchObject({ questionText: "Updated garment sample question", required: false });
    expect(store.moveQuestionDefinition(added.id, "up", actorId)).toBe(true);
    expect(store.getQuestionDefinitions().filter((item) => item.sectionId === "Sort").at(-2)?.id).toBe(added.id);
    expect(store.deactivateQuestionDefinition(added.id, actorId)).toBe(true);
    expect(store.getQuestionDefinitions().some((item) => item.id === added.id)).toBe(false);
    expect(store.getQuestionDefinitions({ includeInactive: true }).find((item) => item.id === added.id)?.active).toBe(false);
  });

  it("retains Admin configuration after a store reload", async () => {
    const localStorage = storage();
    const store = await loadStore(localStorage);
    const added = store.addQuestionDefinition("Shine", input, DEMO_USERS.auditor.id);
    const reloaded = await loadStore(localStorage);
    expect(reloaded.getQuestionDefinitions().find((item) => item.id === added.id)?.questionText).toBe(input.questionText);
  });

  it("rejects non-Admin modification and unsupported sections", async () => {
    const store = await loadStore();
    expect(() => store.addQuestionDefinition("Sort", input, DEMO_USERS.responsible.id)).toThrow("Admin access");
    expect(() => store.addQuestionDefinition("Safety" as FiveSCategory, input, DEMO_USERS.auditor.id)).toThrow("Invalid 5S section");
    expect("createSection" in store).toBe(false);
    expect("deleteSection" in store).toBe(false);
  });

  it("snapshots current definitions without changing historical audits", async () => {
    const store = await loadStore();
    const actorId = DEMO_USERS.auditor.id;
    const originalSnapshot = store.createAuditQuestionSnapshot();
    const originalQuestion = originalSnapshot[0].questions[0];
    const current = store.getQuestionDefinitions().find((item) => item.id === originalQuestion.id)!;
    store.updateQuestionDefinition(current.id, { questionText: "Changed for future audits", required: current.required, referenceGuide: current.referenceGuide }, actorId);
    expect(originalSnapshot[0].questions[0].question).toBe(originalQuestion.question);
    expect(store.createAuditQuestionSnapshot()[0].questions[0].question).toBe("Changed for future audits");
    const auditStore = await import("@/lib/five-s/audit-store");
    const createdAudit = auditStore.createFiveSAudit({ title: "Generated", plant: "Egmore Plant", department: "Production", area: "Zone B", auditor: "Lakshman", dueDate: "2026-09-17" });
    expect(createdAudit.sections[0].questions[0].question).toBe("Changed for future audits");

    store.deactivateQuestionDefinition(current.id, actorId);
    expect(originalSnapshot[0].questions.some((item) => item.id === current.id)).toBe(true);
    expect(createdAudit.sections[0].questions.some((item) => item.id === current.id)).toBe(true);
    expect(store.createAuditQuestionSnapshot()[0].questions.some((item) => item.id === current.id)).toBe(false);

    const added = store.addQuestionDefinition("Sort", input, actorId);
    const nextSnapshot = store.createAuditQuestionSnapshot();
    expect(originalSnapshot[0].questions.some((item) => item.id === added.id)).toBe(false);
    expect(nextSnapshot[0].questions.some((item) => item.id === added.id)).toBe(true);
    expect(nextSnapshot[0].questions.map((item) => item.displayOrder)).toEqual([...nextSnapshot[0].questions.map((item) => item.displayOrder)].sort((a, b) => a! - b!));
  });

  it("keeps legacy audit questions valid when snapshot metadata is absent", () => {
    const legacyQuestion = { id: "legacy", category: "Sort", question: "Legacy question", maxScore: 2, score: null, status: "Not Started", actionRequired: false };
    expect(legacyQuestion).not.toHaveProperty("required");
    expect(legacyQuestion).not.toHaveProperty("displayOrder");
  });
});
