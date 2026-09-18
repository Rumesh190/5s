import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Web UX batch 2 characterization", () => {
  it("keeps every operational module directly available in ProductNav", async () => {
    const source = await readFile("components/navigation/product-nav.tsx", "utf8");
    expect(source).toContain('item.href.startsWith("/5s")');
    expect(source).not.toContain("items.slice(0, 4)");
  });

  it("persists the sidebar collapsed state through the UI preference boundary", async () => {
    const preferences = await readFile("lib/ui-preferences.ts", "utf8");
    const shell = await readFile("components/layout/app-shell.tsx", "utf8");
    expect(preferences).toContain("sidebarCollapsed: boolean");
    expect(shell).toContain("useUiPreferences()");
  });

  it("explains that question deactivation preserves audit snapshots", async () => {
    const source = await readFile("features/five-s/question-configuration/questions-page.tsx", "utf8");
    expect(source).toContain("will no longer appear in new audits");
    expect(source).toContain("audit snapshots remain unchanged");
  });

  it("uses contextual selection copy on primary filter surfaces", async () => {
    const [dashboard, audits, actions, administration] = await Promise.all([
      readFile("features/five-s/dashboard-page.tsx", "utf8"),
      readFile("features/five-s/components/FiveSAuditList.tsx", "utf8"),
      readFile("features/five-s/actions-page.tsx", "utf8"),
      readFile("features/five-s/administration/users-page.tsx", "utf8"),
    ]);

    expect(dashboard).toContain("All Zones");
    expect(dashboard).toContain("All Zone Members");
    expect(audits).toContain("All Statuses");
    expect(audits).toContain("All Plants");
    expect(actions).toContain("All Lifecycle Stages");
    expect(actions).toContain("All Statuses");
    expect(administration).toContain("All Roles");
    expect(administration).toContain("All Zones");
  });

  it("requires camera-only issue evidence when creating a Red Tag", async () => {
    const [source, cameraWrapper, camera] = await Promise.all([
      readFile("features/five-s/red-tag/red-tag-module.tsx", "utf8"),
      readFile("features/five-s/components/IssuePhotoCaptureDialog.tsx", "utf8"),
      readFile("features/five-s/components/OperationalPhotoCaptureDialog.tsx", "utf8"),
    ]);
    expect(source).toContain('label="Issue Photo *"');
    expect(source).toContain("setCameraOpen(true)");
    expect(source).toContain("<IssuePhotoCaptureDialog");
    expect(source).toContain("&& requiredAction.trim() && imageUrl");
    expect(source).toContain('responsiblePersonId: "", responsiblePersonName: ""');
    expect(source).not.toContain("uploadRef");
    expect(source).not.toContain("> Upload</Button>");
    expect(cameraWrapper).toContain("OperationalPhotoCaptureDialog");
    expect(camera).toContain("navigator.mediaDevices.getUserMedia");
    expect(camera).toContain('facingMode: { ideal: "environment" }');
    expect(camera).toContain("Capture Photo");
    expect(camera).toContain("Retake");
    expect(camera).toContain("Use Photo");
  });

  it("shows consistent required markers without marking optional evidence", async () => {
    const [auditCreate, auditExecution, verification, action, redTag, questions, administration, improvement, marker] = await Promise.all([
      readFile("features/five-s/components/FiveSAuditCreate.tsx", "utf8"),
      readFile("features/five-s/components/FiveSAuditExecution.tsx", "utf8"),
      readFile("features/five-s/components/FinalAuditVerificationDialog.tsx", "utf8"),
      readFile("features/five-s/action-detail-page.tsx", "utf8"),
      readFile("features/five-s/red-tag/red-tag-module.tsx", "utf8"),
      readFile("features/five-s/question-configuration/questions-page.tsx", "utf8"),
      readFile("features/five-s/administration/users-page.tsx", "utf8"),
      readFile("features/five-s/continuous-improvement/module.tsx", "utf8"),
      readFile("components/ui/required-mark.tsx", "utf8"),
    ]);

    expect(marker).toContain('aria-hidden="true"');
    expect(marker).toContain('className="text-destructive"');
    expect(auditCreate).toContain('{t("audit.zone")}<RequiredMark />');
    expect(auditExecution).toContain("question.required !== false && <RequiredMark />");
    expect(auditExecution).toContain("Proposed Action<RequiredMark />");
    expect(verification).toContain('title="Live Photo" description="Capture a live photo of the auditor" required');
    expect(action).toContain("Corrective Measure / Observation<RequiredMark />");
    expect(action).toContain("Rework Comment<RequiredMark />");
    expect(redTag).toContain('"Name of Item / Equipment", "Quantity", "Reason"');
    expect(questions).toContain('"Question", "Reference Guide Title", "Reference Guide Description", "Reference Image"');
    expect(administration).toContain('["Employee ID","Name","Email"]');
    expect(improvement).toContain('label.endsWith(" *")');
    expect(improvement).toContain('label="Existing Photo (Optional)"');
  });
});
