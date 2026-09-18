"use client";

import { useSyncExternalStore } from "react";
import type { DemoUser } from "@/lib/current-user";
import type { RedTag, RedTagHistoryEvent, RedTagPriority } from "./types";
import { readStorageJson, safeSetStorage, STORAGE_FULL_MESSAGE } from "@/lib/browser-storage";
import { createAction, getActions, updateAction } from "@/lib/actions/action-store";
import { getFiveSZoneConfiguration } from "@/lib/five-s/configuration";
import { createNotification } from "@/lib/notifications/notification-store";
import { RED_TAG_DEMO_DATA } from "./data";

const KEY = "five-s-red-tags-v1";
let tags: RedTag[] = [...RED_TAG_DEMO_DATA];
const SERVER_TAGS = RED_TAG_DEMO_DATA;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = readStorageJson<RedTag[]>(KEY);
    if (saved) tags = saved.map((tag) => {
      const legacyStatus = tag.status as string;
      const status = legacyStatus === "Resolved"
        ? "Awaiting Review"
        : legacyStatus === "Awaiting Assignment"
          ? tag.responsiblePersonId || tag.responsiblePersonName ? "In Progress" : "Open"
          : tag.status;
      return { ...tag, status, history: Array.isArray(tag.history) ? tag.history : [] };
    });
  } catch { /* retain demo data */ }
}
function emit() {
  const result = safeSetStorage(KEY, tags);
  if (!result.success) { window.alert(result.reason === "quota" ? STORAGE_FULL_MESSAGE : result.message); return; }
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) { load(); listeners.add(listener); return () => listeners.delete(listener); }
function snapshot() { load(); return tags; }
function serverSnapshot() { return SERVER_TAGS; }

export interface RedTagActor { id: string; name: string }
function event(type: RedTagHistoryEvent["type"], label: string, actor: RedTagActor, actorRole: RedTagHistoryEvent["actorRole"], comment?: string): RedTagHistoryEvent {
  return { id: `RTH-${crypto.randomUUID()}`, type, label, actor: actor.name, actorRole, at: new Date().toISOString(), comment };
}
function replaceTag(id: string, update: (tag: RedTag) => RedTag) {
  load(); let result: RedTag | undefined;
  tags = tags.map((tag) => tag.id === id ? (result = update(tag)) : tag);
  if (result) emit();
  return result;
}
function zoneLeader(tag: RedTag, actor: RedTagActor) { return getFiveSZoneConfiguration(tag.zone)?.leaderId === actor.id; }
function responsible(tag: RedTag, actor: RedTagActor) { return tag.responsiblePersonId === actor.id || (!tag.responsiblePersonId && tag.responsiblePersonName === actor.name); }
function linkedAction(tag: RedTag) { return getActions().find((action) => action.id === tag.actionId || (action.sourceModule === "Red Tag" && action.sourceId === tag.id)); }

export function assignRedTagAction(id: string, actor: RedTagActor, input: { actionPlan: string; memberId: string; dueDate: string; priority: RedTagPriority; instructions?: string }) {
  load(); const tag = tags.find((item) => item.id === id); const zone = tag && getFiveSZoneConfiguration(tag.zone);
  const member = zone?.members.find((item) => item.id === input.memberId); const plan = input.actionPlan.trim();
  if (!tag || !zone || !zoneLeader(tag, actor) || !member || !plan || !input.dueDate || !input.priority || tag.status !== "Open") return undefined;
  const now = new Date().toISOString();
  let action = linkedAction(tag);
  if (!action) action = createAction({
    source: "Red Tag", sourceModule: "Red Tag", sourceId: tag.id, sourceTitle: tag.tagNumber,
    title: `Red Tag: ${tag.itemName}`, description: tag.remarks || tag.requiredAction, originalFinding: tag.remarks,
    proposedAction: tag.requiredAction, actionPlan: plan, plant: tag.plant, department: zone.department, area: tag.zone,
    assignedTo: member.name, responsiblePersonId: member.id, responsiblePersonName: member.name,
    zoneLeaderId: zone.leaderId, zoneLeaderName: zone.leader, assignedByUserId: actor.id, assignedByName: actor.name,
    assignedAt: now, createdByUserId: tag.createdById, createdByName: tag.createdByName, auditor: tag.createdByName,
    status: "In Progress", priority: input.priority, dueDate: input.dueDate,
    issueEvidence: tag.imageUrl ? [{ id: `RTE-${tag.id}`, name: "Original Red Tag photo", type: "image", uploadedAt: tag.createdAt, uploadedBy: tag.createdByName, url: tag.imageUrl }] : [],
    activityHistory: [],
  });
  else updateAction(action.id, { actionPlan: plan, assignedTo: member.name, responsiblePersonId: member.id, responsiblePersonName: member.name, assignedByUserId: actor.id, assignedByName: actor.name, assignedAt: now, priority: input.priority, dueDate: input.dueDate, status: "In Progress" });
  const updated = replaceTag(id, (current) => ({ ...current, status: "In Progress", actionPlan: plan, requiredAction: plan, responsiblePersonId: member.id, responsiblePersonName: member.name, dueDate: input.dueDate, targetDate: input.dueDate, priority: input.priority, instructions: input.instructions?.trim(), actionId: action?.id, zoneLeaderId: zone.leaderId, zoneLeaderName: zone.leader, assignedById: actor.id, assignedByName: actor.name, assignedAt: now, history: [...(current.history ?? []), event("planned", `Action Plan Assigned to ${member.name}`, actor, "Zone Leader")] }));
  if (updated) createNotification({ recipientUserId: member.id, title: "Red Tag action assigned", message: `${tag.tagNumber} · ${tag.itemName} · Due: ${input.dueDate}`, href: `/5s/red/${encodeURIComponent(tag.id)}` });
  return updated;
}

export function saveRedTagClosureEvidence(id: string, actor: RedTagActor, imageUrl: string) {
  load();
  const tag = tags.find((item) => item.id === id);
  if (!tag || !responsible(tag, actor) || !["Assigned", "In Progress", "Rework Required"].includes(tag.status) || !imageUrl) return undefined;
  const action = linkedAction(tag); if (action) updateAction(action.id, { evidence: [...action.evidence, { id: `RTE-CLOSE-${Date.now()}`, actionId: action.id, evidenceType: "resolution", name: "Red Tag closure photo", type: "image", uploadedAt: new Date().toISOString(), uploadedBy: actor.name, url: imageUrl }] });
  return replaceTag(id, (current) => ({ ...current, closureImageUrl: imageUrl }));
}

export function submitRedTagForReview(id: string, actor: RedTagActor, completionComment: string) {
  load();
  const tag = tags.find((item) => item.id === id); const comment = completionComment.trim();
  if (!tag || !responsible(tag, actor) || !["Assigned", "In Progress", "Rework Required"].includes(tag.status) || !tag.actionPlan || !tag.closureImageUrl || !comment) return undefined;
  const now = new Date().toISOString(); const resubmission = tag.status === "Rework Required" || Boolean(tag.submittedAt); const action = linkedAction(tag);
  if (action) updateAction(action.id, { status: "Awaiting Review", actionTakenDescription: comment, resolutionObservation: comment, submittedForReviewAt: now });
  const updated = replaceTag(id, (current) => ({ ...current, status: "Awaiting Review", completionComment: comment, submittedById: actor.id, submittedByName: actor.name, submittedAt: now, closureEvidenceHistory: [...(current.closureEvidenceHistory ?? []), { imageUrl: current.closureImageUrl!, comment, submittedByName: actor.name, submittedAt: now }], history: [...(current.history ?? []), event(resubmission ? "resubmitted" : "submitted", resubmission ? "Closure Evidence Resubmitted" : "Closure Evidence Submitted", actor, "Zone Member")] }));
  const leaderId = getFiveSZoneConfiguration(tag.zone)?.leaderId;
  if (updated && leaderId) createNotification({ recipientUserId: leaderId, title: resubmission ? "Red Tag resubmitted" : "Red Tag ready for review", message: `${tag.tagNumber} · Submitted by ${actor.name}`, href: `/5s/red/${encodeURIComponent(tag.id)}` });
  return updated;
}

export function returnRedTagForRework(id: string, actor: RedTagActor, comment: string) {
  load();
  const tag = tags.find((item) => item.id === id); const remark = comment.trim();
  if (!tag || !zoneLeader(tag, actor) || tag.status !== "Awaiting Review" || !remark) return undefined;
  const action = linkedAction(tag); if (action) updateAction(action.id, { status: "Rework Required", reviewComment: remark });
  const updated = replaceTag(id, (current) => ({ ...current, status: "Rework Required", reviewComment: remark, history: [...(current.history ?? []), event("rework", "Returned for Rework", actor, "Zone Leader", remark)] }));
  if (updated) createNotification({ recipientUserId: tag.responsiblePersonId, title: "Red Tag returned for rework", message: `${tag.tagNumber} · ${remark}`, href: `/5s/red/${encodeURIComponent(tag.id)}` });
  return updated;
}

export function approveAndCloseRedTag(id: string, actor: RedTagActor) {
  load();
  const tag = tags.find((item) => item.id === id);
  if (!tag || !zoneLeader(tag, actor) || tag.status !== "Awaiting Review" || !tag.actionPlan || !tag.responsiblePersonId || !tag.closureImageUrl || !tag.submittedAt) return undefined;
  const now = new Date().toISOString(); const action = linkedAction(tag);
  if (action) updateAction(action.id, { status: "Completed", reviewedBy: actor.name, reviewedByRole: "Zone Leader", reviewedAt: now, closedBy: actor.name, closedByRole: "Zone Leader", closedAt: now, completedAt: now });
  const updated = replaceTag(id, (current) => ({ ...current, status: "Closed", reviewedBy: actor.name, reviewedByRole: "Zone Leader", reviewedAt: now, closedBy: actor.name, closedByRole: "Zone Leader", closedAt: now, history: [...(current.history ?? []), event("closed", "Approved & Closed", actor, "Zone Leader")] }));
  if (updated) createNotification({ recipientUserId: tag.responsiblePersonId, title: "Red Tag approved and closed", message: `${tag.tagNumber} · Closed by ${actor.name}`, href: `/5s/red/${encodeURIComponent(tag.id)}` });
  return updated;
}

export function useRedTags() { return useSyncExternalStore(subscribe, snapshot, serverSnapshot); }
export function getNextTagNumber(zoneCode = "ZA") {
  load();
  const prefix = `RT-EGM-${zoneCode}-`;
  const highest = tags.reduce((max, tag) => tag.tagNumber.startsWith(prefix) ? Math.max(max, Number(tag.tagNumber.slice(-3)) || 0) : max, 0);
  return `${prefix}${String(highest + 1).padStart(3, "0")}`;
}
export function createRedTag(input: Omit<RedTag, "id" | "tagNumber" | "status" | "createdAt" | "history">, user: DemoUser) {
  const zoneCode = input.zone.replace("Zone ", "Z").toUpperCase();
  const tagNumber = getNextTagNumber(zoneCode);
  const createdAt = new Date().toISOString();
  const tag: RedTag = { ...input, id: tagNumber, tagNumber, status: "Open", createdAt, history: [
    { id: `RTH-${crypto.randomUUID()}`, type: "created", label: "Red Tag created", actor: user.name, at: createdAt },
  ] };
  tags = [tag, ...tags]; emit(); return tag;
}
export function markTagPrinted(id: string, user: DemoUser) {
  load();
  const tag = tags.find((item) => item.id === id);
  if (!tag || tag.history.some((event) => event.type === "printed")) return;
  tags = tags.map((item) => item.id === id ? { ...item, history: [...item.history, {
    id: `RTH-${crypto.randomUUID()}`, type: "printed" as const, label: "Tag printed", actor: user.name, at: new Date().toISOString(),
  }] } : item); emit();
}
