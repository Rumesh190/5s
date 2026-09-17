"use client";

import { useSyncExternalStore } from "react";

import { FIVE_S_CATEGORIES, FIVE_S_CATEGORY_DESCRIPTIONS } from "@/features/five-s/data/five-s-data";
import type { FiveSCategory, FiveSSection } from "@/features/five-s/types/five-s";
import { getAdminUser } from "@/features/five-s/administration/store";
import { hasPermission } from "@/features/five-s/administration/permissions";
import { readStorageJson, safeSetStorage } from "@/lib/browser-storage";
import { DEFAULT_QUESTION_DEFINITIONS } from "./data";
import type { QuestionDefinition, QuestionDefinitionInput } from "./types";

export const QUESTION_CONFIGURATION_STORAGE_KEY = "five-s-question-configuration-v1";

let definitions = cloneDefinitions(DEFAULT_QUESTION_DEFINITIONS);
let loaded = false;
const listeners = new Set<() => void>();

function cloneDefinitions(items: QuestionDefinition[]) {
  return items.map((item) => ({ ...item, referenceGuide: { ...item.referenceGuide } }));
}

function isSectionId(value: unknown): value is FiveSCategory {
  return typeof value === "string" && FIVE_S_CATEGORIES.includes(value as FiveSCategory);
}

function normalize(items: QuestionDefinition[]): QuestionDefinition[] {
  const ids = new Set<string>();
  const valid = items.filter((item) => {
    if (!item || typeof item.id !== "string" || !item.id.trim() || ids.has(item.id) || !isSectionId(item.sectionId)) return false;
    if (!item.questionText?.trim() || !item.referenceGuide?.title?.trim() || !item.referenceGuide?.description?.trim() || !item.referenceGuide?.image?.trim()) return false;
    ids.add(item.id);
    return true;
  });
  return FIVE_S_CATEGORIES.flatMap((sectionId) => valid
    .filter((item) => item.sectionId === sectionId)
    .sort((a, b) => Number(b.active !== false) - Number(a.active !== false) || a.displayOrder - b.displayOrder)
    .map((item, index) => ({ ...item, displayOrder: index + 1, required: item.required !== false, active: item.active !== false })));
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const saved = readStorageJson<QuestionDefinition[]>(QUESTION_CONFIGURATION_STORAGE_KEY);
  if (Array.isArray(saved)) {
    const normalized = normalize(saved);
    if (normalized.length > 0) definitions = normalized;
  }
}

function persist(next: QuestionDefinition[]) {
  const previous = definitions;
  definitions = normalize(next);
  const result = safeSetStorage(QUESTION_CONFIGURATION_STORAGE_KEY, definitions);
  if (!result.success) {
    definitions = previous;
    throw new Error(result.message);
  }
  listeners.forEach((listener) => listener());
}

function requireAdmin(actorId: string) {
  const actor = getAdminUser(actorId);
  if (!actor || actor.status !== "Active" || !actor.roles.includes("Admin") || !hasPermission(actor, "administration.manage_questions")) {
    throw new Error("Admin access is required to manage 5S questions.");
  }
}

function validateInput(input: QuestionDefinitionInput) {
  if (!input.questionText.trim()) throw new Error("Question text is required.");
  if (!input.referenceGuide.title.trim()) throw new Error("Reference Guide title is required.");
  if (!input.referenceGuide.description.trim()) throw new Error("Reference Guide description is required.");
  if (!input.referenceGuide.image.trim()) throw new Error("Reference image is required.");
}

function snapshot() { load(); return definitions; }
function subscribe(listener: () => void) { load(); listeners.add(listener); return () => listeners.delete(listener); }

export function useQuestionConfiguration() {
  return useSyncExternalStore(subscribe, snapshot, () => DEFAULT_QUESTION_DEFINITIONS);
}

export function getQuestionDefinitions({ includeInactive = false }: { includeInactive?: boolean } = {}) {
  load();
  const source = includeInactive ? definitions : definitions.filter((item) => item.active);
  return cloneDefinitions(source);
}

export function addQuestionDefinition(sectionId: FiveSCategory, input: QuestionDefinitionInput, actorId: string) {
  requireAdmin(actorId);
  if (!isSectionId(sectionId)) throw new Error("Invalid 5S section.");
  validateInput(input);
  load();
  const randomId = crypto.randomUUID();
  const id = definitions.some((item) => item.id === `Q-CUSTOM-${randomId}`)
    ? `Q-CUSTOM-${randomId}-${Date.now()}`
    : `Q-CUSTOM-${randomId}`;
  if (definitions.some((item) => item.id === id)) throw new Error("Unable to generate a unique question ID.");
  const now = new Date().toISOString();
  const item: QuestionDefinition = {
    id,
    sectionId,
    questionText: input.questionText.trim(),
    required: input.required,
    referenceGuide: {
      image: input.referenceGuide.image.trim(),
      title: input.referenceGuide.title.trim(),
      description: input.referenceGuide.description.trim(),
    },
    displayOrder: definitions.filter((entry) => entry.sectionId === sectionId).length + 1,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  persist([...definitions, item]);
  return item;
}

export function updateQuestionDefinition(id: string, input: QuestionDefinitionInput, actorId: string) {
  requireAdmin(actorId);
  validateInput(input);
  load();
  const current = definitions.find((item) => item.id === id);
  if (!current) throw new Error("Question not found.");
  persist(definitions.map((item) => item.id === id ? {
    ...item,
    questionText: input.questionText.trim(),
    required: input.required,
    referenceGuide: {
      image: input.referenceGuide.image.trim(),
      title: input.referenceGuide.title.trim(),
      description: input.referenceGuide.description.trim(),
    },
    updatedAt: new Date().toISOString(),
  } : item));
  return definitions.find((item) => item.id === id);
}

export function deactivateQuestionDefinition(id: string, actorId: string) {
  requireAdmin(actorId);
  load();
  if (!definitions.some((item) => item.id === id)) throw new Error("Question not found.");
  persist(definitions.map((item) => item.id === id ? { ...item, active: false, updatedAt: new Date().toISOString() } : item));
  return true;
}

export function moveQuestionDefinition(id: string, direction: "up" | "down", actorId: string) {
  requireAdmin(actorId);
  load();
  const item = definitions.find((entry) => entry.id === id);
  if (!item) throw new Error("Question not found.");
  const section = definitions.filter((entry) => entry.sectionId === item.sectionId && entry.active).sort((a, b) => a.displayOrder - b.displayOrder);
  const index = section.findIndex((entry) => entry.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= section.length) return false;
  [section[index], section[targetIndex]] = [section[targetIndex], section[index]];
  const order = new Map(section.map((entry, position) => [entry.id, position + 1]));
  persist(definitions.map((entry) => entry.sectionId === item.sectionId ? { ...entry, displayOrder: order.get(entry.id)!, updatedAt: new Date().toISOString() } : entry));
  return true;
}

export function createAuditQuestionSnapshot(): FiveSSection[] {
  const active = getQuestionDefinitions();
  return FIVE_S_CATEGORIES.map((category) => {
    const questions = active
      .filter((item) => item.sectionId === category)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        id: item.id,
        category,
        question: item.questionText,
        description: "Assess the workplace against the defined 5S requirement.",
        referenceImage: item.referenceGuide.image,
        reference: { ...item.referenceGuide },
        required: item.required,
        displayOrder: item.displayOrder,
        maxScore: 2,
        score: null,
        status: "Not Started" as const,
        observation: "",
        evidence: [],
        actionRequired: false,
      }));
    return {
      category,
      description: FIVE_S_CATEGORY_DESCRIPTIONS[category],
      questions,
      score: 0,
      maxScore: questions.length * 2,
    };
  });
}
