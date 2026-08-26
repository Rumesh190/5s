import type {
  InvestigationDetails,
  InvestigationEvent,
  InvestigationRecord,
  RootCause,
  WhyStep,
} from "@/types/investigation"

/** Fixed per the screen spec — each Why builds on the previous answer. */
export const WHY_QUESTIONS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Why did this problem occur?",
  2: "Why did the previous cause happen?",
  3: "Why did that happen?",
  4: "Why did that happen?",
  5: "Why is this the fundamental cause?",
}

/**
 * Mock data for the Investigation module. No backend exists yet. IDs and
 * plant/department/owner details are kept consistent with
 * `lib/mock/audits.mock.ts` and `lib/mock/audit-details.mock.ts` so the
 * modules read as the same underlying company data.
 */
export const INVESTIGATIONS_MOCK: InvestigationRecord[] = [
  {
    id: "INV-208",
    title: "Dimensional deviation — bracket assembly",
    linkedAuditId: "AUD-1032",
    linkedAuditTitle: "Dimensional Deviation — Bracket Assembly",
    linkedFindingId: "FND-1901",
    linkedFindingTitle: "Bracket assembly hole spacing out of tolerance",
    plant: "Chennai Plant",
    department: "Assembly",
    productionLine: "Line 3",
    severity: "Critical",
    status: "In Progress",
    owner: "Ananya Rao",
    progress: 25,
    createdDaysAgo: 4,
    updatedDaysAgo: 0,
    dueDate: "Aug 11, 2026",
  },
  {
    id: "INV-205",
    title: "Coating defect — housing unit",
    linkedAuditId: "AUD-1044",
    linkedAuditTitle: "Housing Surface Finish Non-Conformance",
    linkedFindingId: "FND-2410",
    linkedFindingTitle: "Coating thickness variance exceeds tolerance",
    plant: "Coimbatore Plant",
    department: "Quality",
    productionLine: "Line 1",
    severity: "Critical",
    status: "In Progress",
    owner: "Ananya Rao",
    progress: 55,
    createdDaysAgo: 3,
    updatedDaysAgo: 0,
    dueDate: "Aug 9, 2026",
  },
  {
    id: "INV-201",
    title: "Fastener torque non-conformance",
    linkedAuditId: "AUD-1035",
    linkedAuditTitle: "Fastener Torque Non-Conformance",
    linkedFindingId: "FND-1935",
    linkedFindingTitle: "Torque values below spec on 4% of fasteners — Assembly Cell 2",
    plant: "Chennai Plant",
    department: "Assembly",
    productionLine: "Assembly Cell 2",
    severity: "High",
    status: "Awaiting Verification",
    owner: "Rahul Mehta",
    progress: 90,
    createdDaysAgo: 9,
    updatedDaysAgo: 1,
    dueDate: "Aug 9, 2026",
  },
  {
    id: "INV-195",
    title: "Label mismatch — packaging",
    linkedAuditId: "AUD-1026",
    linkedAuditTitle: "Label Mismatch — Packaging Line",
    linkedFindingId: "FND-1926",
    linkedFindingTitle: "Incorrect SKU label applied — Packaging Line 2",
    plant: "Hyderabad Plant",
    department: "Warehouse",
    productionLine: "Line 2",
    severity: "Low",
    status: "Closed",
    owner: "Arun Kumar",
    progress: 100,
    createdDaysAgo: 17,
    updatedDaysAgo: 15,
    dueDate: "Jul 22, 2026",
  },
  {
    id: "INV-212",
    title: "Hydraulic press safety check follow-up",
    linkedAuditId: "AUD-1049",
    linkedAuditTitle: "Hydraulic Press Safety Check — Line 2",
    plant: "Bengaluru Plant",
    department: "Maintenance",
    productionLine: "Line 2",
    severity: "Critical",
    status: "Open",
    owner: "Priya Singh",
    progress: 0,
    createdDaysAgo: 1,
    updatedDaysAgo: 0,
    dueDate: "Aug 13, 2026",
  },
  {
    id: "INV-213",
    title: "Robotic weld cell downtime",
    linkedAuditId: "AUD-1033",
    linkedAuditTitle: "Robotic Weld Cell Downtime Investigation",
    plant: "Coimbatore Plant",
    department: "Welding",
    productionLine: "Weld Cell 1",
    severity: "Critical",
    status: "Open",
    owner: "Priya Singh",
    progress: 5,
    createdDaysAgo: 10,
    updatedDaysAgo: 6,
    dueDate: "Aug 16, 2026",
  },
  {
    id: "INV-214",
    title: "Coating defect — housing unit (Mysuru)",
    linkedAuditId: "AUD-1030",
    linkedAuditTitle: "Coating Defect — Housing Unit",
    plant: "Mysuru Plant",
    department: "Paint Shop",
    productionLine: "Line 2",
    severity: "High",
    status: "In Progress",
    owner: "Sara Iyer",
    progress: 35,
    createdDaysAgo: 13,
    updatedDaysAgo: 7,
    dueDate: "Aug 18, 2026",
  },
  {
    id: "INV-215",
    title: "Machine guard interlock failure",
    linkedAuditId: "AUD-1028",
    linkedAuditTitle: "Machine Guard Interlock Failure",
    plant: "Hosur Plant",
    department: "Maintenance",
    productionLine: "Maintenance Bay",
    severity: "Critical",
    status: "Closed",
    owner: "Ananya Rao",
    progress: 100,
    createdDaysAgo: 15,
    updatedDaysAgo: 9,
    dueDate: "Aug 1, 2026",
  },
  {
    id: "INV-216",
    title: "Calibration overdue — torque wrench set B",
    linkedAuditId: "AUD-1024",
    linkedAuditTitle: "Calibration Overdue — Torque Wrench Set B",
    plant: "Sriperumbudur Plant",
    department: "Quality",
    productionLine: "Receiving Bay 2",
    severity: "Medium",
    status: "Open",
    owner: "Meera Alvarez",
    progress: 10,
    createdDaysAgo: 19,
    updatedDaysAgo: 19,
    dueDate: "Aug 25, 2026",
  },
  {
    id: "INV-217",
    title: "Human error — wrong part installed",
    linkedAuditId: "AUD-1023",
    linkedAuditTitle: "Human Error — Wrong Part Installed",
    plant: "Bengaluru Plant",
    department: "Assembly",
    productionLine: "Line 4",
    severity: "High",
    status: "Closed",
    owner: "Karthik Rao",
    progress: 100,
    createdDaysAgo: 21,
    updatedDaysAgo: 14,
    dueDate: "Jul 28, 2026",
  },
  {
    id: "INV-218",
    title: "Warehouse cycle count discrepancy",
    linkedAuditId: "AUD-1043",
    linkedAuditTitle: "Warehouse Cycle Count Discrepancy",
    plant: "Bengaluru Plant",
    department: "Warehouse",
    productionLine: "Receiving Bay 2",
    severity: "Medium",
    status: "Awaiting Verification",
    owner: "Rahul Mehta",
    progress: 85,
    createdDaysAgo: 4,
    updatedDaysAgo: 2,
    dueDate: "Aug 10, 2026",
  },
  {
    id: "INV-219",
    title: "Safety guard missing — punch press 3",
    linkedAuditId: "AUD-1020",
    linkedAuditTitle: "Safety Guard Missing — Punch Press 3",
    plant: "Chennai Plant",
    department: "Maintenance",
    productionLine: "Line 1",
    severity: "Critical",
    status: "Closed",
    owner: "Ananya Rao",
    progress: 100,
    createdDaysAgo: 30,
    updatedDaysAgo: 22,
    dueDate: "Jul 18, 2026",
  },
  {
    id: "INV-220",
    title: "Product labeling compliance review",
    linkedAuditId: "AUD-1039",
    linkedAuditTitle: "Product Labeling Compliance Review",
    plant: "Hyderabad Plant",
    department: "Quality",
    productionLine: "Line 2",
    severity: "Low",
    status: "Closed",
    owner: "Karthik Rao",
    progress: 100,
    createdDaysAgo: 6,
    updatedDaysAgo: 3,
    dueDate: "Aug 4, 2026",
  },
]

function emptyWhySteps(): WhyStep[] {
  return ([1, 2, 3, 4, 5] as const).map((step) => ({
    step,
    question: WHY_QUESTIONS[step],
    answer: "",
    notes: "",
  }))
}

type CuratedDetails = Pick<
  InvestigationDetails,
  "problemStatement" | "whySteps" | "rootCause" | "correctiveAction" | "preventiveAction" | "timeline" | "attachments"
>

const CURATED_DETAILS: Record<string, CuratedDetails> = {
  "INV-208": {
    problemStatement:
      "Bracket assembly units from Line 3 are failing dimensional inspection — hole spacing exceeds tolerance by 0.4mm on 6% of sampled units.",
    whySteps: [
      {
        step: 1,
        question: WHY_QUESTIONS[1],
        answer: "The stamping die used for hole punching has worn beyond its calibrated tolerance.",
        notes: "Confirmed via go/no-go gauge check on Station 2 press.",
      },
      { step: 2, question: WHY_QUESTIONS[2], answer: "", notes: "" },
      { step: 3, question: WHY_QUESTIONS[3], answer: "", notes: "" },
      { step: 4, question: WHY_QUESTIONS[4], answer: "", notes: "" },
      { step: 5, question: WHY_QUESTIONS[5], answer: "", notes: "" },
    ],
    rootCause: null,
    correctiveAction: null,
    preventiveAction: null,
    timeline: [
      { id: "t2", type: "Why Answered", description: "Answered Why 1 — stamping die wear", actor: "Ananya Rao", timestamp: "Today" },
      { id: "t1", type: "Investigation Started", description: "Investigation INV-208 started from AUD-1032", actor: "Ananya Rao", timestamp: "4d ago" },
    ],
    attachments: [
      { id: "att-1", name: "bracket-gauge-check.jpg", type: "image", sizeLabel: "1.8 MB", uploadedBy: "Ananya Rao", uploadedAt: "Today" },
    ],
  },

  "INV-205": {
    problemStatement:
      "Surface finish non-conformance identified on housing units — visible tooling marks and inconsistent coating thickness affecting 8% of the daily run.",
    whySteps: [
      {
        step: 1,
        question: WHY_QUESTIONS[1],
        answer: "Coating booth temperature drifted below the specified range during the second shift.",
        notes: "Logged via booth SCADA trend — 6°C below setpoint for ~90 minutes.",
      },
      {
        step: 2,
        question: WHY_QUESTIONS[2],
        answer: "The booth's temperature controller sensor was miscalibrated.",
        notes: "",
      },
      {
        step: 3,
        question: WHY_QUESTIONS[3],
        answer: "Sensor calibration was overdue — last calibration was 14 months ago against a 12-month schedule.",
        notes: "Calibration log shows no record since May 2025.",
      },
      { step: 4, question: WHY_QUESTIONS[4], answer: "", notes: "" },
      { step: 5, question: WHY_QUESTIONS[5], answer: "", notes: "" },
    ],
    rootCause: null,
    correctiveAction: null,
    preventiveAction: null,
    timeline: [
      { id: "t3", type: "Why Answered", description: "Answered Why 3 — overdue sensor calibration", actor: "Ananya Rao", timestamp: "Today" },
      { id: "t2", type: "Why Answered", description: "Answered Why 1 and Why 2 — booth temperature drift", actor: "Ananya Rao", timestamp: "1d ago" },
      { id: "t1", type: "Investigation Started", description: "Investigation INV-205 started from AUD-1044", actor: "Ananya Rao", timestamp: "3d ago" },
    ],
    attachments: [
      { id: "att-1", name: "booth-temp-trend.pdf", type: "pdf", sizeLabel: "760 KB", uploadedBy: "Ananya Rao", uploadedAt: "Today" },
    ],
  },

  "INV-201": {
    problemStatement:
      "Torque values below specification detected on 4% of fasteners inspected at Assembly Cell 2.",
    whySteps: [
      {
        step: 1,
        question: WHY_QUESTIONS[1],
        answer: "Torque wrench used at Assembly Cell 2 was applying inconsistent clamping force.",
        notes: "Verified with calibration test stand — reading drift up to 8%.",
      },
      {
        step: 2,
        question: WHY_QUESTIONS[2],
        answer: "The wrench's clutch mechanism had degraded from extended use beyond its service interval.",
        notes: "",
      },
      {
        step: 3,
        question: WHY_QUESTIONS[3],
        answer: "The wrench was not included in the preventive maintenance schedule for tooling.",
        notes: "",
      },
      {
        step: 4,
        question: WHY_QUESTIONS[4],
        answer: "Hand tools were excluded from the PM schedule scope when it was last revised.",
        notes: "",
      },
      {
        step: 5,
        question: WHY_QUESTIONS[5],
        answer:
          "The PM scope revision did not include a review step to confirm all critical tooling categories remained covered.",
        notes: "This is the fundamental process gap driving the recurrence risk.",
      },
    ],
    rootCause: {
      category: "Method / Process",
      description:
        "Preventive maintenance scope excluded hand-held torque tools, allowing a degraded wrench to remain in service undetected.",
      contributingFactors: [
        "PM schedule revision lacked a coverage-review step",
        "No secondary torque verification at the cell",
        "Tool crib lacked a wear-based retirement policy",
      ],
      summary:
        "Root cause traced to a gap in the preventive maintenance program's scope, not an isolated operator or part failure.",
    },
    correctiveAction: {
      description: "Add all hand-held torque tools to the PM schedule and retire the affected wrench.",
      owner: "Rahul Mehta",
      targetDate: "Aug 9, 2026",
      priority: "High",
      notes: "Replacement wrench issued and verified against calibration standard.",
    },
    preventiveAction: {
      description:
        "Add a coverage-review checklist step to future PM scope revisions; introduce secondary torque spot-checks at Assembly Cell 2.",
      owner: "Karthik Rao",
      targetDate: "Aug 20, 2026",
      notes: "Pending Production Supervisor sign-off before closure.",
    },
    timeline: [
      { id: "t5", type: "Corrective Action Added", description: "Logged corrective action — PM schedule update and wrench retirement", actor: "Rahul Mehta", timestamp: "1d ago" },
      { id: "t4", type: "Root Cause Documented", description: "Root cause recorded — PM scope gap", actor: "Rahul Mehta", timestamp: "2d ago" },
      { id: "t3", type: "Why Answered", description: "Completed Why 4 and Why 5", actor: "Rahul Mehta", timestamp: "3d ago" },
      { id: "t2", type: "Why Answered", description: "Completed Why 1 through Why 3", actor: "Rahul Mehta", timestamp: "6d ago" },
      { id: "t1", type: "Investigation Started", description: "Investigation INV-201 started from AUD-1035", actor: "Rahul Mehta", timestamp: "9d ago" },
    ],
    attachments: [
      { id: "att-1", name: "torque-wrench-calibration.pdf", type: "pdf", sizeLabel: "540 KB", uploadedBy: "Rahul Mehta", uploadedAt: "2d ago" },
    ],
  },

  "INV-195": {
    problemStatement: "Packaging Line 2 applied an incorrect SKU label to a batch of finished units.",
    whySteps: [
      {
        step: 1,
        question: WHY_QUESTIONS[1],
        answer: "Packaging Line 2 applied an incorrect SKU label to a batch of finished units.",
        notes: "",
      },
      {
        step: 2,
        question: WHY_QUESTIONS[2],
        answer: "The label printer pulled the previous job's template instead of the current one.",
        notes: "",
      },
      {
        step: 3,
        question: WHY_QUESTIONS[3],
        answer: "The operator did not confirm the template name before starting the print job.",
        notes: "",
      },
      {
        step: 4,
        question: WHY_QUESTIONS[4],
        answer: "The work instruction did not require a template confirmation step before printing.",
        notes: "",
      },
      {
        step: 5,
        question: WHY_QUESTIONS[5],
        answer: "The standard work procedure for label changeovers omits a mandatory verification checkpoint.",
        notes: "",
      },
    ],
    rootCause: {
      category: "Method / Process",
      description:
        "Label changeover procedure lacks a mandatory template-confirmation checkpoint, allowing stale templates to be printed unnoticed.",
      contributingFactors: [
        "No visual confirmation step in work instruction",
        "Printer defaults to last-used template",
        "No barcode cross-check before packing",
      ],
      summary:
        "A missing verification step in the standard work procedure allowed a stale label template to pass through unnoticed.",
    },
    correctiveAction: {
      description:
        "Update label changeover work instruction to require template confirmation before printing; relabel affected batch.",
      owner: "Arun Kumar",
      targetDate: "Jul 20, 2026",
      priority: "Low",
      notes: "Affected batch (340 units) relabeled and released.",
    },
    preventiveAction: {
      description: "Add a barcode cross-check step between label print and pack to catch template mismatches automatically.",
      owner: "Meera Alvarez",
      targetDate: "Jul 25, 2026",
      notes: "Verified effective over two subsequent production runs.",
    },
    timeline: [
      { id: "t6", type: "Investigation Completed", description: "Investigation closed after effectiveness verification", actor: "Arun Kumar", timestamp: "15d ago" },
      { id: "t5", type: "Preventive Action Added", description: "Logged preventive action — barcode cross-check", actor: "Meera Alvarez", timestamp: "16d ago" },
      { id: "t4", type: "Corrective Action Added", description: "Logged corrective action — work instruction update", actor: "Arun Kumar", timestamp: "16d ago" },
      { id: "t3", type: "Root Cause Documented", description: "Root cause recorded — missing verification checkpoint", actor: "Arun Kumar", timestamp: "16d ago" },
      { id: "t2", type: "Why Answered", description: "Completed all five Why steps", actor: "Arun Kumar", timestamp: "17d ago" },
      { id: "t1", type: "Investigation Started", description: "Investigation INV-195 started from AUD-1026", actor: "Arun Kumar", timestamp: "17d ago" },
    ],
    attachments: [
      { id: "att-1", name: "relabel-batch-record.pdf", type: "pdf", sizeLabel: "310 KB", uploadedBy: "Arun Kumar", uploadedAt: "16d ago" },
    ],
  },
}

function baseDetailsFor(record: InvestigationRecord): CuratedDetails {
  const started: InvestigationEvent = {
    id: "t1",
    type: "Investigation Started",
    description: `Investigation ${record.id} started from ${record.linkedAuditId}`,
    actor: record.owner,
    timestamp: `${record.createdDaysAgo}d ago`,
  }

  return {
    problemStatement: `Issue reported against ${record.linkedAuditTitle} on ${record.productionLine}.`,
    whySteps: emptyWhySteps(),
    rootCause: null,
    correctiveAction: null,
    preventiveAction: null,
    timeline: [started],
    attachments: [],
  }
}

export function getInvestigationDetails(id: string): InvestigationDetails | undefined {
  const record = INVESTIGATIONS_MOCK.find((investigation) => investigation.id === id)
  if (!record) return undefined

  const details = CURATED_DETAILS[id] ?? baseDetailsFor(record)
  return { ...record, ...details }
}

export function isWhyStepUnlocked(whySteps: WhyStep[], step: number): boolean {
  if (step === 1) return true
  const previous = whySteps.find((why) => why.step === step - 1)
  return Boolean(previous?.answer.trim())
}

export function fiveWhyComplete(whySteps: WhyStep[]): boolean {
  return whySteps.every((why) => why.answer.trim().length > 0)
}

export function rootCauseSummary(rootCause: RootCause | null): string {
  return rootCause?.summary ?? ""
}
