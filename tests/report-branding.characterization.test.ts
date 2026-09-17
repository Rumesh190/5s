import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("IQ report branding", () => {
  it("keeps an exact copy of the supplied official logo", () => {
    const path = resolve("public/branding/iq-logo.png");
    expect(existsSync(path)).toBe(true);
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(
      "d6b683ec7f918178de881ebaf0c10ef90a4ad5ae572c446130267c128cae1ea6",
    );
  });

  it("uses one responsive, print-safe report header", () => {
    const header = read("features/five-s/components/ReportHeader.tsx");
    expect(header).toContain('IQ_LOGO_PATH = "/branding/iq-logo.png"');
    expect(header).toContain("h-auto w-[150px]");
    expect(header).toContain("sm:w-[190px]");
    expect(header).toContain("object-contain object-left");
    expect(read("app/globals.css")).toContain(".report-brand-logo");
  });

  it.each([
    "features/five-s/components/FiveSAuditReport.tsx",
    "features/five-s/action-report-page.tsx",
    "features/five-s/continuous-improvement/module.tsx",
    "features/five-s/red-tag/red-tag-module.tsx",
    "features/five-s/dashboard-page.tsx",
  ])("applies shared branding to %s", (file) => {
    expect(read(file)).toContain("ReportHeader");
  });

  it("waits for images before print-driven PDF generation", () => {
    const header = read("features/five-s/components/ReportHeader.tsx");
    expect(header).toContain("image.decode()");
    expect(header).toContain("document.fonts?.ready");
  });
});
