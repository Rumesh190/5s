import { formatDaysAgo } from "@/lib/audits/format"
import { AUDITS_MOCK } from "@/lib/mock/audits.mock"
import type { AuditDetails, ChecklistItem, Finding } from "@/types/audit-details"

type CuratedDetails = Omit<
  AuditDetails,
  "id" | "title" | "region" | "plant" | "department" | "severity" | "status" | "assignedTo" | "progress" | "createdDaysAgo" | "updatedDaysAgo"
>

/**
 * Hand-authored, realistic detail data for a representative handful of
 * audits. Every other audit in AUDITS_MOCK still resolves via
 * `baseDetailsFor` below, so no ID ever renders a broken page — it just
 * falls back to a lighter record until it's curated too.
 */
const CURATED_DETAILS: Record<string, CuratedDetails> = {
  "AUD-1042": {
    productionLine: "Line 3",
    productName: "Chassis Frame Weld Assembly",
    city: "Chennai",
    reportedBy: "Arun Kumar",
    assignedInvestigator: "Priya Singh",
    dueDate: "Aug 12, 2026",
    problemStatement:
      "Intermittent porosity detected in weld seams on chassis frame assemblies produced on Line 3, exceeding the acceptable defect rate of 0.5%.",
    immediateAction:
      "Line 3 output quarantined pending inspection; affected batch (2,140 units) placed on hold.",
    checklist: [
      { id: "chk-1", category: "Pre-Weld", label: "Base metal cleanliness verified", checked: true },
      { id: "chk-2", category: "Pre-Weld", label: "Shielding gas flow rate checked", checked: true },
      { id: "chk-3", category: "Process", label: "Welder certification current", checked: true },
      { id: "chk-4", category: "Process", label: "Weld parameters within spec", checked: false },
      { id: "chk-5", category: "Post-Weld", label: "Visual inspection completed", checked: true },
      { id: "chk-6", category: "Post-Weld", label: "NDT sampling performed", checked: false },
    ],
    findings: [
      {
        id: "FND-2401",
        title: "Porosity exceeds 0.5% defect threshold",
        severity: "High",
        status: "In Progress",
        owner: "Priya Singh",
        dueDate: "Aug 10, 2026",
        progress: 55,
      },
      {
        id: "FND-2402",
        title: "Shielding gas flow inconsistent at Station 3B",
        severity: "Medium",
        status: "Open",
        owner: "Karthik Rao",
        dueDate: "Aug 14, 2026",
        progress: 10,
      },
    ],
    attachments: [
      { id: "att-1", name: "weld-seam-defect-01.jpg", type: "image", sizeLabel: "2.4 MB", uploadedBy: "Arun Kumar", uploadedAt: "2h ago" },
      { id: "att-2", name: "NDT-Report-AUD1042.pdf", type: "pdf", sizeLabel: "1.1 MB", uploadedBy: "Priya Singh", uploadedAt: "1d ago" },
      { id: "att-3", name: "Weld-Parameter-Log.docx", type: "document", sizeLabel: "480 KB", uploadedBy: "Karthik Rao", uploadedAt: "1d ago" },
    ],
    activity: [
      { id: "act-1", type: "Status Changed", description: "Status changed from Open to In Progress", actor: "Priya Singh", timestamp: "Today" },
      { id: "act-2", type: "Attachment Uploaded", description: "Uploaded weld-seam-defect-01.jpg", actor: "Arun Kumar", timestamp: "2h ago" },
      { id: "act-3", type: "Corrective Action Added", description: "Added finding FND-2402 — shielding gas flow inconsistency", actor: "Karthik Rao", timestamp: "1d ago" },
      { id: "act-4", type: "User Assigned", description: "Assigned Priya Singh as lead investigator", actor: "Arun Kumar", timestamp: "3d ago" },
      { id: "act-5", type: "Audit Created", description: "Audit AUD-1042 was created", actor: "Arun Kumar", timestamp: "4d ago" },
    ],
    relatedInvestigations: [
      { id: "INV-208", title: "Dimensional deviation — bracket assembly", status: "Critical", severity: "Critical" },
    ],
  },

  "AUD-1044": {
    productionLine: "Line 1",
    productName: "Housing Unit 12B",
    city: "Coimbatore",
    reportedBy: "Ananya Rao",
    assignedInvestigator: "Ananya Rao",
    dueDate: "Aug 9, 2026",
    problemStatement:
      "Surface finish non-conformance identified on housing units — visible tooling marks and inconsistent coating thickness affecting 8% of the daily run.",
    immediateAction: "Affected units segregated for rework; coating booth parameters under review.",
    checklist: [
      { id: "chk-1", category: "Surface Prep", label: "Degreasing cycle verified", checked: true },
      { id: "chk-2", category: "Coating", label: "Booth temperature within range", checked: false },
      { id: "chk-3", category: "Coating", label: "Coating thickness sampled", checked: true },
      { id: "chk-4", category: "Final Inspection", label: "Surface finish gauge check completed", checked: false },
    ],
    findings: [
      {
        id: "FND-2410",
        title: "Coating thickness variance exceeds tolerance",
        severity: "Critical",
        status: "In Progress",
        owner: "Ananya Rao",
        dueDate: "Aug 8, 2026",
        progress: 40,
      },
      {
        id: "FND-2411",
        title: "Tooling marks visible on 3% of sampled units",
        severity: "Medium",
        status: "Open",
        owner: "Meera Alvarez",
        dueDate: "Aug 15, 2026",
        progress: 5,
      },
    ],
    attachments: [
      { id: "att-1", name: "coating-thickness-chart.pdf", type: "pdf", sizeLabel: "890 KB", uploadedBy: "Ananya Rao", uploadedAt: "5h ago" },
      { id: "att-2", name: "housing-surface-defect.jpg", type: "image", sizeLabel: "3.1 MB", uploadedBy: "Meera Alvarez", uploadedAt: "1d ago" },
    ],
    activity: [
      { id: "act-1", type: "Investigation Updated", description: "Root cause narrowed to booth temperature drift", actor: "Ananya Rao", timestamp: "5h ago" },
      { id: "act-2", type: "Attachment Uploaded", description: "Uploaded coating-thickness-chart.pdf", actor: "Ananya Rao", timestamp: "5h ago" },
      { id: "act-3", type: "Status Changed", description: "Status changed from Open to In Progress", actor: "Ananya Rao", timestamp: "2d ago" },
      { id: "act-4", type: "Audit Created", description: "Audit AUD-1044 was created", actor: "Ananya Rao", timestamp: "3d ago" },
    ],
    relatedInvestigations: [],
  },

  "AUD-1038": {
    productionLine: "Receiving Bay 2",
    productName: "Fastener Batch 2291",
    city: "Sriperumbudur",
    reportedBy: "Sara Iyer",
    assignedInvestigator: "Sara Iyer",
    dueDate: "Aug 8, 2026",
    problemStatement:
      "Incoming fastener batch 2291 flagged during receiving inspection — certificate of conformance mismatch against PO specification.",
    immediateAction: "Batch placed on hold in quarantine area pending supplier clarification.",
    checklist: [
      { id: "chk-1", category: "Receiving", label: "Certificate of conformance reviewed", checked: true },
      { id: "chk-2", category: "Receiving", label: "Sample dimensional check performed", checked: true },
      { id: "chk-3", category: "Receiving", label: "Supplier notified of discrepancy", checked: true },
      { id: "chk-4", category: "Disposition", label: "Batch disposition decided", checked: false },
    ],
    findings: [
      {
        id: "FND-2420",
        title: "Certificate of conformance references wrong material grade",
        severity: "Medium",
        status: "In Progress",
        owner: "Sara Iyer",
        dueDate: "Aug 8, 2026",
        progress: 80,
      },
    ],
    attachments: [
      { id: "att-1", name: "batch-2291-coc.pdf", type: "pdf", sizeLabel: "620 KB", uploadedBy: "Sara Iyer", uploadedAt: "1d ago" },
    ],
    activity: [
      { id: "act-1", type: "Corrective Action Added", description: "Added finding FND-2420 — CoC material grade mismatch", actor: "Sara Iyer", timestamp: "1d ago" },
      { id: "act-2", type: "Attachment Uploaded", description: "Uploaded batch-2291-coc.pdf", actor: "Sara Iyer", timestamp: "1d ago" },
      { id: "act-3", type: "Audit Created", description: "Audit AUD-1038 was created", actor: "Sara Iyer", timestamp: "6d ago" },
    ],
    relatedInvestigations: [],
  },

  "AUD-1019": {
    productionLine: "Maintenance Bay",
    productName: undefined,
    city: "Hosur",
    reportedBy: "Rahul Mehta",
    assignedInvestigator: "Rahul Mehta",
    dueDate: "Aug 5, 2026",
    problemStatement:
      "Scheduled preventive maintenance review identified overdue calibration on two torque wrenches used in final assembly.",
    immediateAction: "Affected torque wrenches pulled from service and sent for calibration.",
    checklist: [
      { id: "chk-1", category: "PM Schedule", label: "PM checklist reviewed against schedule", checked: true },
      { id: "chk-2", category: "PM Schedule", label: "Calibration records verified", checked: true },
      { id: "chk-3", category: "Follow-up", label: "Replacement tools issued", checked: false },
    ],
    findings: [
      {
        id: "FND-2430",
        title: "Torque wrench calibration overdue by 12 days",
        severity: "Low",
        status: "In Progress",
        owner: "Rahul Mehta",
        dueDate: "Aug 6, 2026",
        progress: 65,
      },
    ],
    attachments: [],
    activity: [
      { id: "act-1", type: "Corrective Action Added", description: "Added finding FND-2430 — overdue calibration", actor: "Rahul Mehta", timestamp: "2d ago" },
      { id: "act-2", type: "Audit Created", description: "Audit AUD-1019 was created", actor: "Rahul Mehta", timestamp: "33d ago" },
    ],
    relatedInvestigations: [],
  },
}

function baseDetailsFor(record: (typeof AUDITS_MOCK)[number]): CuratedDetails {
  return {
    productionLine: "Line 1",
    productName: undefined,
    city: record.plant.replace(" Plant", ""),
    reportedBy: record.assignedTo,
    assignedInvestigator: record.assignedTo,
    dueDate: undefined,
    problemStatement: undefined,
    immediateAction: undefined,
    checklist: [],
    findings: [],
    attachments: [],
    activity: [
      {
        id: "act-created",
        type: "Audit Created",
        description: `Audit ${record.id} was created`,
        actor: record.assignedTo,
        timestamp: formatDaysAgo(record.createdDaysAgo),
      },
    ],
    relatedInvestigations: [],
  }
}

export function getAuditDetails(id: string): AuditDetails | undefined {
  const record = AUDITS_MOCK.find((audit) => audit.id === id)
  if (!record) return undefined

  const details = CURATED_DETAILS[id] ?? baseDetailsFor(record)
  return { ...record, ...details }
}

export function openFindingsCount(findings: Finding[]): number {
  return findings.filter((finding) => finding.status !== "Resolved" && finding.status !== "Closed").length
}

export function criticalFindingsCount(findings: Finding[]): number {
  return findings.filter((finding) => finding.severity === "Critical").length
}

export function checklistProgress(checklist: ChecklistItem[]): { done: number; total: number } {
  return { done: checklist.filter((item) => item.checked).length, total: checklist.length }
}
