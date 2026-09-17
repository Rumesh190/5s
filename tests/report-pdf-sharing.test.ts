import { beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { canSharePdfFile, createPdfFile, sanitizePdfFilename, sharePdfFile } from "@/lib/reports/report-pdf";

beforeAll(() => {
  if (!(globalThis as { File?: typeof File }).File) {
    class TestFile extends Blob {
      name: string;
      lastModified: number;
      constructor(parts: BlobPart[], name: string, options?: FilePropertyBag) {
        super(parts, options); this.name = name; this.lastModified = options?.lastModified ?? Date.now();
      }
    }
    vi.stubGlobal("File", TestFile);
  }
});

describe("report PDF file sharing", () => {
  it("creates an application/pdf File with a meaningful sanitized filename", () => {
    const file = createPdfFile(new Blob(["pdf"], { type: "application/pdf" }), "IQ Audit AUD/001.pdf");
    expect(file.type).toBe("application/pdf");
    expect(file.name).toBe("IQ-Audit-AUD-001.pdf");
    expect(sanitizePdfFilename("IQ-Corrective-Action-ACT-001.pdf")).toBe("IQ-Corrective-Action-ACT-001.pdf");
  });

  it("checks canShare with the PDF file and shares no URL", async () => {
    const file = createPdfFile(new Blob(["pdf"]), "IQ-Audit-AUD-001.pdf");
    const canShare = vi.fn(() => true);
    const share = vi.fn(async (data: ShareData) => { void data; });
    expect(canSharePdfFile({ canShare, share }, file)).toBe(true);
    expect(await sharePdfFile({ canShare, share }, file, "Audit report")).toBe("shared");
    expect(canShare).toHaveBeenCalledWith({ files: [file] });
    expect(share).toHaveBeenCalledWith({ files: [file], title: "Audit report" });
    expect(share.mock.calls[0][0]).not.toHaveProperty("url");
  });

  it("returns unsupported when native file sharing is unavailable", async () => {
    const file = createPdfFile(new Blob(["pdf"]), "IQ-Audit-AUD-001.pdf");
    expect(await sharePdfFile({}, file, "Audit report")).toBe("unsupported");
    expect(await sharePdfFile({ share: vi.fn(), canShare: () => false }, file, "Audit report")).toBe("unsupported");
  });

  it("handles cancellation quietly and distinguishes real failures", async () => {
    const file = createPdfFile(new Blob(["pdf"]), "IQ-Audit-AUD-001.pdf");
    const supported = () => true;
    expect(await sharePdfFile({ canShare: supported, share: vi.fn().mockRejectedValue(new DOMException("cancel", "AbortError")) }, file, "Audit report")).toBe("cancelled");
    expect(await sharePdfFile({ canShare: supported, share: vi.fn().mockRejectedValue(new Error("failed")) }, file, "Audit report")).toBe("failed");
  });

  it.each([
    ["Audit", "features/five-s/components/FiveSAuditReport.tsx", ".audit-report-document", "IQ-Audit-"],
    ["Corrective Action", "features/five-s/action-report-page.tsx", ".completed-action-report", "IQ-Corrective-Action-"],
  ])("connects the %s report to the shared PDF actions", (_name, path, selector, filename) => {
    const source = readFileSync(resolve(path), "utf8");
    expect(source).toContain('import ReportPdfActions from');
    expect(source).toContain(`selector="${selector}"`);
    expect(source).toContain(filename);
  });

  it("does not share or copy browser-local report URLs from the report library", () => {
    const source = readFileSync(resolve("features/five-s/reports-page.tsx"), "utf8");
    expect(source).not.toContain("window.location.origin");
    expect(source).not.toContain("navigator.clipboard");
    expect(source).not.toContain("navigator.share");
  });
});
