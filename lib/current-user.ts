"use client";

import { useSyncExternalStore } from "react";

export const DEMO_USERS = {
  auditor: {
    id: "USR-LAKSHMAN",
    name: "Lakshman",
    role: "Zone A Leader · Auditor",
    initials: "LK",
    plant: "Egmore Plant",
    primaryZone: "Zone A",
  },
  leader: {
    id: "USR-RUMESH",
    name: "Rumesh",
    role: "Zone B Leader",
    initials: "RU",
    plant: "Egmore Plant",
    primaryZone: "Zone B",
  },
  responsible: {
    id: "USR-SIVA-KUMAR",
    name: "Siva Kumar",
    role: "Zone B Member",
    initials: "SK",
    plant: "Egmore Plant",
    primaryZone: "Zone B",
  },
} as const;

export type DemoUser = (typeof DEMO_USERS)[keyof typeof DEMO_USERS];
export type DemoRole = keyof typeof DEMO_USERS;

/** Default identity used during server rendering and for the audit workflow. */
export const CURRENT_USER = DEMO_USERS.auditor;

const STORAGE_KEY = "five-s-demo-role";
const listeners = new Set<() => void>();
let activeRole: DemoRole = "auditor";
let storageLoaded = false;

function loadStoredRole() {
  if (storageLoaded || typeof window === "undefined") return;
  storageLoaded = true;
  const storedRole = window.localStorage.getItem(STORAGE_KEY);
  if (storedRole === "auditor" || storedRole === "leader" || storedRole === "responsible") activeRole = storedRole;
}

function subscribe(listener: () => void) {
  loadStoredRole();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): DemoUser {
  loadStoredRole();
  return DEMO_USERS[activeRole];
}

function getServerSnapshot(): DemoUser {
  return CURRENT_USER;
}

export function setDemoRole(role: DemoRole) {
  if (role === activeRole) return;
  activeRole = role;
  storageLoaded = true;
  window.localStorage.setItem(STORAGE_KEY, role);
  listeners.forEach((listener) => listener());
}

export function useCurrentUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
