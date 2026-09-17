"use client";

import { useSyncExternalStore } from "react";
import { createNotification } from "@/lib/notifications/notification-store";
import { getFiveSZoneConfiguration } from "@/lib/five-s/configuration";
import type { DemoUser } from "@/lib/current-user";
import { readStorageJson, safeSetStorage, STORAGE_FULL_MESSAGE } from "@/lib/browser-storage";
import type { ContinuousImprovement, ImprovementEvidence, ImprovementStatus, TimeUnit } from "./types";
import { CONTINUOUS_IMPROVEMENT_DEMO_DATA } from "./data";

const KEY = "five-s-continuous-improvements-v1";
const SERVER_RECORDS = CONTINUOUS_IMPROVEMENT_DEMO_DATA;
let records: ContinuousImprovement[] = [...CONTINUOUS_IMPROVEMENT_DEMO_DATA]; let loaded = false; const listeners = new Set<() => void>();
function load() { if (loaded || typeof window === "undefined") return; loaded = true; const saved = readStorageJson<ContinuousImprovement[]>(KEY); if (Array.isArray(saved)) records = saved; }
function emit() {
  const result = safeSetStorage(KEY, records);
  if (!result.success) { window.alert(result.reason === "quota" ? STORAGE_FULL_MESSAGE : result.message); return false; }
  listeners.forEach((l) => l());
  return true;
}
function subscribe(l: () => void) { load(); listeners.add(l); return () => listeners.delete(l); }
function snapshot() { load(); return records; }
export function useImprovements() { return useSyncExternalStore(subscribe, snapshot, () => SERVER_RECORDS); }
export function getImprovementById(id: string) { load(); return records.find((item) => item.id === id); }
export function isZoneMember(user: DemoUser) { return Boolean(getFiveSZoneConfiguration(user.primaryZone)?.members.some((m) => m.id === user.id)); }
export function canSeeImprovement(item: ContinuousImprovement, user: DemoUser) { return item.zoneLeaderId === user.id || item.proposedById === user.id || item.memberIds.includes(user.id); }
function event(type: ContinuousImprovement["timeline"][number]["type"], user: DemoUser, remark?: string) { return { id: `CIH-${crypto.randomUUID()}`, type, actorId: user.id, actorName: user.name, at: new Date().toISOString(), remark }; }
function update(id: string, fn: (item: ContinuousImprovement) => ContinuousImprovement) { load(); const previous = records; records = records.map((r) => r.id === id ? fn(r) : r); if (!emit()) { records = previous; return false; } return true; }
export function createImprovement(input: { title: string; issueDescription: string; proposedSaving: number; estimatedTime: number; estimatedTimeUnit: TimeUnit; memberIds: string[]; existingPhotos: ImprovementEvidence[] }, user: DemoUser) {
  const zone = getFiveSZoneConfiguration(user.primaryZone); if (!zone || !zone.members.some((m) => m.id === user.id)) throw new Error("Only Zone Members can create improvements.");
  const allowed = new Set(zone.members.map((m) => m.id)); if (input.memberIds.some((id) => !allowed.has(id))) throw new Error("Team members must belong to your Zone.");
  const memberIds = [...new Set([user.id, ...input.memberIds])]; const n = records.reduce((max, r) => r.zoneCode === zone.code ? Math.max(max, Number(r.id.slice(-3)) || 0) : max, 0) + 1; const now = new Date().toISOString(); const id = `CI-EGM-${zone.code}-${String(n).padStart(3, "0")}`;
  const item: ContinuousImprovement = { id, plant: user.plant, zone: zone.name, zoneCode: zone.code, zoneLeaderId: zone.leaderId, zoneLeaderName: zone.leader, title: input.title.trim(), issueDescription: input.issueDescription.trim(), proposedSaving: input.proposedSaving, estimatedTime: input.estimatedTime, estimatedTimeUnit: input.estimatedTimeUnit, existingPhotos: input.existingPhotos, proposedById: user.id, proposedByName: user.name, memberIds, memberNames: memberIds.map((mid) => zone.members.find((m) => m.id === mid)!.name), status: "submitted", createdAt: now, submittedAt: now, evidence: [], timeline: [event("created", user), event("submitted", user)] };
  const previous = records; records = [item, ...records]; if (!emit()) { records = previous; return null; } createNotification({ recipientUserId: zone.leaderId, title: "New Improvement Proposal", message: `${item.title} · Proposed by: ${user.name} · Zone: ${zone.name} · Proposed Saving: ₹${item.proposedSaving.toLocaleString("en-IN")}`, href: `/5s/continuous-improvement/${id}` }); return item;
}
export function reviewImprovement(id: string, decision: Extract<ImprovementStatus, "approved" | "rejected" | "on_hold">, remark: string, user: DemoUser) {
  load();
  const item = records.find((r) => r.id === id); if (!item || item.zoneLeaderId !== user.id || !remark.trim() || !(["submitted", "on_hold"] as ImprovementStatus[]).includes(item.status) || (item.status === "on_hold" && decision === "on_hold")) throw new Error("This review is not permitted.");
  const now = new Date().toISOString(); if (!update(id, (r) => ({ ...r, status: decision, reviewedAt: now, reviewedById: user.id, reviewedByName: user.name, reviewRemark: remark.trim(), timeline: [...r.timeline, event(decision, user, remark.trim())] }))) return;
  for (const recipientUserId of item.memberIds) createNotification({ recipientUserId, title: decision === "approved" ? "Improvement Approved" : decision === "rejected" ? "Improvement Rejected" : "Improvement On Hold", message: `${item.title} · Reviewed by: ${user.name} · Remark: ${remark.trim()}`, href: `/5s/continuous-improvement/${id}` });
}
export function startImprovement(id: string, user: DemoUser) { load(); const item = records.find((r) => r.id === id); if (!item || item.status !== "approved" || !item.memberIds.includes(user.id)) throw new Error("Only the approved team can start this improvement."); const now = new Date().toISOString(); update(id, (r) => ({ ...r, status: "in_progress", startedAt: now, timeline: [...r.timeline, event("started", user)] })); }
export function completeImprovement(id: string, input: { actionTaken: string; actualSaving: number; evidence: ImprovementEvidence[] }, user: DemoUser) { load(); const item = records.find((r) => r.id === id); if (!item || item.status !== "in_progress" || !item.memberIds.includes(user.id) || !input.actionTaken.trim() || !Number.isFinite(input.actualSaving) || input.actualSaving < 0 || !input.evidence.length) throw new Error("Completion requirements are not met."); const now = new Date().toISOString(); if (!update(id, (r) => ({ ...r, status: "completed", actionTaken: input.actionTaken.trim(), actualSaving: input.actualSaving, evidence: input.evidence, completedAt: now, completedById: user.id, completedByName: user.name, timeline: [...r.timeline, event("completed", user)] }))) return; createNotification({ recipientUserId: item.zoneLeaderId, title: "Improvement Completed", message: `${item.title} · Completed by: ${user.name}`, href: `/5s/continuous-improvement/${id}/report` }); }
