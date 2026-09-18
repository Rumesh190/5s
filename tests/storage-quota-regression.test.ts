import { afterEach, describe, expect, it, vi } from "vitest";

import { getNormalizedImageDimensions } from "@/lib/evidence-images";

function quotaError() {
  return new DOMException("Storage quota exceeded", "QuotaExceededError");
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("browser storage quota handling", () => {
  it("returns success after a durable write", async () => {
    const setItem = vi.fn();
    vi.stubGlobal("window", { localStorage: { setItem } });
    const { safeSetStorage } = await import("@/lib/browser-storage");
    expect(safeSetStorage("key", { ok: true })).toEqual({ success: true });
    expect(setItem).toHaveBeenCalledWith("key", '{"ok":true}');
  });

  it("returns a quota result without allowing the exception to escape", async () => {
    vi.stubGlobal("window", { localStorage: { setItem: vi.fn(() => { throw quotaError(); }) } });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { safeSetStorage } = await import("@/lib/browser-storage");
    expect(() => safeSetStorage("key", { photo: "data:image/jpeg;base64,large" })).not.toThrow();
    expect(safeSetStorage("key", {})).toMatchObject({ success: false, reason: "quota" });
  });

  it("rolls back failed Audit creation and does not duplicate a retry", async () => {
    vi.resetModules();
    const values = new Map<string, string>();
    let rejectAuditWrites = true;
    const localStorage = {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => {
        if (rejectAuditWrites && key === "manufacturing-qms-five-s-audits-v1") throw quotaError();
        values.set(key, value);
      },
    };
    vi.stubGlobal("window", { localStorage });
    vi.stubGlobal("localStorage", localStorage);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const store = await import("@/lib/five-s/audit-store");
    const before = store.getFiveSAudits().map((audit) => audit.id);
    const input = { title: "Generated", plant: "Egmore Plant", department: "Production", area: "Zone B", auditor: "Lakshman", dueDate: "2026-09-18" };
    expect(() => store.createFiveSAudit(input)).toThrow("Existing data has been preserved");
    expect(store.getFiveSAudits().map((audit) => audit.id)).toEqual(before);
    expect(values.get("manufacturing-qms-five-s-audits-v1")).toBeUndefined();

    rejectAuditWrites = false;
    const created = store.createFiveSAudit(input);
    expect(store.getFiveSAudits().filter((audit) => audit.id === created.id)).toHaveLength(1);

    rejectAuditWrites = true;
    expect(store.updateFiveSAudit(created.id, { status: "Completed" })).toBeUndefined();
    expect(store.getFiveSAuditById(created.id)?.status).toBe("Draft");
  });
});

describe("evidence image normalization", () => {
  it("reduces large images while preserving aspect ratio", () => {
    expect(getNormalizedImageDimensions(4000, 3000)).toEqual({ width: 1600, height: 1200 });
    expect(getNormalizedImageDimensions(3000, 4000)).toEqual({ width: 1200, height: 1600 });
  });

  it("does not upscale smaller images", () => {
    expect(getNormalizedImageDimensions(800, 600)).toEqual({ width: 800, height: 600 });
  });
});

describe("Audit creation failure UX", () => {
  it("keeps creation open and renders the friendly storage message", async () => {
    const [page, form] = await Promise.all([
      import("node:fs/promises").then(({ readFile }) => readFile("features/five-s/audit-list-page.tsx", "utf8")),
      import("node:fs/promises").then(({ readFile }) => readFile("features/five-s/components/FiveSAuditCreate.tsx", "utf8")),
    ]);
    expect(page).toContain("catch (error)");
    expect(page).toContain("return false");
    expect(page).toContain("storageError={creationError}");
    expect(form).toContain("Storage is full");
    expect(form).toContain("if (started === false) setStarting(false)");
  });
});
