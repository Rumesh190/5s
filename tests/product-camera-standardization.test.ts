import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("product camera standardization", () => {
  it("uses one rear-camera capture flow for operational evidence", async () => {
    const camera = await readFile("features/five-s/components/OperationalPhotoCaptureDialog.tsx", "utf8");
    expect(camera).toContain("navigator.mediaDevices.getUserMedia");
    expect(camera).toContain('facingMode: { ideal: "environment" }');
    expect(camera).toContain("Starting camera…");
    expect(camera).toContain("Camera access is required");
    expect(camera).toContain("Camera unavailable");
    expect(camera).toContain("Capture Photo");
    expect(camera).toContain("Retake");
    expect(camera).toContain("Use Photo");
    expect(camera).toContain("stopCameraStream");
    expect(camera).toContain("normalizedEvidenceDataUrl(canvas)");
    expect(camera).toContain('overlayClassName="!z-[120]"');
    expect(camera).toContain('className="!z-[130]');
    expect(camera).not.toContain('type="file"');
  });

  it("routes Audit and Continuous Improvement Take Photo actions to live capture", async () => {
    const [audit, improvement] = await Promise.all([
      readFile("features/five-s/components/FiveSAuditExecution.tsx", "utf8"),
      readFile("features/five-s/continuous-improvement/module.tsx", "utf8"),
    ]);
    expect(audit).toContain("<OperationalPhotoCaptureDialog");
    expect(audit).toContain("setCameraQuestionId(question.id)");
    expect(improvement.match(/<OperationalPhotoCaptureDialog/g)).toHaveLength(2);
    expect(improvement).toContain("setCameraOpen(true)");
    expect(improvement).not.toContain('capture="environment"');
    expect(improvement).toContain("Upload Image");
    expect(improvement).toContain("Upload Photo");
  });

  it("keeps specialized rear After capture and front auditor verification", async () => {
    const [after, verification] = await Promise.all([
      readFile("features/five-s/components/AfterPhotoCaptureDialog.tsx", "utf8"),
      readFile("features/five-s/components/FinalAuditVerificationDialog.tsx", "utf8"),
    ]);
    expect(after).toContain('facingMode: { ideal: "environment" }');
    expect(after).toContain("normalizedEvidenceDataUrl(canvas)");
    expect(after).toContain("Match the Before Photo");
    expect(verification).toContain('facingMode: { ideal: "user" }');
    expect(verification).toContain("normalizedEvidenceDataUrl(canvas, 0.8)");
    expect(verification).toContain("verificationIsComplete(photo, signature)");
  });
});
