"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  History,
  Image as ImageIcon,
  IndianRupee,
  Maximize2,
  Paperclip,
  Play,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FiveSPageHeader from "@/features/five-s/components/FiveSPageHeader";
import AfterPhotoCaptureDialog from "@/features/five-s/components/AfterPhotoCaptureDialog";
import type { MyAction, MyActionActivity, MyActionEvidence } from "@/features/five-s/types/my-actions";
import {
  addActionEvidence,
  assignActionToZoneMember,
  closeReviewedAction,
  removeActionEvidence,
  sendActionBack,
  startAssignedAction,
  submitActionForReview,
  updateAction,
  useActionStore,
} from "@/lib/actions/action-store";
import { FIVE_S_CORRECTIVE_ACTION_CATEGORIES, getFiveSZoneConfiguration } from "@/lib/five-s/configuration";
import { getActionStatusLabel } from "@/lib/five-s/lifecycle-status";
import { useCurrentUser } from "@/lib/current-user";
import { MAX_EVIDENCE_IMAGES } from "@/lib/evidence-images";

const STATUS_VARIANTS = {
  Assigned: "info",
  Open: "info",
  "In Progress": "info",
  Overdue: "danger",
  "Awaiting Review": "info",
  "Awaiting Assignment": "muted",
  "Rework Required": "danger",
  Completed: "success",
} as const;

const PRIORITY_VARIANTS = {
  Low: "secondary",
  Medium: "warning",
  High: "danger",
  Critical: "danger",
} as const;

const ACTIVITY_LABELS: Record<MyActionActivity["type"], string> = {
  created: "Action created",
  proposed: "Proposed action submitted",
  awaiting_assignment: "Awaiting Zone Leader assignment",
  assigned: "Action assigned",
  started: "Work started",
  submitted: "Submitted for review",
  resubmitted: "Resubmitted for review",
  review_requested: "Awaiting Zone Leader Review",
  reviewed: "Reviewed",
  sent_back: "Sent back for rework",
  closed: "Action closed",
};

interface ActionDetailProps {
  actionId: string;
}

export default function FiveSActionDetailPage({ actionId }: ActionDetailProps) {
  const router = useRouter();
  const actions = useActionStore();
  const action = actions.find((item) => item.id === actionId);
  const actor = useCurrentUser();
  const [observation, setObservation] = useState("");
  const [category, setCategory] = useState("");
  const [costSaving, setCostSaving] = useState("0");
  const [sendBackOpen, setSendBackOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [assignmentPlan, setAssignmentPlan] = useState("");
  const [preview, setPreview] = useState<MyActionEvidence | null>(null);
  const [afterCameraOpen, setAfterCameraOpen] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<"start" | "submit" | "send-back" | "close" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!action) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setObservation(action.resolutionObservation ?? action.actionTakenDescription ?? "");
      setCategory(action.correctiveActionCategory ?? "");
      setCostSaving(String(action.costSaving ?? 0));
      setAssignmentPlan(action.actionPlan ?? action.proposedAction ?? action.description);
    });
    return () => { cancelled = true; };
  }, [action]);

  const latestRework = useMemo(
    () => [...(action?.reviewHistory ?? [])].reverse().find((item) => item.type === "sent_back"),
    [action?.reviewHistory]
  );

  if (!action) {
    return (
      <PageContainer>
        <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-xl border border-dashed bg-card text-center">
          <FileText className="size-9 text-muted-foreground" />
          <h1 className="mt-4 text-lg font-semibold">Action not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">This action may have been removed or is unavailable.</p>
          <Button className="mt-5" variant="outline" onClick={() => router.push("/5s/actions")}>
            <ArrowLeft className="size-4" /> Back to Actions
          </Button>
        </div>
      </PageContainer>
    );
  }

  const isResponsible = action.responsiblePersonId
    ? action.responsiblePersonId === actor.id
    : action.assignedTo === actor.name;
  const canEdit = isResponsible && ["Assigned", "Open", "In Progress", "Rework Required"].includes(action.status);
  const zoneConfiguration = getFiveSZoneConfiguration(action.area);
  const canAssign = action.status === "Awaiting Assignment" && zoneConfiguration?.leaderId === actor.id;
  const canReview = zoneConfiguration?.leaderId === actor.id && action.status === "Awaiting Review";
  const canStart = isResponsible && ["Assigned", "Open", "Rework Required"].includes(action.status);
  const submitLabel = action.status === "Rework Required" ? "Resubmit for Review" : "Submit for Review";
  const validResolution = observation.trim() && Boolean(category) && action.evidence.length > 0 && Number.isFinite(Number(costSaving)) && Number(costSaving) >= 0;
  const nextExpectedAction = action.status === "Completed"
    ? "Closed — no further action required"
    : canAssign
      ? "Review the plan and assign a Zone Member"
      : canReview
        ? "Review the submitted work and make a decision"
        : isResponsible && canStart
          ? "Start work and complete the corrective measure"
          : isResponsible && action.status === "In Progress"
            ? "Complete the work and submit it for review"
            : action.status === "Awaiting Review"
              ? "Awaiting Zone Leader review"
              : action.status === "Rework Required"
                ? "Address the review feedback and resubmit"
                : "Track the assigned corrective action";
  const roleContext = canReview || canAssign
    ? "Your role: Zone Leader · Assignment and review controls are available when this action reaches your step."
    : isResponsible
      ? "Your role: Zone Member · Complete the assigned work and submit evidence for Zone Leader review."
      : "Your role: Auditor · You can monitor this action; approval and closure remain with the Zone Leader.";

  function syncFields(updated: MyAction | undefined) {
    if (!updated) return;
    setObservation(updated.resolutionObservation ?? updated.actionTakenDescription ?? "");
    setCategory(updated.correctiveActionCategory ?? "");
    setCostSaving(String(updated.costSaving ?? 0));
  }

  function saveProgress() {
    if (!canEdit) return;
    syncFields(updateAction(actionId, {
      actionTakenDescription: observation,
      resolutionObservation: observation,
      correctiveActionCategory: category,
      costSaving: Number.isFinite(Number(costSaving)) ? Number(costSaving) : undefined,
      currency: "INR",
    }));
  }

  function submitForReview() {
    if (pendingTransition) return;
    const correctiveActionCategory = category;
    setPendingTransition("submit");
    window.setTimeout(() => { const updated = submitActionForReview(actionId, actor, { observation, correctiveActionCategory, costSaving: Number(costSaving) }); syncFields(updated); if (updated) setSuccessMessage("Action submitted for Zone Leader review."); setPendingTransition(null); }, 220);
  }

  function startWork() {
    if (pendingTransition) return;
    setPendingTransition("start");
    window.setTimeout(() => { startAssignedAction(actionId, actor); setPendingTransition(null); }, 220);
  }

  function addCapturedAfterPhoto(photo: string) {
    if (!canEdit) return;
    if ((action?.evidence.length ?? 0) >= MAX_EVIDENCE_IMAGES) {
      window.alert("Maximum 5 evidence images allowed.");
      return;
    }
    addActionEvidence(actionId, {
      id: `EV-${crypto.randomUUID()}`,
      name: `After photo ${new Date().toLocaleString("en-IN")}.jpg`,
      type: "image",
      evidenceType: "resolution",
      mimeType: "image/jpeg",
      uploadedAt: new Date().toISOString(),
      uploadedBy: actor.name,
      url: photo,
    });
  }

  function confirmSendBack() {
    if (!remark.trim()) return;
    setPendingTransition("send-back");
    window.setTimeout(() => { const updated = sendActionBack(actionId, actor, remark); if (updated) { setSuccessMessage("Action returned for rework."); setRemark(""); setSendBackOpen(false); } setPendingTransition(null); }, 220);
  }

  function confirmClose() {
    setPendingTransition("close");
    window.setTimeout(() => { const updated = closeReviewedAction(actionId, actor); if (updated) { setSuccessMessage("Action approved and closed."); setCloseOpen(false); } setPendingTransition(null); }, 260);
  }

  return (
    <PageContainer className="max-w-none">
      <FiveSPageHeader
        eyebrow="Actions / Action Details"
        title={action.title}
        description={`${action.status} · ${action.priority} priority · ${action.sourceTitle}`}
        leading={
          <Button variant="ghost" size="icon-sm" className="size-11 md:size-8" onClick={() => router.push("/5s/actions")} aria-label="Back to Actions">
            <ArrowLeft className="size-4" />
          </Button>
        }
        actions={
          <>
            {action.status === "Completed" && (
              <Button variant="outline" onClick={() => router.push(`/5s/actions/${encodeURIComponent(action.id)}/report`)}>
                <FileText className="size-4" /> View Report
              </Button>
            )}
          </>
        }
        toolbar={
          <div className="hidden w-full min-w-0 items-center overflow-x-auto pb-0.5 md:flex">
            <LifecycleTimeline action={action} />
          </div>
        }
      />

      {successMessage && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400">{successMessage}</div>}

      <div className="hidden rounded-lg border bg-muted/20 px-4 py-3 text-sm text-muted-foreground md:block">{roleContext}</div>

      <MobileActionContext action={action} nextExpectedAction={nextExpectedAction} />

      {canAssign && <Panel title="Action Plan Assignment" icon={<ClipboardCheck className="size-4 text-primary" />}>
        <div className="grid gap-5">
          <div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Finding</p><p className="mt-2 text-sm font-medium leading-6">{action.originalFinding ?? action.description}</p></div>
          <div><div className="flex items-center justify-between gap-3"><label htmlFor="assignment-action-plan" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Auditor&apos;s Proposed Action</label><span className="text-[10px] tabular-nums text-muted-foreground">{assignmentPlan.length} / 500</span></div><Textarea id="assignment-action-plan" rows={4} maxLength={500} className="mt-2 min-h-24" value={assignmentPlan} onChange={(event)=>setAssignmentPlan(event.target.value)} /><p className="mt-1.5 text-xs text-muted-foreground">Review and refine this plan before assigning it. The auditor&apos;s original proposal remains preserved.</p></div>
          <div className="grid gap-4 sm:grid-cols-3"><Meta label="Priority" value={action.priority}/><Meta label="Due Date" value={formatDate(action.dueDate)}/><Meta label="Proposed By" value={action.proposedActionByName ?? action.createdByName ?? action.auditor ?? "—"}/></div>
          <div className="flex flex-col gap-3 sm:flex-row"><Select value={assigneeId} onValueChange={(value)=>setAssigneeId(value??"")}><SelectTrigger className="w-full"><SelectValue placeholder="Select responsible person" /></SelectTrigger><SelectContent>{zoneConfiguration.members.map((member)=><SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent></Select><Button disabled={!assigneeId || !assignmentPlan.trim()} onClick={()=>assignActionToZoneMember(action.id, actor, { memberId: assigneeId, actionPlan: assignmentPlan })}>Assign Action</Button></div>
        </div>
      </Panel>}

      {action.status === "Rework Required" && latestRework && (
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-4 shadow-sm dark:bg-amber-400/[0.06]">
          <div className="flex gap-3">
            <RotateCcw className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">Rework Required</p>
              <p className="mt-1 text-xs text-amber-800/75 dark:text-amber-200/70">
                {latestRework.actorName} · {formatDateTime(latestRework.createdAt)}
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-950 dark:text-amber-50">{latestRework.remark}</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid min-w-0 items-start gap-5 2xl:grid-cols-[minmax(0,2.1fr)_minmax(300px,.9fr)]">
        <main className="grid gap-5">
          <div className={isResponsible ? "order-2 md:order-none" : ""}><Panel title="Original Finding" icon={<AlertCircle className="size-4 text-red-600" />}>
            <div className="grid gap-5">
              <div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Related Audit Question</p><p className="mt-2 text-sm font-medium leading-6">{action.questionText ?? "No related audit question recorded."}</p></div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-500/[0.045] px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">Finding</p><p className="mt-2 text-base font-medium leading-7">{action.originalFinding ?? action.description}</p></div>
              <div className="grid gap-4 border-t pt-4 sm:grid-cols-3"><Meta label="Compliance" value="Corrective action required" /><Meta label="Observed By" value={action.createdByName ?? action.auditor ?? "—"} /><Meta label="Observed On" value={formatDateTime(action.createdAt)} /></div>
              <div className="grid gap-4 border-t pt-4 sm:grid-cols-2"><div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Auditor&apos;s Proposed Action</p><p className="mt-2 text-sm leading-6">{action.proposedAction ?? action.description}</p><p className="mt-1 text-xs text-muted-foreground">Proposed by {action.proposedActionByName ?? action.createdByName ?? action.auditor ?? "—"}{action.proposedActionAt ? ` · ${formatDateTime(action.proposedActionAt)}` : ""}</p></div><div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Final Action Plan</p><p className="mt-2 text-sm font-semibold leading-6">{action.actionPlan ?? action.proposedAction ?? action.description}</p>{action.actionPlanEditedByName && <p className="mt-1 text-xs text-muted-foreground">Edited by {action.actionPlanEditedByName}{action.actionPlanEditedAt ? ` · ${formatDateTime(action.actionPlanEditedAt)}` : ""}</p>}</div></div>
              <div className="border-t pt-4">
                <EvidenceSection eyebrow="Before" title="Original Finding Evidence" description="Read-only evidence captured by the auditor when this action was raised." evidence={action.issueEvidence ?? []} onPreview={setPreview} />
              </div>
            </div>
          </Panel></div>

          {!canAssign && <div className={isResponsible ? "order-1 md:order-none" : ""}><Panel title="Action Plan" icon={<ClipboardCheck className="size-4 text-primary" />}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Approved plan for the responsible person</p>
            <p className="mt-2 text-base font-semibold leading-7">{action.actionPlan ?? action.proposedAction ?? action.description}</p>
            <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2"><Meta label="Assigned By" value={action.assignedByName ?? action.zoneLeaderName ?? "—"}/><Meta label="Assigned On" value={formatDateTime(action.assignedAt)}/></div>
          </Panel></div>}

          <div className={isResponsible ? "order-3 md:order-none" : ""}><Panel title="Corrective Measure" icon={<CheckCircle2 className="size-4 text-primary" />}>
          {!isResponsible && action.submittedForReviewAt && (
            <div className="mb-4 rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
              <p className="text-sm font-semibold text-primary">Submitted for Review</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Meta label="Responsible Person" value={action.responsiblePersonName ?? action.assignedTo} />
                <Meta label="Submitted" value={formatDateTime(action.submittedForReviewAt)} />
              </div>
            </div>
          )}

          <div className="relative">
            {canStart && (
              <div className="absolute inset-0 z-10 grid place-items-center rounded-lg bg-card/35 backdrop-blur-[1px]">
                <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
                  <p className="text-sm font-semibold">Ready to begin corrective work?</p>
                  <p className="mt-1 text-xs text-muted-foreground">Start work to enable the corrective measure fields.</p>
                  <Button className="mt-4 min-h-11 md:min-h-9" onClick={startWork} disabled={pendingTransition === "start"}>
                    <Play className="size-4" /> {pendingTransition === "start" ? "Starting..." : "Start Work"}
                  </Button>
                </div>
              </div>
            )}
          <div className={`space-y-4 transition-[filter,opacity] ${canStart ? "pointer-events-none select-none blur-[2px] opacity-40" : ""}`} aria-disabled={canStart || undefined}>
            <div>
              <label htmlFor="resolution-observation" className="text-sm font-medium">Corrective Measure / Observation</label>
              {canEdit ? (
                <Textarea id="resolution-observation" className="mt-2 min-h-28" value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="Describe what you did to resolve the issue..." />
              ) : (
                <ReadOnlyValue value={action.resolutionObservation ?? action.actionTakenDescription ?? "No observation submitted."} />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Corrective Action Category</label>
                {canEdit ? (
                  <Select value={category} onValueChange={(value) => setCategory(value ?? "")}>
                    <SelectTrigger className="mt-2 w-full"><SelectValue placeholder="Select corrective action category" /></SelectTrigger>
                    <SelectContent>{FIVE_S_CORRECTIVE_ACTION_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                ) : <ReadOnlyValue value={action.correctiveActionCategory ?? "—"} />}
              </div>
              <div>
                <label htmlFor="action-cost-saving" className="text-sm font-medium">Cost Saving</label>
                {canEdit ? (
                  <div className="relative mt-2">
                    <IndianRupee className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input id="action-cost-saving" className="pl-8" type="number" min="0" step="0.01" value={costSaving} onChange={(event) => setCostSaving(event.target.value)} />
                  </div>
                ) : <ReadOnlyValue value={`₹${(action.costSaving ?? 0).toLocaleString("en-IN")}`} />}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium"><span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-green-600">After</span>Resolution Evidence <span className="text-destructive">*</span></p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Take a photo showing the completed corrective action.</p>
                </div>
                {canEdit && (
                  <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                    <Button size="sm" variant="outline" className="min-h-11 min-w-0 flex-1 sm:flex-none md:min-h-8" onClick={() => setAfterCameraOpen(true)}><ImageIcon className="size-4" /> Take After Photo</Button>
                  </div>
                )}
              </div>
              <EvidenceGrid evidence={action.evidence} editable={canEdit} onPreview={setPreview} onRemove={(id) => removeActionEvidence(action.id, id)} emptyLabel="No resolution evidence attached" />
            </div>

            {(action.issueEvidence?.length ?? 0) > 0 && action.evidence.length > 0 && <div className="border-t pt-4"><p className="mb-3 text-sm font-semibold">Before → After</p><div className="grid gap-5 sm:grid-cols-2 sm:divide-x"><EvidenceSection prominent eyebrow="Before" title="Original condition" description="Auditor finding evidence" evidence={action.issueEvidence ?? []} onPreview={setPreview}/><div className="sm:pl-5"><EvidenceSection prominent eyebrow="After" title="Corrected condition" description="Resolution evidence" evidence={action.evidence} onPreview={setPreview}/></div></div></div>}

            {canEdit && action.status === "In Progress" && <div className="flex justify-end border-t pt-4"><Button variant="outline" className="min-h-11 md:min-h-9" onClick={saveProgress}>Save Progress</Button></div>}

            {canEdit && ["In Progress", "Rework Required"].includes(action.status) && (
              <div className="rounded-lg border bg-muted/15 p-4">
                <p className="text-sm font-semibold">Ready for Review</p><div className="my-3 grid grid-cols-2 gap-3 sm:grid-cols-4"><Meta label="Observation" value={observation.trim()?"Completed":"Required"}/><Meta label="Corrective Category" value={category||"Required"}/><Meta label="Cost Saving" value={`₹${(Number(costSaving)||0).toLocaleString("en-IN")}`}/><Meta label="Evidence" value={`${action.evidence.length} attachment${action.evidence.length===1?"":"s"}`}/></div>
                <Button className="min-h-11 w-full md:min-h-9" disabled={!validResolution || pendingTransition === "submit"} onClick={submitForReview}>
                  <Send className="size-4" /> {pendingTransition === "submit" ? "Submitting..." : submitLabel}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">Observation, Corrective Action Category, and resolution evidence are required.</p>
              </div>
            )}
          </div>
          </div>
        </Panel></div>

          {canReview && <div className="order-4 md:order-none"><Panel title="Zone Leader Review" icon={<ClipboardCheck className="size-4 text-primary" />}><p className="text-sm leading-6 text-muted-foreground">Review the original finding, final action plan, corrective measure, and Before/After evidence before making a decision.</p><div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end"><Button className="min-h-11 w-full sm:w-auto md:min-h-9" variant="outline" onClick={()=>setSendBackOpen(true)}><RotateCcw className="size-4"/> Return for Rework</Button><Button className="min-h-11 w-full sm:w-auto md:min-h-9" onClick={()=>setCloseOpen(true)}><CheckCircle2 className="size-4"/> Approve &amp; Close</Button></div></Panel></div>}
        </main>

        <aside className="order-last min-w-0 md:order-first 2xl:order-none 2xl:sticky 2xl:top-4"><ActionSummary action={action} /></aside>
      </div>

      <ReviewHistory action={action} />

      <Dialog open={sendBackOpen} onOpenChange={setSendBackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return for Rework</DialogTitle>
            <DialogDescription>Explain what the responsible person needs to correct before resubmitting.</DialogDescription>
          </DialogHeader>
          <div>
            <label htmlFor="send-back-remark" className="text-sm font-medium">Remark *</label>
            <Textarea id="send-back-remark" className="mt-2 min-h-28" value={remark} onChange={(event) => setRemark(event.target.value)} placeholder="Explain what needs correction..." />
            {!remark.trim() && <p className="mt-2 text-xs text-muted-foreground">Add a rework comment before returning this action.</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" className="min-h-11 md:min-h-9" onClick={() => setSendBackOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="min-h-11 md:min-h-9" disabled={!remark.trim() || pendingTransition === "send-back"} onClick={confirmSendBack}>{pendingTransition === "send-back" ? "Returning..." : "Return for Rework"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve and close this action?</DialogTitle>
            <DialogDescription>The Zone Leader approval will accept the submitted resolution and mark this action as completed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="min-h-11 md:min-h-9" onClick={() => setCloseOpen(false)}>Cancel</Button>
            <Button className="min-h-11 md:min-h-9" onClick={confirmClose} disabled={pendingTransition === "close"}>{pendingTransition === "close" ? "Closing..." : "Approve & Close"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AfterPhotoCaptureDialog
        open={afterCameraOpen}
        beforeImage={action.issueEvidence?.find((item) => item.type === "image" && item.url)?.url}
        beforeName={action.issueEvidence?.find((item) => item.type === "image" && item.url)?.name}
        onOpenChange={setAfterCameraOpen}
        onUsePhoto={addCapturedAfterPhoto}
      />

      {preview && (
        <div className="fixed inset-0 z-[10020] flex flex-col bg-slate-950/95" role="dialog" aria-modal="true" aria-label={`Preview ${preview.name}`}>
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0"><p className="truncate text-sm font-medium">{preview.evidenceType === "resolution" ? "After Photo" : "Before Photo"}</p><p className="truncate text-xs text-slate-400">{preview.name} · Uploaded by {preview.uploadedBy} · {formatDateTime(preview.uploadedAt)}</p></div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" className="size-11 text-slate-300 hover:bg-white/10 hover:text-white md:size-8" onClick={() => void previewRef.current?.requestFullscreen?.()} aria-label="Full screen"><Maximize2 className="size-4" /></Button>
              {preview.url && <Button nativeButton={false} render={<a href={preview.url} target="_blank" rel="noreferrer" />} variant="ghost" size="icon-sm" className="size-11 text-slate-300 hover:bg-white/10 hover:text-white md:size-8" aria-label="Open original"><ExternalLink className="size-4" /></Button>}
              <Button variant="ghost" size="icon-sm" className="size-11 text-slate-300 hover:bg-white/10 hover:text-white md:size-8" onClick={() => setPreview(null)} aria-label="Close preview"><X className="size-4" /></Button>
            </div>
          </div>
          <div ref={previewRef} className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-5">
            {preview.type === "image" && preview.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt={preview.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="rounded-xl border border-white/10 bg-slate-900 p-10 text-center text-white"><FileText className="mx-auto size-10 text-slate-400" /><p className="mt-4 text-sm">Preview unavailable for this file type.</p></div>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function LifecycleTimeline({ action }: { action: MyAction }) {
  const activities = action.activityHistory ?? [];
  const started = [...activities].reverse().find((item) => item.type === "started");
  const submitted = [...activities].reverse().find((item) => item.type === "submitted" || item.type === "resubmitted");
  const closed = [...activities].reverse().find((item) => item.type === "closed");
  const reviewActive = ["Awaiting Review", "Completed"].includes(action.status);
  const steps = ["Assigned", "In Progress", "Submitted for Review", "Under Review", "Closed"];
  const currentIndex = closed
    ? 4
    : reviewActive
      ? 3
      : submitted
        ? 2
        : started
          ? 1
          : 0;

  return (
    <div className="flex min-w-[620px] flex-1 items-start" aria-label="Action lifecycle">
      {steps.map((label, index) => {
        const complete = index < currentIndex;
        const current = index === currentIndex;
        return <div key={label} className="relative flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <span className={`relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border text-[9px] ${complete ? "border-emerald-500 bg-emerald-500 text-white" : current ? "border-primary bg-primary text-primary-foreground ring-4 ring-primary/10" : "border-border bg-background text-muted-foreground"}`}>
            {complete ? <Check className="size-3" /> : index + 1}
          </span>
          {index < steps.length - 1 && <span className={`absolute left-[calc(50%+10px)] right-[calc(-50%+10px)] top-2.5 h-px ${index < currentIndex ? "bg-emerald-400" : "bg-border"}`} />}
          <span className={`min-w-0 whitespace-nowrap text-xs leading-4 ${current ? "font-semibold text-primary" : complete ? "font-medium text-foreground" : "font-medium text-muted-foreground"}`}>{label}</span>
        </div>;
      })}
    </div>
  );
}

function MobileActionContext({ action, nextExpectedAction }: { action: MyAction; nextExpectedAction: string }) {
  return <section className="rounded-xl border bg-card p-4 shadow-sm md:hidden" aria-label="Current action context">
    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current task</p><p className="mt-1 truncate font-mono text-sm font-semibold text-primary">{action.id}</p></div><Badge variant={STATUS_VARIANTS[action.status]}>{getActionStatusLabel(action.status)}</Badge></div>
    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-y py-3">
      <Meta label="Priority" value={action.priority}/><Meta label="Due Date" value={formatDate(action.dueDate)}/><Meta label="Responsible" value={action.responsiblePersonName??action.assignedTo??"Unassigned"}/><Meta label="Zone" value={action.area}/>
    </dl>
    <div className="mt-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next expected action</p><p className="mt-1 text-sm font-medium leading-5">{nextExpectedAction}</p></div>
  </section>;
}

function ActionSummary({ action }: { action: MyAction }) {
  return (
    <Panel title="Action Summary">
      <div className="space-y-3">
        <div className="border-b pb-3"><p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Action Title</p><p className="mt-1.5 text-sm font-semibold leading-6">{action.title}</p></div>
        <Meta label="Action ID" value={action.id} />
        <Meta label="Audit ID" value={action.sourceTitle} />
        <Meta label="5S Section" value={action.category ?? "—"} />
        <div className="grid grid-cols-2 gap-3"><Meta label="Plant" value={action.plant} /><Meta label="Zone" value={action.area} /></div>
        <Meta label="Department" value={action.department} />
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Priority</p><Badge className="mt-1" variant={PRIORITY_VARIANTS[action.priority]}>{action.priority}</Badge></div>
          <div><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</p><Badge className="mt-1" variant={STATUS_VARIANTS[action.status]}>{getActionStatusLabel(action.status)}</Badge></div>
        </div>
        <Meta label="Due Date" value={formatDate(action.dueDate)} icon={<CalendarDays className="size-3.5" />} />
        <Meta label="Responsible Person" value={action.responsiblePersonName ?? action.assignedTo} />
        <Meta label="Zone Leader" value={action.zoneLeaderName ?? "—"} />
        <Meta label="Raised By" value={`${action.createdByName ?? action.auditor ?? "—"} (Auditor)`} />
        <Meta label="Created" value={formatDateTime(action.createdAt)} />
      </div>
    </Panel>
  );
}

function ReviewHistory({ action }: { action: MyAction }) {
  const history = action.activityHistory ?? [];
  return (
    <Panel title="Activity & Review History" icon={<History className="size-4 text-primary" />}>
      {history.length === 0 ? <p className="text-sm text-muted-foreground">No lifecycle activity yet.</p> : (
        <ol className="space-y-0">
          {[...history].reverse().map((item, index) => (
            <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
              {index < history.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-border" />}
              <span className="relative z-10 mt-1.5 size-[11px] shrink-0 rounded-full border-2 border-card bg-primary" />
              <div className="min-w-0">
                <p className="text-xs font-semibold">{ACTIVITY_LABELS[item.type]}</p>
                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{formatDateTime(item.createdAt)} · {item.actorName}{item.actorRole ? ` · ${item.actorRole}` : ""}</p>
                {item.remark && <p className="mt-2 rounded-md border bg-muted/30 p-2 text-xs leading-5">{item.remark}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

function EvidenceSection({ eyebrow, title, description, evidence, onPreview, prominent = false }: { eyebrow?: string; title: string; description: string; evidence: MyActionEvidence[]; onPreview: (item: MyActionEvidence) => void; prominent?: boolean }) {
  return <div>{eyebrow && <p className={`text-xs font-bold uppercase tracking-[0.14em] md:text-[10px] ${eyebrow === "Before" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{eyebrow}</p>}<p className={eyebrow ? "mt-1 text-sm font-semibold" : "text-sm font-semibold"}>{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>{prominent&&evidence.length?<div className="mt-3 grid gap-2">{evidence.map((item)=><button key={item.id} type="button" className="min-h-11 overflow-hidden rounded-lg border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>onPreview(item)}>{item.type==="image"&&item.url?<img src={item.url} alt={item.name} className="aspect-video w-full object-cover"/>:<span className="flex min-h-32 flex-col items-center justify-center gap-2 p-4 text-xs text-muted-foreground"><FileText className="size-6"/>{item.name}</span>}<span className="block truncate bg-background px-3 py-2 text-xs font-medium">{item.name}</span></button>)}</div>:<EvidenceGrid evidence={evidence} editable={false} onPreview={onPreview} onRemove={() => undefined} emptyLabel={eyebrow === "After" ? "No resolution evidence submitted" : "No original finding evidence attached"} />}</div>;
}

function EvidenceGrid({ evidence, editable, onPreview, onRemove, emptyLabel = "No evidence attached" }: { evidence: MyActionEvidence[]; editable: boolean; onPreview: (item: MyActionEvidence) => void; onRemove: (id: string) => void; emptyLabel?: string }) {
  if (evidence.length === 0) return <div className="mt-3 flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-muted/15 text-center"><div><Paperclip className="mx-auto size-5 text-muted-foreground" /><p className="mt-2 text-xs text-muted-foreground">{emptyLabel}</p></div></div>;
  return <div className="mt-3 grid gap-2 sm:grid-cols-2">{evidence.map((item) => <div key={item.id} className="group flex min-w-0 items-center gap-3 rounded-lg border bg-background p-2.5"><button type="button" className="flex min-h-14 min-w-0 flex-1 items-center gap-3 text-left" onClick={() => onPreview(item)}><span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">{item.type === "image" && item.url ? <img src={item.url} alt={item.name} className="size-full object-cover" /> : <FileText className="size-5 text-muted-foreground" />}</span><span className="min-w-0"><span className="block truncate text-xs font-medium">{item.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">Uploaded by {item.uploadedBy}</span><span className="block text-xs text-muted-foreground">{formatDateTime(item.uploadedAt)}</span></span></button>{editable && <Button variant="ghost" size="icon-sm" className="size-11 md:size-8" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}><X className="size-4" /></Button>}</div>)}</div>;
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <Card><CardHeader className="border-b bg-muted/15 py-3"><CardTitle className="flex items-center gap-2 text-sm">{icon}{title}</CardTitle></CardHeader><CardContent className="pt-4">{children}</CardContent></Card>;
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div><p className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground md:text-[11px]">{label}</p><p className="mt-1 flex items-center gap-1.5 break-words text-xs font-medium leading-5">{icon}{value || "—"}</p></div>;
}

function ReadOnlyValue({ value }: { value: string }) {
  return <div className="mt-2 rounded-md border bg-muted/20 px-3 py-2.5 text-sm leading-6">{value}</div>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}
