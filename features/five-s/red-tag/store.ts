"use client";

import { useSyncExternalStore } from "react";
import type { DemoUser } from "@/lib/current-user";
import type { RedTag } from "./types";
import { safeSetStorage, STORAGE_FULL_MESSAGE } from "@/lib/browser-storage";

const KEY = "five-s-red-tags-v1";
const DEMO_TAG: RedTag = {
  id: "RT-EGM-ZA-001", tagNumber: "RT-EGM-ZA-001", plant: "Egmore Plant", zone: "Zone A",
  section: "Production", itemName: "Hydraulic Press 04", quantity: 1, reason: "Unclean Area",
  remarks: "Oil residue and unwanted material found around the machine base.",
  requiredAction: "Clean the machine area, remove unwanted material and inspect for leakage.",
  responsiblePersonId: "USR-SIVA", responsiblePersonName: "Siva", targetDate: "2026-08-26", status: "Open",
  createdById: "USR-LAKSHMAN", createdByName: "Lakshman", createdAt: "2026-08-25T10:30:00+05:30",
  imageUrl: "/demo-5s/not-good-example.png",
  history: [{ id: "RTH-001", type: "created", label: "Red Tag created", actor: "Lakshman", at: "2026-08-25T10:30:00+05:30" }],
};

let tags: RedTag[] = [DEMO_TAG];
const SERVER_TAGS: RedTag[] = [DEMO_TAG];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved) tags = JSON.parse(saved) as RedTag[];
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
