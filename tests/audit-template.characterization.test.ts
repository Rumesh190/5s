import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";
import { GARMENT_REFERENCE_CONTENT, referenceFields } from "@/lib/five-s/reference-guides";
import { didRequiredAnswersBecomeComplete } from "@/lib/five-s/audit-completion";
import { stopCameraStream, verificationIsComplete } from "@/lib/five-s/audit-verification";
import type { FiveSCategory } from "@/features/five-s/types/five-s";
import { DEFAULT_FIVE_S_QUESTION_TEXT } from "@/features/five-s/question-configuration/data";

describe("active audit-list 5S template", () => {
  it("preserves section order, counts, question order, and exact wording", () => {
    const template = [
      ["Sort", DEFAULT_FIVE_S_QUESTION_TEXT.Sort],
      ["Set in Order", DEFAULT_FIVE_S_QUESTION_TEXT["Set in Order"]],
      ["Shine", DEFAULT_FIVE_S_QUESTION_TEXT.Shine],
      ["Standardize", DEFAULT_FIVE_S_QUESTION_TEXT.Standardize],
      ["Sustain", DEFAULT_FIVE_S_QUESTION_TEXT.Sustain],
    ];

    expect(template.map(([name, questions]) => [name, questions.length])).toEqual([
      ["Sort", 7],
      ["Set in Order", 9],
      ["Shine", 8],
      ["Standardize", 7],
      ["Sustain", 8],
    ]);
    expect(template.flatMap(([, questions]) => questions)).toHaveLength(39);
    expect(template).toMatchInlineSnapshot(`
      [
        [
          "Sort",
          [
            "Are unnecessary tools, materials, and items removed from the work area?",
            "Are obsolete or unused items clearly identified and segregated?",
            "Are only required materials stored at the workstation?",
            "Are damaged, defective, or redundant items identified and removed?",
            "Are excess raw materials and work-in-progress controlled to required quantities?",
            "Are red-tagged or unwanted items reviewed and disposed of within the defined timeframe?",
            "Is there a clear process for deciding whether an item is required or unnecessary?",
          ],
        ],
        [
          "Set in Order",
          [
            "Are tools and materials stored in clearly identified locations?",
            "Are storage locations visually marked and easy to identify?",
            "Can frequently used items be accessed without unnecessary movement?",
            "Are tools and materials arranged according to frequency of use?",
            "Are floor markings, location markings, and labels clearly visible?",
            "Are shadow boards, racks, cabinets, or storage systems properly organized?",
            "Does every required item have a defined and designated storage location?",
            "Are items returned to their designated locations after use?",
            "Are aisles, walkways, emergency routes, and access areas clearly identified and kept unobstructed?",
          ],
        ],
        [
          "Shine",
          [
            "Is the work area clean and free from visible dirt and waste?",
            "Are machines and equipment maintained in a clean condition?",
            "Are abnormal conditions identified during cleaning activities?",
            "Are floors, work surfaces, and surrounding areas cleaned regularly?",
            "Are oil, coolant, grease, dust, and other contamination controlled?",
            "Are cleaning tools and materials themselves clean, organized, and properly stored?",
            "Are leaks, damage, loose parts, or other abnormalities reported and addressed?",
            "Are cleaning and inspection activities performed according to the defined schedule?",
          ],
        ],
        [
          "Standardize",
          [
            "Are standard 5S procedures available and followed?",
            "Are visual standards available for the work area?",
            "Are cleaning and inspection responsibilities clearly defined?",
            "Are standard locations, markings, labels, and color codes consistently maintained?",
            "Are 5S standards displayed or easily accessible to employees?",
            "Are standard cleaning, inspection, and workplace organization schedules followed?",
            "Are deviations from the defined 5S standards identified and corrected?",
          ],
        ],
        [
          "Sustain",
          [
            "Are 5S practices consistently followed by employees?",
            "Are regular 5S audits conducted according to the defined schedule?",
            "Are previous audit findings reviewed and closed within the required timeframe?",
            "Are employees aware of their 5S responsibilities?",
            "Are recurring 5S problems identified and addressed?",
            "Are 5S improvements communicated to the relevant employees?",
            "Is management or area ownership involved in maintaining 5S standards?",
            "Is continuous improvement encouraged based on 5S audit findings?",
          ],
        ],
      ]
    `);
  });

  it("characterizes the live two-point maximum without treating fixtures as canonical", () => {
    expect(39 * 2).toBe(78);
    expect(readFileSync(resolve("features/five-s/question-configuration/store.ts"), "utf8")).toContain("maxScore: 2");
  });

  it("maps all 39 questions to one unique garment good-practice reference asset", () => {
    const categories: Array<[FiveSCategory, number]> = [
      ["Sort", 7],
      ["Set in Order", 9],
      ["Shine", 8],
      ["Standardize", 7],
      ["Sustain", 8],
    ];
    const references = categories.flatMap(([category, count]) =>
      Array.from({ length: count }, (_, index) => referenceFields(category, index).reference),
    );

    expect(GARMENT_REFERENCE_CONTENT).toHaveLength(39);
    expect(references).toHaveLength(39);
    expect(references.map((reference) => reference?.image)).toEqual(
      Array.from({ length: 39 }, (_, index) => `/5s/references/garment/q${String(index + 1).padStart(2, "0")}.webp`),
    );
    expect(references.every((reference) => reference?.title && reference.description)).toBe(true);
    expect(references.every((reference) => existsSync(resolve("public", reference?.image.replace(/^\//, "") ?? "")))).toBe(true);
    expect(references.every((reference) => Object.keys(reference ?? {}).sort().join(",") === "description,image,title")).toBe(true);
  });
});

describe("audit review auto-navigation transition", () => {
  const questionIds = ["q1", "q2", "q3"];

  it("opens review only when the final missing required answer becomes complete", () => {
    expect(didRequiredAnswersBecomeComplete(questionIds, { q1: true, q2: true, q3: false }, { q1: true, q2: true, q3: true })).toBe(true);
    expect(didRequiredAnswersBecomeComplete(questionIds, { q1: false, q2: true, q3: false }, { q1: false, q2: true, q3: true })).toBe(false);
  });

  it("does not redirect on initial load or while editing an already complete questionnaire", () => {
    const complete = { q1: true, q2: true, q3: true };
    expect(didRequiredAnswersBecomeComplete(questionIds, null, complete)).toBe(false);
    expect(didRequiredAnswersBecomeComplete(questionIds, complete, complete)).toBe(false);
  });

  it("can trigger again after the questionnaire becomes incomplete", () => {
    expect(didRequiredAnswersBecomeComplete(questionIds, { q1: true, q2: false, q3: true }, { q1: true, q2: true, q3: true })).toBe(true);
  });
});

describe("final auditor verification", () => {
  it("requires both a live photo and a real signature", () => {
    expect(verificationIsComplete(null, null)).toBe(false);
    expect(verificationIsComplete("photo-data", null)).toBe(false);
    expect(verificationIsComplete(null, "signature-data")).toBe(false);
    expect(verificationIsComplete("photo-data", "signature-data")).toBe(true);
  });

  it("stops every camera track", () => {
    const stops = [vi.fn(), vi.fn()];
    stopCameraStream({ getTracks: () => stops.map((stop) => ({ stop })) } as unknown as MediaStream);
    expect(stops.every((stop) => stop.mock.calls.length === 1)).toBe(true);
  });

  it("keeps live capture, persistence, and report evidence wired to the audit", () => {
    const verification = readFileSync(resolve("features/five-s/components/FinalAuditVerificationDialog.tsx"), "utf8");
    const execution = readFileSync(resolve("features/five-s/components/FiveSAuditExecution.tsx"), "utf8");
    const report = readFileSync(resolve("features/five-s/components/FiveSAuditReport.tsx"), "utf8");
    expect(verification).toContain("navigator.mediaDevices.getUserMedia");
    expect(verification).toContain('facingMode: "user"');
    expect(verification).toContain("context.drawImage(video");
    expect(execution).toContain("auditorVerification,");
    expect(report).toContain("audit.auditorVerification.photo");
    expect(report).toContain("audit.auditorVerification?.signature");
  });

  it("keeps one completion action in a fixed modal footer while only the body scrolls", () => {
    const verification = readFileSync(resolve("features/five-s/components/FinalAuditVerificationDialog.tsx"), "utf8");
    expect(verification).toContain("flex max-h-[calc(100dvh-1.5rem)] flex-col");
    expect(verification).toContain("min-h-0 flex-1 overflow-y-auto");
    expect(verification).toContain('className="z-10 shrink-0 border-t bg-popover');
    expect(verification.match(/Complete Audit/g)).toHaveLength(2); // Dialog title and the single canonical CTA.
  });
});
