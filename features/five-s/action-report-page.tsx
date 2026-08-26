"use client";

import {
  ArrowLeft, Building2, Check, CheckCircle2,
  ClipboardCheck, FileText, Flag, MapPin, Play, Printer,
  Send, ShieldCheck, Sparkles, UserRound, Warehouse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MyAction, MyActionActivity, MyActionEvidence } from "./types/my-actions";

interface Props { action: MyAction; onBack: () => void; backLabel?: string }

const ACTIVITY_LABELS: Record<MyActionActivity["type"], string> = {
  created: "Action created", awaiting_assignment: "Awaiting assignment",
  assigned: "Assigned", started: "Work started", submitted: "Submitted for review",
  resubmitted: "Resubmitted for review", reviewed: "Reviewed", sent_back: "Sent back for rework", closed: "Approved & closed",
};

export default function FiveSActionReportPage({ action, onBack, backLabel = "Back to Actions" }: Props) {
  const history = action.activityHistory ?? [];
  const assigned = history.find((event) => event.type === "assigned");
  const started = history.find((event) => event.type === "started");
  const submitted = [...history].reverse().find((event) => event.type === "submitted" || event.type === "resubmitted");
  const reviewed = [...history].reverse().find((event) => event.type === "reviewed");
  const closed = [...history].reverse().find((event) => event.type === "closed");
  const responsible = action.responsiblePersonName ?? action.assignedTo;
  const approver = action.reviewedBy ?? action.createdByName ?? action.auditor ?? "—";
  const completedAt = closed?.createdAt ?? action.completedAt;
  const result = action.resolutionObservation ?? action.actionTakenDescription ?? "No improvement result recorded.";
  const beforeText = action.originalFinding ?? action.description;
  const afterText = result;
  const generatedAt = formatDateTime(new Date().toISOString());
  const responsiblePhoto = responsible === "Siva" || responsible === "Siva Kumar" ? "/demo-5s/siva.jpeg" : responsible === "Rumesh" ? "/demo-5s/rumesh.jpeg" : undefined;
  const approverPhoto = approver === "Lakshman" ? "/demo-5s/balaji.jpeg" : undefined;

  const timeline = [
    { label: "Assigned", icon: UserRound, tone: "blue", event: assigned, fallbackDate: action.createdAt, fallbackActor: action.createdByName ?? action.auditor },
    { label: "Work Started", icon: Play, tone: "sky", event: started },
    { label: "Submitted for Review", icon: Send, tone: "amber", event: submitted, fallbackDate: action.submittedForReviewAt, fallbackActor: responsible },
    { label: "Reviewed", icon: ClipboardCheck, tone: "violet", event: reviewed, fallbackDate: action.reviewedAt, fallbackActor: action.reviewedBy ?? action.auditor },
    { label: "Closed", icon: Check, tone: "green", event: closed, fallbackDate: action.completedAt, fallbackActor: approver },
  ] as const;

  async function handlePrint() {
    await document.fonts?.ready;
    const report = document.querySelector<HTMLElement>(".completed-action-report");
    const images = report ? Array.from(report.querySelectorAll("img")) : [];
    await Promise.all(images.map(async (image) => {
      if (image.complete) return;
      try { await image.decode(); } catch { /* The browser will print the fallback state. */ }
    }));
    window.print();
  }

  return (
    <div className="action-report-page -m-5 min-h-screen bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:-m-6 sm:p-6 lg:-m-7 xl:-m-8">
      <div className="action-report-controls mx-auto mb-4 flex max-w-[1180px] flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="size-4" /> {backLabel}</Button>
        <Button onClick={handlePrint}><Printer className="size-4" /> Print / Save PDF</Button>
      </div>

      <article className="completed-action-report action-report-document mx-auto max-w-[1180px] overflow-hidden rounded-xl border border-blue-200 bg-white shadow-[0_18px_55px_-42px_rgba(30,64,175,0.45)] dark:border-slate-700 dark:bg-slate-900">
        <ReportHeader action={action} generatedAt={generatedAt} />

        <div className="space-y-3 p-4 sm:p-5">
          <ReportMetadata action={action} completedAt={completedAt} />

          <section className="action-report-block rounded-lg border border-blue-100 bg-blue-50/[0.12] p-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="improvement-comparison grid gap-3 lg:grid-cols-[minmax(0,2fr)_44px_minmax(170px,1fr)_44px_minmax(0,2fr)] lg:items-center">
              <EvidencePanel tone="before" label="Not Good (Before)" evidence={action.issueEvidence ?? []} description={beforeText} empty="No original evidence captured" />
              <DirectionArrow />
              <CompletedByPanel name={responsible} department={action.department} zone={action.area} completedAt={completedAt} photo={responsiblePhoto} />
              <DirectionArrow />
              <EvidencePanel tone="after" label="Good (After)" evidence={action.evidence} description={afterText} empty="No completion evidence captured" />
            </div>
          </section>

          <section className="action-report-block">
            <div className="improvement-details grid gap-3 md:grid-cols-3">
              <DetailCard icon={Flag} title="Original Finding" text={action.originalFinding ?? action.description} />
              <DetailCard icon={ClipboardCheck} title="Corrective Action" text={action.description} />
              <DetailCard icon={Sparkles} title="Improvement Result / Remarks" text={result} />
            </div>
          </section>

          <section className="action-report-block rounded-lg border border-blue-200 bg-blue-50/[0.16] px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
            <SectionTitle>Action Timeline</SectionTitle>
            <div className="timeline-scroll overflow-x-auto">
              <div className="action-timeline relative grid min-w-[720px] grid-cols-5 pt-1">
                <span className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-blue-400 dark:bg-blue-800" aria-hidden="true" />
                {timeline.map((stage) => <TimelineStage key={stage.label} {...stage} />)}
              </div>
            </div>
          </section>

          <section className="report-signoff action-report-block grid overflow-hidden rounded-lg border border-blue-100 bg-white lg:grid-cols-[1fr_1fr_2fr] lg:divide-x lg:divide-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:lg:divide-slate-700">
            <ApprovalPanel title="Prepared By (Completed By)" name={responsible} role={`${action.department} • ${action.area}`} date={completedAt} photo={responsiblePhoto} />
            <ApprovalPanel title="Reviewed & Approved By" name={approver} role="Auditor" date={action.reviewedAt ?? completedAt} photo={approverPhoto} />
            <ReviewHistory history={history} reviewedAt={action.reviewedAt} reviewedBy={action.reviewedBy ?? action.auditor} />
          </section>

          <footer className="action-report-block flex items-center justify-center gap-3 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 px-4 py-3 text-blue-800 dark:border-blue-900/60 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/40 dark:text-blue-200">
            <ShieldCheck className="size-5 shrink-0 text-blue-600" /><p className="text-xs font-semibold">This improvement has been verified and approved.</p><span className="hidden text-[10px] font-medium text-blue-600/70 sm:inline">Report Generated {generatedAt}</span>
          </footer>
        </div>
      </article>
    </div>
  );
}

function ReportHeader({ action, generatedAt }: { action: MyAction; generatedAt: string }) {
  return <header className="report-header action-report-block relative border-b border-blue-100 bg-gradient-to-b from-blue-50/60 to-white px-4 py-5 text-center dark:border-slate-700 dark:from-blue-950/25 dark:to-slate-900 sm:px-7"><div className="mb-3 flex justify-center sm:absolute sm:right-5 sm:top-4 sm:mb-0"><Badge variant="success" className="border-green-300 bg-green-50 px-3 py-1 text-green-700 uppercase tracking-wide shadow-none dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"><CheckCircle2 className="size-3.5" /> Completed</Badge></div><p className="text-xl font-extrabold uppercase tracking-[0.04em] text-blue-800 dark:text-blue-300 sm:text-[30px] sm:tracking-[0.055em]">5S Improvement Report</p><div className="mt-2 flex min-w-0 flex-wrap justify-center gap-x-8 gap-y-1 text-xs text-slate-600 dark:text-slate-300"><span className="break-all"><strong className="text-blue-800 dark:text-blue-300">Improvement No:</strong> {action.id}</span><span><strong>Report Generated:</strong> {generatedAt}</span></div><h1 className="mx-auto mt-3 max-w-4xl break-words text-lg font-extrabold tracking-tight text-slate-950 dark:text-white sm:px-16 sm:text-[25px]">{action.title}</h1></header>;
}

function ReportMetadata({ action, completedAt }: { action: MyAction; completedAt?: string }) {
  const primary = [
    [Building2, "Plant", action.plant], [MapPin, "Zone", action.area], [Warehouse, "Department", action.department], [Sparkles, "5S Section", action.category ?? "—"], [FileText, "Audit ID", action.sourceTitle],
  ] as const;
  const secondary = [
    ["Priority", action.priority, "text-red-600 dark:text-red-400"], ["Due Date", formatDate(action.dueDate), ""], ["Completed On", formatDate(completedAt), ""], ["Completion", shortPerformance(action.dueDate, completedAt), "text-emerald-700 dark:text-emerald-400"], ["Cost Saving", formatCurrency(action.costSaving), "text-emerald-700 dark:text-emerald-400"], ["Category", action.actionCategory ?? "—", ""], ["Classification", action.improvementClassification ?? "Improvement Case", ""], ["Theme", action.improvementTheme ?? action.title, ""],
  ] as const;
  return <section className="report-metadata action-report-block overflow-hidden rounded-lg border border-blue-200 bg-white dark:border-slate-700 dark:bg-slate-900"><div className="metadata-primary grid grid-cols-2 divide-x divide-y divide-blue-100 dark:divide-slate-700 sm:grid-cols-5">{primary.map(([Icon, label, value]) => <div key={label} className="flex min-w-0 items-center gap-2.5 p-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"><Icon className="size-4" /></span><div className="min-w-0"><p className="text-[9px] font-bold tracking-wide text-slate-500">{label}</p><p className="mt-0.5 truncate text-xs font-bold" title={value}>{value}</p></div></div>)}</div><div className="metadata-secondary grid grid-cols-2 divide-x divide-y divide-blue-100 border-t border-blue-200 bg-slate-50/40 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800/25 sm:grid-cols-4 lg:grid-cols-8">{secondary.map(([label, value, tone]) => <div key={label} className="min-w-0 p-2.5"><p className="text-[9px] font-medium text-slate-500">{label}</p><p className={`mt-1 text-[11px] font-bold leading-4 ${tone}`} title={value}>{value}</p></div>)}</div></section>;
}

function EvidencePanel({ tone, label, evidence, description, empty }: { tone: "before" | "after"; label: string; evidence: MyActionEvidence[]; description: string; empty: string }) {
  const primary = evidence.find((item) => item.type === "image" && item.url);
  const before = tone === "before";
  return <div className="overflow-hidden rounded-lg border border-blue-100 bg-white dark:border-slate-700 dark:bg-slate-900"><div className="flex justify-center px-3 py-1.5"><Badge className={before ? "border border-red-600 bg-red-600 px-4 py-1 text-white shadow-sm hover:bg-red-600" : "border border-green-600 bg-green-600 px-4 py-1 text-white shadow-sm hover:bg-green-600"}>{label}</Badge></div>{primary ? <div className="mx-3 aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"><img src={primary.url} alt={primary.name} className="size-full object-cover" /></div> : <div className="mx-3 flex aspect-[4/3] items-center justify-center rounded-md bg-slate-50 dark:bg-slate-800"><div className="text-center"><FileText className="mx-auto size-7 text-slate-400" /><p className="mt-2 text-xs text-slate-500">{empty}</p></div></div>}<p className="min-h-14 px-4 py-2.5 text-center text-xs font-semibold leading-5 text-slate-700 dark:text-slate-200">{description}</p>{evidence.length > 1 && <div className="flex gap-1.5 border-t border-slate-200 p-2 dark:border-slate-700">{evidence.slice(1).map((item) => item.url && <img key={item.id} src={item.url} alt={item.name} className="size-9 rounded object-cover" />)}</div>}</div>;
}

function CompletedByPanel({ name, department, zone, completedAt, photo }: { name: string; department: string; zone: string; completedAt?: string; photo?: string }) {
  return <div className="rounded-lg border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-3 text-center dark:border-blue-900/70 dark:from-blue-950/35 dark:to-slate-900"><p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-blue-700 dark:text-blue-300">Completed By</p><ProfilePhoto name={name} photo={photo} large /><p className="mt-2 text-base font-extrabold">{name}</p><p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">{department} <span className="mx-1 text-blue-400">•</span> {zone}</p><div className="mt-3 border-t border-blue-100 pt-2 dark:border-blue-900"><p className="text-[10px] font-medium text-slate-500">Completed On: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDateTime(completedAt)}</span></p></div></div>;
}

function DirectionArrow() { return <div className="hidden items-center lg:flex"><span className="h-0.5 flex-1 bg-blue-500" /><span className="text-2xl font-bold leading-none text-blue-600">›</span></div> }

function DetailCard({ icon: Icon, title, text }: { icon: typeof Flag; title: string; text: string }) { return <article className="rounded-lg border border-blue-200 bg-white p-3 shadow-[0_6px_16px_-16px_rgba(30,64,175,0.7)] dark:border-slate-700 dark:bg-slate-900"><div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.04em] text-blue-700 dark:text-blue-400"><span className="flex size-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40"><Icon className="size-4" /></span>{title}</div><p className="mt-2 text-xs font-medium leading-5 text-slate-700 dark:text-slate-300">{text}</p></article> }

const TIMELINE_TONES = {
  blue: "border-blue-600 bg-blue-600 text-white",
  sky: "border-sky-500 bg-sky-500 text-white",
  amber: "border-amber-500 bg-amber-500 text-white",
  violet: "border-violet-500 bg-violet-500 text-white",
  green: "border-green-600 bg-green-600 text-white",
} as const;

function TimelineStage({ label, icon: Icon, tone, event, fallbackDate, fallbackActor }: { label: string; icon: typeof UserRound; tone: keyof typeof TIMELINE_TONES; event?: MyActionActivity; fallbackDate?: string; fallbackActor?: string }) {
  const actor = event?.actorName ?? fallbackActor;
  return <div className="relative z-10 min-w-0 px-2 text-center"><span className={`relative z-10 mx-auto flex size-8 items-center justify-center rounded-full border-2 shadow-sm ${TIMELINE_TONES[tone]}`}><Icon className="size-4" /></span><div><p className="mt-2 text-[10px] font-extrabold leading-4">{label}</p><p className="mt-1 text-[9px] leading-4 text-slate-600 dark:text-slate-400">{formatDateTime(event?.createdAt ?? fallbackDate)}</p><p className="text-[9px] font-medium text-slate-600 dark:text-slate-400">{actor ? `by ${actor}` : "—"}</p></div></div>;
}

function ApprovalPanel({ title, name, role, date, photo }: { title: string; name: string; role: string; date?: string; photo?: string }) { return <article className="p-4"><p className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400">{title}</p><div className="mt-3 flex items-center gap-3"><ProfilePhoto name={name} photo={photo} /><div className="min-w-0"><p className="truncate text-sm font-extrabold">{name}</p><p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{role}</p><p className="mt-1 text-[9px] text-slate-500">Date: {formatDateTime(date)}</p></div></div></article> }

function ReviewHistory({ history, reviewedAt, reviewedBy }: { history: MyActionActivity[]; reviewedAt?: string; reviewedBy?: string }) {
  const events = [...history];
  const hasReview = !events.some((event) => event.type === "reviewed") && events.some((event) => event.type === "closed") && reviewedAt;
  return <article className="p-4"><p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-blue-700 dark:text-blue-400">Review History</p><ol className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">{events.flatMap((event) => { const rows = [<HistoryRow key={event.id} label={`${ACTIVITY_LABELS[event.type]} by ${event.actorName}`} date={event.createdAt} remark={event.remark} />]; if (event.type === "closed" && hasReview) rows.unshift(<HistoryRow key={`${event.id}-reviewed`} label={`Reviewed by ${reviewedBy ?? event.actorName}`} date={reviewedAt} />); return rows; })}</ol></article>;
}

function HistoryRow({ label, date, remark }: { label: string; date?: string; remark?: string }) { return <li className="review-history-row relative min-w-0 border-l border-slate-300 pl-3 dark:border-slate-600"><span className="absolute -left-[3px] top-1 size-[5px] rounded-full bg-blue-600" /><p className="min-w-0 text-[10px] font-semibold leading-4">{label}</p><p className="text-[9px] text-slate-500">{formatDateTime(date)}</p>{remark && <p className="mt-1 text-[9px] italic leading-4 text-slate-600 dark:text-slate-300">Remark: {remark}</p>}</li> }

function ProfilePhoto({ name, photo, large = false }: { name: string; photo?: string; large?: boolean }) { const size = large ? "mx-auto mt-3 size-32" : "size-14"; return photo ? <img src={photo} alt={`${name} profile`} className={`${size} shrink-0 rounded-full border-4 border-white object-cover object-center shadow-md dark:border-slate-700`} /> : <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200`}>{initials(name)}</span> }
function SectionTitle({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) { return <h2 className={`mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400 ${centered ? "text-center" : ""}`}>{children}</h2> }

function initials(name: string) { return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() }
function formatCurrency(value?: number) { return `₹${(value ?? 0).toLocaleString("en-IN")}` }
function formatDate(value?: string) { if (!value) return "—"; const date = parseDate(value); return date ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date) : value }
function formatDateTime(value?: string) { if (!value) return "—"; const date = parseDate(value); return date ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", ...(value.includes("T") ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(date) : value }
function parseDate(value: string) { const date = new Date(value.includes("T") ? value : `${value}T00:00:00`); return Number.isNaN(date.getTime()) ? null : date }
function shortPerformance(dueDate: string, completedAt?: string) { if (!completedAt) return "—"; const due = parseDate(dueDate); const completed = parseDate(completedAt); if (!due || !completed) return "—"; due.setHours(0, 0, 0, 0); completed.setHours(0, 0, 0, 0); const days = Math.round((completed.getTime() - due.getTime()) / 86_400_000); if (days === 0) return "On time"; return days < 0 ? `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} early` : `${days} day${days === 1 ? "" : "s"} overdue` }
