export type StorageFailureReason = "quota" | "unavailable" | "unknown";
export type StorageResult = { success: true } | { success: false; reason: StorageFailureReason; message: string };

export const STORAGE_FULL_MESSAGE = "This device does not have enough browser storage to save this change. Existing data has been preserved.";

export class StoragePersistenceError extends Error {
  constructor(public result: Exclude<StorageResult, { success: true }>) {
    super(result.message);
    this.name = "StoragePersistenceError";
  }
}

export function approximateSerializedBytes(value: unknown): number {
  return new Blob([JSON.stringify(value)]).size;
}

export function readStorageString(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); }
  catch (error) { console.error(`Unable to read ${key}:`, error); return null; }
}

export function readStorageJson<T>(key: string): T | null {
  const value = readStorageString(key);
  if (!value) return null;
  try { return JSON.parse(value) as T; }
  catch (error) { console.error(`Unable to parse ${key}:`, error); return null; }
}

export function removeStorage(key: string): StorageResult {
  if (typeof window === "undefined") return { success: false, reason: "unavailable", message: "Browser storage is unavailable." };
  try { window.localStorage.removeItem(key); return { success: true }; }
  catch (error) { console.error(`Unable to remove ${key}:`, error); return { success: false, reason: "unknown", message: "Unable to clear browser storage." }; }
}

function isQuotaError(error: unknown) {
  return error instanceof DOMException && (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED" || error.code === 22 || error.code === 1014);
}

export function safeSetStorage(key: string, value: unknown): StorageResult {
  if (typeof window === "undefined") return { success: false, reason: "unavailable", message: "Browser storage is unavailable." };
  let serialized = "";
  try { serialized = JSON.stringify(value); window.localStorage.setItem(key, serialized); return { success: true }; }
  catch (error) {
    const quota = isQuotaError(error);
    console.error(`Unable to persist ${key} (${new Blob([serialized]).size} bytes):`, error);
    return { success: false, reason: quota ? "quota" : "unknown", message: quota ? STORAGE_FULL_MESSAGE : "Unable to save this change. Please try again." };
  }
}

export function safeSetStorageString(key: string, value: string): StorageResult {
  if (typeof window === "undefined") return { success: false, reason: "unavailable", message: "Browser storage is unavailable." };
  try { window.localStorage.setItem(key, value); return { success: true }; }
  catch (error) { console.error(`Unable to persist ${key}:`, error); return { success: false, reason: isQuotaError(error) ? "quota" : "unknown", message: isQuotaError(error) ? STORAGE_FULL_MESSAGE : "Unable to save this change. Please try again." }; }
}

export function cleanupObsoleteDemoStorage() {
  if (typeof window === "undefined") return;
  ["five-s-ci-create-draft", "five-s-temporary-evidence", "standalone-5s-upload-previews"].forEach(removeStorage);
}

export const DEMO_STORAGE_KEYS = [
  "manufacturing-qms-five-s-audits-v1",
  "manufacturing-qms-five-s-next-audit-number-v1",
  "standalone-5s-audit-sequences-v2",
  "standalone-5s-audit-fixture-version",
  "standalone-5s-actions",
  "standalone-5s-action-fixture-version",
  "five-s-red-tags-v1",
  "five-s-continuous-improvements-v1",
  "five-s-administration-users-v1",
  "five-s-question-configuration-v1",
  "standalone-5s-notifications",
  "standalone-5s-notification-fixture-version",
] as const;

/** Development/demo utility. A reload is required to reset module-level snapshots. */
export function resetStandaloneFiveSDemo(reload = true) {
  if (typeof window === "undefined") return false;
  DEMO_STORAGE_KEYS.forEach(removeStorage);
  cleanupObsoleteDemoStorage();
  if (reload) window.location.reload();
  return true;
}

export function getApproximateStorageUsage() {
  if (typeof window === "undefined") return { totalBytes: 0, keys: [] as Array<{ key: string; bytes: number }> };
  const keys = Object.keys(window.localStorage).map((key) => ({ key, bytes: new Blob([key, window.localStorage.getItem(key) ?? ""]).size })).sort((a, b) => b.bytes - a.bytes);
  return { totalBytes: keys.reduce((sum, item) => sum + item.bytes, 0), keys };
}
