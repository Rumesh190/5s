export const SESSION_INACTIVITY_MS = 10 * 60 * 1000;
export const SESSION_WARNING_MS = 9 * 60 * 1000;

export type SessionActivityState = "active" | "warning" | "expired";

export function getSessionActivityState(lastActivityAt: number, now: number): SessionActivityState {
  const elapsed = Math.max(0, now - lastActivityAt);
  if (elapsed >= SESSION_INACTIVITY_MS) return "expired";
  if (elapsed >= SESSION_WARNING_MS) return "warning";
  return "active";
}

export function hiddenSessionHasExpired(hiddenAt: number | null, now: number) {
  return hiddenAt !== null && now - hiddenAt >= SESSION_INACTIVITY_MS;
}
