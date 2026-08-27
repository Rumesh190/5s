"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
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
  Upload,
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
import { getFiveSZoneConfiguration } from "@/lib/five-s/configuration";
import { useCurrentUser } from "@/lib/current-user";
import { MAX_EVIDENCE_IMAGES, optimizeEvidenceImage } from "@/lib/evidence-images";

const STATUS_VARIANTS = {
  Assigned: "info",
  Open: "info",
  "In Progress": "warning",
  Overdue: "danger",
  "Pending Review": "info",
  "Awaiting Review": "info",
  "Awaiting Assignment": "warning",
  "Pending Auditor Review": "info",
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
  awaiting_assignment: "Awaiting Zone Leader assignment",
  assigned: "Action assigned",
  started: "Work started",
  submitted: "Submitted for review",
  resubmitted: "Resubmitted for review",
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
  const [preview, setPreview] = useState<MyActionEvidence | null>(null);
  const [pendingTransition, setPendingTransition] = useState<"start" | "submit" | "send-back" | "close" | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!action) return;
    setObservation(action.resolutionObservation ?? action.actionTakenDescription ?? "");
    setCategory(action.actionCategory ?? "");
    setCostSaving(String(action.costSaving ?? 0));
  }, [action?.id]);

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
  const isCreator = action.createdByUserId
    ? action.createdByUserId === actor.id
    : action.auditor === actor.name;
  const canEdit = isResponsible && ["Assigned", "Open", "In Progress", "Rework Required"].includes(action.status);
  const zoneConfiguration = getFiveSZoneConfiguration(action.area);
  const canAssign = action.status === "Awaiting Assignment" && zoneConfiguration?.leaderId === actor.id;
  const canReview = isCreator && ["Pending Review", "Pending Auditor Review", "Awaiting Review"].includes(action.status);
  const canStart = isResponsible && ["Assigned", "Open", "Rework Required"].includes(action.status);
  const submitLabel = action.status === "Rework Required" ? "Resubmit for Auditor Review" : "Submit for Auditor Review";
  const validResolution = observation.trim() && Boolean(action.actionCategory) && Number.isFinite(Number(costSaving)) && Number(costSaving) >= 0;

  function syncFields(updated: MyAction | undefined) {
    if (!updated) return;
    setObservation(updated.resolutionObservation ?? updated.actionTakenDescription ?? "");
    setCategory(updated.actionCategory ?? "");
    setCostSaving(String(updated.costSaving ?? 0));
  }

  function saveProgress() {
    if (!canEdit) return;
    syncFields(updateAction(actionId, {
      actionTakenDescription: observation,
      resolutionObservation: observation,
      costSaving: Number.isFinite(Number(costSaving)) ? Number(costSaving) : undefined,
      currency: "INR",
    }));
  }

  function submitForReview() {
    if (pendingTransition) return;
    const actionCategory = action?.actionCategory ?? "";
    setPendingTransition("submit");
    window.setTimeout(() => { syncFields(submitActionForReview(actionId, actor, { observation, actionCategory, costSaving: Number(costSaving) })); setPendingTransition(null); }, 220);
  }

  function startWork() {
    if (pendingTransition) return;
    setPendingTransition("start");
    window.setTimeout(() => { startAssignedAction(actionId, actor); setPendingTransition(null); }, 220);
  }

  async function addEvidence(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;
    if ((action?.evidence.length ?? 0) >= MAX_EVIDENCE_IMAGES) { window.alert("Maximum 5 evidence images allowed."); event.target.value = ""; return; }
    const url = file.type.startsWith("image/") ? await readImage(file) : undefined;
    addActionEvidence(actionId, {
      id: `EV-${crypto.randomUUID()}`,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "document",
      evidenceType: "resolution",
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: actor.name,
      url,
    });
    event.target.value = "";
  }

  function confirmSendBack() {
    if (!remark.trim()) return;
    setPendingTransition("send-back");
    window.setTimeout(() => { sendActionBack(actionId, actor, remark); setRemark(""); setSendBackOpen(false); setPendingTransition(null); }, 220);
  }

  function confirmClose() {
    setPendingTransition("close");
    window.setTimeout(() => { closeReviewedAction(actionId, actor); setCloseOpen(false); setPendingTransition(null); }, 260);
  }

  return (
    <PageContainer className="max-w-none">
      <FiveSPageHeader
        eyebrow="Actions / Action Details"
        title={action.title}
        description={`${action.status} · ${action.priority} priority · ${action.sourceTitle}`}
        leading={
          <Button variant="ghost" size="icon-sm" onClick={() => router.push("/5s/actions")} aria-label="Back to Actions">
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
      />

      <LifecycleTimeline action={action} />

      {canAssign && <Panel title="Assign Responsible Person" icon={<ClipboardCheck className="size-4 text-primary" />}><p className="text-sm text-muted-foreground">Assign this {action.area} action to a member of your Zone.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Select value={assigneeId} onValueChange={(value)=>setAssigneeId(value??"")}><SelectTrigger className="w-full"><SelectValue placeholder="Select responsible person" /></SelectTrigger><SelectContent>{zoneConfiguration.members.map((member)=><SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent></Select><Button disabled={!assigneeId} onClick={()=>assignActionToZoneMember(action.id, actor, assigneeId)}>Assign Action</Button></div></Panel>}

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
          <Panel title="Original Finding" icon={<AlertCircle className="size-4 text-red-600" />}>
            <div className="grid gap-5">
              <div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Related Audit Question</p><p className="mt-2 text-sm font-medium leading-6">{action.questionText ?? "No related audit question recorded."}</p></div>
              <div className="rounded-lg border-l-4 border-red-500 bg-red-500/[0.045] px-4 py-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">Finding</p><p className="mt-2 text-base font-medium leading-7">{action.originalFinding ?? action.description}</p></div>
              <div className="grid gap-4 border-t pt-4 sm:grid-cols-3"><Meta label="Compliance" value="Corrective action required" /><Meta label="Observed By" value={action.createdByName ?? action.auditor ?? "—"} /><Meta label="Observed On" value={formatDateTime(action.createdAt)} /></div>
              <div className="border-t pt-4">
                <EvidenceSection eyebrow="Before" title="Original Finding Evidence" description="Read-only evidence captured by the auditor when this action was raised." evidence={action.issueEvidence ?? []} onPreview={setPreview} />
              </div>
            </div>
          </Panel>

          <Panel title="Corrective Measure" icon={<CheckCircle2 className="size-4 text-primary" />}>
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
                  <Button className="mt-4" onClick={startWork} disabled={pendingTransition === "start"}>
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
                <label className="text-sm font-medium">Action Category</label>
                <ReadOnlyValue value={action.actionCategory ?? "—"} />
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
                  <p className="text-sm font-medium"><span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-green-600">After</span>Resolution Evidence</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Upload evidence showing the completed corrective action.</p>
                </div>
                {canEdit && (
                  <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                    <Button size="sm" variant="outline" className="min-w-0 flex-1 sm:flex-none" onClick={() => fileInputRef.current?.click()}><Upload className="size-4" /> Upload</Button>
                    <Button size="sm" variant="outline" className="min-w-0 flex-1 sm:flex-none" onClick={() => cameraInputRef.current?.click()}><ImageIcon className="size-4" /> Camera</Button>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} className="hidden" type="file" accept="image/*,.pdf,.doc,.docx" onChange={addEvidence} />
              <input ref={cameraInputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={addEvidence} />
              <EvidenceGrid evidence={action.evidence} editable={canEdit} onPreview={setPreview} onRemove={(id) => removeActionEvidence(action.id, id)} emptyLabel="No resolution evidence attached" />
            </div>

            {(action.issueEvidence?.length ?? 0) > 0 && action.evidence.length > 0 && <div className="border-t pt-4"><p className="mb-3 text-sm font-semibold">Before → After</p><div className="grid gap-5 sm:grid-cols-2 sm:divide-x"><EvidenceSection eyebrow="Before" title="Original condition" description="Auditor finding evidence" evidence={action.issueEvidence ?? []} onPreview={setPreview}/><div className="sm:pl-5"><EvidenceSection eyebrow="After" title="Corrected condition" description="Resolution evidence" evidence={action.evidence} onPreview={setPreview}/></div></div></div>}

            {canEdit && action.status === "In Progress" && <div className="flex justify-end border-t pt-4"><Button variant="outline" onClick={saveProgress}>Save Progress</Button></div>}

            {canEdit && ["In Progress", "Rework Required"].includes(action.status) && (
              <div className="rounded-lg border bg-muted/15 p-4">
                <p className="text-sm font-semibold">Ready for Review</p><div className="my-3 grid grid-cols-2 gap-3 sm:grid-cols-4"><Meta label="Observation" value={observation.trim()?"Completed":"Required"}/><Meta label="Category" value={category||"Required"}/><Meta label="Cost Saving" value={`₹${(Number(costSaving)||0).toLocaleString("en-IN")}`}/><Meta label="Evidence" value={`${action.evidence.length} attachment${action.evidence.length===1?"":"s"}`}/></div>
                <Button className="w-full" disabled={!validResolution || pendingTransition === "submit"} onClick={submitForReview}>
                  <Send className="size-4" /> {pendingTransition === "submit" ? "Submitting..." : submitLabel}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">Observation is required. Action Category was defined by the Auditor.</p>
              </div>
            )}
          </div>
          </div>
        </Panel>

          {canReview && <Panel title="Review Decision" icon={<ClipboardCheck className="size-4 text-primary" />}><p className="text-sm leading-6 text-muted-foreground">Review the original finding, corrective measure and Before/After evidence before making a decision.</p><div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end"><Button className="w-full sm:w-auto" variant="outline" onClick={()=>setSendBackOpen(true)}><RotateCcw className="size-4"/> Send Back</Button><Button className="w-full sm:w-auto" onClick={()=>setCloseOpen(true)}><CheckCircle2 className="size-4"/> Close Action</Button></div></Panel>}
        </main>

        <aside className="order-first min-w-0 2xl:order-none 2xl:sticky 2xl:top-4"><ActionSummary action={action} /></aside>
      </div>

      <ReviewHistory action={action} />

      <Dialog open={sendBackOpen} onOpenChange={setSendBackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Action Back</DialogTitle>
            <DialogDescription>Explain what the responsible person needs to correct before resubmitting.</DialogDescription>
          </DialogHeader>
          <div>
            <label htmlFor="send-back-remark" className="text-sm font-medium">Remark *</label>
            <Textarea id="send-back-remark" className="mt-2 min-h-28" value={remark} onChange={(event) => setRemark(event.target.value)} placeholder="Explain what needs correction..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendBackOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={!remark.trim() || pendingTransition === "send-back"} onClick={confirmSendBack}>{pendingTransition === "send-back" ? "Sending Back..." : "Send Back"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close this action?</DialogTitle>
            <DialogDescription>The submitted resolution will be accepted and this action will be marked as completed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseOpen(false)}>Cancel</Button>
            <Button onClick={confirmClose} disabled={pendingTransition === "close"}>{pendingTransition === "close" ? "Closing..." : "Close Action"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {preview && (
        <div className="fixed inset-0 z-[10020] flex flex-col bg-slate-950/95" role="dialog" aria-modal="true" aria-label={`Preview ${preview.name}`}>
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0"><p className="truncate text-sm font-medium">{preview.name}</p><p className="text-xs text-slate-400">Uploaded by {preview.uploadedBy} · {formatDateTime(preview.uploadedAt)}</p></div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" className="text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => void previewRef.current?.requestFullscreen?.()} aria-label="Full screen"><Maximize2 className="size-4" /></Button>
              {preview.url && <Button nativeButton={false} render={<a href={preview.url} target="_blank" rel="noreferrer" />} variant="ghost" size="icon-sm" className="text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Open original"><ExternalLink className="size-4" /></Button>}
              <Button variant="ghost" size="icon-sm" className="text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setPreview(null)} aria-label="Close preview"><X className="size-4" /></Button>
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
  const assigned = activities.find((item) => item.type === "assigned");
  const started = [...activities].reverse().find((item) => item.type === "started");
  const submitted = [...activities].reverse().find((item) => item.type === "submitted" || item.type === "resubmitted");
  const closed = [...activities].reverse().find((item) => item.type === "closed");
  const reviewActive = ["Pending Review", "Awaiting Review", "Completed"].includes(action.status);
  const steps = [
    { label: "Assigned", activity: assigned, complete: true },
    { label: "In Progress", activity: started, complete: Boolean(started) },
    { label: "Submitted for Review", activity: submitted, complete: Boolean(submitted) },
    { label: "Under Review", activity: submitted, complete: reviewActive },
    { label: "Closed", activity: closed, complete: Boolean(closed) },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 py-3"><CardTitle className="flex items-center gap-2 text-sm"><History className="size-4 text-primary" />Action lifecycle</CardTitle></CardHeader>
      <CardContent className="py-5">
        <div className="grid gap-0 md:hidden">
          {steps.map((step, index) => <div key={step.label} className="relative grid grid-cols-[36px_1fr] gap-3 pb-5 last:pb-0">{index < steps.length - 1 && <span className={`absolute left-[15px] top-8 h-full w-px ${step.complete ? "bg-primary" : "bg-border"}`} />}<span className={`relative z-10 flex size-8 items-center justify-center rounded-full border-2 ${step.complete ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>{step.complete ? <Check className="size-4" /> : <Circle className="size-3" />}</span><div className="min-w-0 pt-1"><p className={`text-sm font-semibold ${step.complete ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>{step.activity ? <p className="mt-1 break-words text-xs text-muted-foreground">{formatDateTime(step.activity.createdAt)} · {step.activity.actorName}</p> : <p className="mt-1 text-xs text-muted-foreground">Pending</p>}</div></div>)}
        </div>
        <div className="hidden overflow-x-auto md:block">
        <div className="grid min-w-[760px] grid-cols-5">
          {steps.map((step, index) => (
            <div key={step.label} className="relative px-3 text-center">
              {index > 0 && <span className={`absolute right-1/2 top-4 h-px w-full ${step.complete ? "bg-primary" : "bg-border"}`} />}
              <span className={`relative z-10 mx-auto flex size-8 items-center justify-center rounded-full border-2 ${step.complete ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                {step.complete ? <Check className="size-4" /> : <Circle className="size-3" />}
              </span>
              <p className={`mt-2 text-xs font-semibold ${step.complete ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
              {step.activity ? <><p className="mt-1 text-[11px] text-muted-foreground">{formatDateTime(step.activity.createdAt)}</p><p className="text-[11px] text-muted-foreground">by {step.activity.actorName}</p></> : <p className="mt-1 text-[11px] text-muted-foreground">Pending</p>}
            </div>
          ))}
        </div>
        </div>
      </CardContent>
    </Card>
  );
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
          <div><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</p><Badge className="mt-1" variant={STATUS_VARIANTS[action.status]}>{action.status}</Badge></div>
        </div>
        <Meta label="Due Date" value={formatDate(action.dueDate)} icon={<CalendarDays className="size-3.5" />} />
        <Meta label="Responsible Person" value={action.responsiblePersonName ?? action.assignedTo} />
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
                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{formatDateTime(item.createdAt)} · {item.actorName}</p>
                {item.remark && <p className="mt-2 rounded-md border bg-muted/30 p-2 text-xs leading-5">{item.remark}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

function EvidenceSection({ eyebrow, title, description, evidence, onPreview }: { eyebrow?: string; title: string; description: string; evidence: MyActionEvidence[]; onPreview: (item: MyActionEvidence) => void }) {
  return <div>{eyebrow && <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${eyebrow === "Before" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{eyebrow}</p>}<p className={eyebrow ? "mt-1 text-sm font-semibold" : "text-sm font-semibold"}>{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p><EvidenceGrid evidence={evidence} editable={false} onPreview={onPreview} onRemove={() => undefined} emptyLabel={eyebrow === "After" ? "No resolution evidence submitted" : "No original finding evidence attached"} /></div>;
}

function EvidenceGrid({ evidence, editable, onPreview, onRemove, emptyLabel = "No evidence attached" }: { evidence: MyActionEvidence[]; editable: boolean; onPreview: (item: MyActionEvidence) => void; onRemove: (id: string) => void; emptyLabel?: string }) {
  if (evidence.length === 0) return <div className="mt-3 flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-muted/15 text-center"><div><Paperclip className="mx-auto size-5 text-muted-foreground" /><p className="mt-2 text-xs text-muted-foreground">{emptyLabel}</p></div></div>;
  return <div className="mt-3 grid gap-2 sm:grid-cols-2">{evidence.map((item) => <div key={item.id} className="group flex min-w-0 items-center gap-3 rounded-lg border bg-background p-2.5"><button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => onPreview(item)}><span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">{item.type === "image" && item.url ? <img src={item.url} alt="" className="size-full object-cover" /> : <FileText className="size-5 text-muted-foreground" />}</span><span className="min-w-0"><span className="block truncate text-xs font-medium">{item.name}</span><span className="mt-0.5 block text-[11px] text-muted-foreground">Uploaded by {item.uploadedBy}</span><span className="block text-[10px] text-muted-foreground">{formatDateTime(item.uploadedAt)}</span></span></button>{editable && <Button variant="ghost" size="icon-sm" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}><X className="size-4" /></Button>}</div>)}</div>;
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <Card><CardHeader className="border-b bg-muted/15 py-3"><CardTitle className="flex items-center gap-2 text-sm">{icon}{title}</CardTitle></CardHeader><CardContent className="pt-4">{children}</CardContent></Card>;
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div><p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">{label}</p><p className="mt-1 flex items-center gap-1.5 break-words text-xs font-medium leading-5">{icon}{value || "—"}</p></div>;
}

function ReadOnlyValue({ value }: { value: string }) {
  return <div className="mt-2 rounded-md border bg-muted/20 px-3 py-2.5 text-sm leading-6">{value}</div>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function readImage(file: File): Promise<string | undefined> {
  return optimizeEvidenceImage(file).then(({ dataUrl }) => dataUrl).catch((error) => { window.alert(error instanceof Error ? error.message : "Unable to process this image."); return undefined; });
}
