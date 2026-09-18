"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Camera, CheckCircle2, Eye, Flag, Image as ImageIcon, Package, Plus, Printer, Search, Trash2, UserRound } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredMark } from "@/components/ui/required-mark";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FiveSPageHeader from "@/features/five-s/components/FiveSPageHeader";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";
import { useCurrentUser } from "@/lib/current-user";
import { createRedTag, markTagPrinted, useRedTags } from "./store";
import { getRedTagDisplayStatus, RED_TAG_REASONS, RED_TAG_SECTIONS, type RedTag, type RedTagDisplayStatus, type RedTagReason } from "./types";
import { useI18n } from "@/components/preferences/use-i18n";
import AfterPhotoCaptureDialog from "@/features/five-s/components/AfterPhotoCaptureDialog";
import IssuePhotoCaptureDialog from "@/features/five-s/components/IssuePhotoCaptureDialog";
import { approveAndCloseRedTag, assignRedTagAction, returnRedTagForRework, saveRedTagClosureEvidence, submitRedTagForReview } from "./store";
import type { RedTagPriority } from "./types";
import ReportHeader from "@/features/five-s/components/ReportHeader";
import ReportPdfActions from "@/features/five-s/components/ReportPdfActions";

const STATUS_TONE: Record<RedTagDisplayStatus, "danger" | "warning" | "success" | "secondary"> = {
  Raised: "danger", "In Progress": "warning", "Awaiting Review": "success", "Rework Required": "danger", Closed: "secondary",
};

function displayDate(value: string, time = false) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", ...(time ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(value));
}

function Summary({ tags }: { tags: RedTag[] }) {
  const items = ["Total Tags", "Raised", "In Progress", "Awaiting Review"].map((label) => ({
    label, value: label === "Total Tags" ? tags.length : tags.filter((tag) => getRedTagDisplayStatus(tag.status) === label).length,
  }));
  return <div className="grid grid-cols-2 overflow-hidden rounded-xl border bg-card shadow-sm sm:grid-cols-4">
    {items.map((item) => <div key={item.label} className="border-b p-4 last:border-0 even:border-l sm:border-b-0 sm:border-l sm:first:border-l-0">
      <p className="text-xs font-medium text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{item.value}</p>
    </div>)}
  </div>;
}

export function RedTagListPage() {
  const router = useRouter();
  const { t } = useI18n();
  const tags = useRedTags();
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("All"); const [section, setSection] = useState("All");
  const [reason, setReason] = useState("All"); const [person, setPerson] = useState("All"); const [date, setDate] = useState("");
  const people = [...new Set(tags.map((tag) => tag.responsiblePersonName))];
  const filtered = tags.filter((tag) => {
    const term = search.toLowerCase();
    return (!term || `${tag.tagNumber} ${tag.itemName} ${tag.remarks}`.toLowerCase().includes(term)) &&
      (status === "All" || getRedTagDisplayStatus(tag.status) === status) && (section === "All" || tag.section === section) &&
      (reason === "All" || tag.reason === reason) && (person === "All" || tag.responsiblePersonName === person) &&
      (!date || tag.createdAt.slice(0, 10) === date);
  });
  return <PageContainer className="max-w-none">
    <FiveSPageHeader eyebrow="5S Workspace" title="Red Tags" description="Track and manage tagged workplace issues."
      actions={<Button onClick={() => router.push("/5s/red/create")}><Plus className="size-4" /> {t("redTag.create")}</Button>} />
    <Summary tags={tags} />
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="grid gap-2 border-b bg-muted/15 p-3 md:grid-cols-3 xl:grid-cols-[minmax(220px,1.5fr)_repeat(5,minmax(130px,1fr))]">
        <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search tags or items..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Filter value={status} onChange={setStatus} label="All Statuses" options={["Raised", "In Progress", "Awaiting Review", "Rework Required", "Closed"]} />
        <Filter value={section} onChange={setSection} label="All Sections" options={[...RED_TAG_SECTIONS]} />
        <Filter value={reason} onChange={setReason} label="All Reasons" options={[...RED_TAG_REASONS]} />
        <Filter value={person} onChange={setPerson} label="All Responsible Members" options={people} />
        <Input type="date" aria-label="Created date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid gap-3 p-3 md:hidden">{filtered.map((tag) => { const displayStatus=getRedTagDisplayStatus(tag.status); return <button key={tag.id} onClick={() => router.push(`/5s/red/${tag.id}`)} className="min-w-0 rounded-xl border bg-background p-4 text-left active:bg-muted/40"><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className="font-mono text-xs font-bold text-red-700 dark:text-red-400">{tag.tagNumber}</p><h2 className="mt-1 break-words font-semibold">{tag.itemName}</h2></div><Badge variant={STATUS_TONE[displayStatus]}>{displayStatus}</Badge></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm"><div><dt className="text-xs text-muted-foreground">Zone</dt><dd className="mt-1 font-medium">{tag.zone}</dd></div><div><dt className="text-xs text-muted-foreground">Priority</dt><dd className="mt-1 font-medium">{tag.priority ?? "Not set"}</dd></div><div><dt className="text-xs text-muted-foreground">Responsible</dt><dd className="mt-1 break-words font-medium">{tag.responsiblePersonName || "Unassigned"}</dd></div><div><dt className="text-xs text-muted-foreground">Due Date</dt><dd className="mt-1 font-medium">{tag.dueDate ? displayDate(`${tag.dueDate}T00:00:00`) : "Not set"}</dd></div></dl></button>})}</div>
      <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1180px] text-sm"><thead className="border-b bg-muted/20 text-left text-[11px] uppercase tracking-wide text-muted-foreground"><tr>
        {["Red Tag ID", "Issue", "Zone", "Responsible", "Priority", "Due Date", "Status", "Action"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
      </tr></thead><tbody>{filtered.map((tag) => <tr key={tag.id} className="border-b last:border-0 hover:bg-muted/20">
        <td className="px-4 py-3 font-mono text-xs font-semibold text-red-700 dark:text-red-400">{tag.tagNumber}</td><td className="px-4 py-3 font-medium">{tag.itemName}</td>
        <td className="px-4 py-3">{tag.zone}</td><td className="px-4 py-3">{tag.responsiblePersonName || "Unassigned"}</td><td className="px-4 py-3">{tag.priority ?? "Not set"}</td>
        <td className="px-4 py-3 whitespace-nowrap">{tag.dueDate ? displayDate(`${tag.dueDate}T00:00:00`) : "Not set"}</td><td className="px-4 py-3"><Badge variant={STATUS_TONE[getRedTagDisplayStatus(tag.status)]}>{getRedTagDisplayStatus(tag.status)}</Badge></td>
        <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => router.push(`/5s/red/${tag.id}`)}><Eye className="size-4" /> View</Button></td>
      </tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="py-14 text-center text-sm text-muted-foreground">No Red Tags match the selected filters.</div>}
    </section>
  </PageContainer>;
}

function Filter({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[] }) {
  return <Select value={value} onValueChange={(v) => onChange(v ?? "All")}><SelectTrigger><SelectValue>{(selected: string | null) => selected === "All" || selected == null ? label : selected}</SelectValue></SelectTrigger><SelectContent><SelectItem value="All">{label}</SelectItem>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>;
}

export function RedTagCreatePage() {
  const router = useRouter(); const user = useCurrentUser();
  const { t } = useI18n();
  const [zone, setZone] = useState(user.primaryZone); const [section, setSection] = useState("Production"); const [item, setItem] = useState(""); const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState<RedTagReason | "">(""); const [customReason, setCustomReason] = useState(""); const [remarks, setRemarks] = useState(""); const [requiredAction, setRequiredAction] = useState("");
  const [imageUrl, setImageUrl] = useState<string>(); const [preview, setPreview] = useState(false); const [cameraOpen, setCameraOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const zoneConfig = FIVE_S_ZONE_CONFIGURATION.find((z) => z.name === zone);
  const valid = item.trim() && Number(quantity) >= 1 && reason && (reason !== "Others" || customReason.trim()) && requiredAction.trim() && imageUrl;
  function submit() { if (!valid || !reason || creating) return; setCreating(true); window.setTimeout(() => { const tag = createRedTag({ plant: user.plant, zone, section, itemName: item.trim(), quantity: Number(quantity), reason, customReason: customReason.trim() || undefined, remarks: remarks.trim(), requiredAction: requiredAction.trim(), responsiblePersonId: "", responsiblePersonName: "", targetDate: "", createdById: user.id, createdByName: user.name, imageUrl }, user); router.push(`/5s/red/${tag.id}/print`); }, 240); }
  return <PageContainer className="max-w-none">
    <FiveSPageHeader eyebrow="Red Tags / Create" title="Create Red Tag" description="Capture the issue and print a physical tag for Zone Leader action."
      leading={<Button variant="ghost" size="icon-sm" onClick={() => router.push("/5s/red")}><ArrowLeft className="size-4" /></Button>}
      actions={<><Button variant="ghost" onClick={() => router.push("/5s/red")} disabled={creating}>{t("common.cancel")}</Button><Button disabled={!valid || creating} onClick={submit}><Printer className="size-4" /> {creating ? "Creating Tag..." : t("redTag.create")}</Button></>} />
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid gap-5">
      <Card><CardContent className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <ReadOnly label="Plant" value={user.plant} /><Field label="Zone"><Select value={zone} onValueChange={(v) => setZone(v ?? user.primaryZone)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FIVE_S_ZONE_CONFIGURATION.map((z) => <SelectItem key={z.name} value={z.name}>{z.name}</SelectItem>)}</SelectContent></Select></Field>
        <ReadOnly label="Tag No." value={`RT-EGM-${zoneConfig?.code ?? "ZA"}-###`} /><ReadOnly label="Date" value={displayDate(new Date().toISOString(), true)} />
      </CardContent></Card>
      <Card><CardContent className="grid gap-5 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_2fr_140px]"><Field label="Section"><Filter value={section} onChange={setSection} label="Select Section" options={[...RED_TAG_SECTIONS]} /></Field><Field label="Name of Item / Equipment"><Input required value={item} onChange={(e) => setItem(e.target.value)} placeholder="Enter machine, item or area name" /></Field><Field label="Quantity"><Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Field></div>
        <Field label="Reason"><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{RED_TAG_REASONS.map((option) => <button key={option} type="button" onClick={() => setReason(option)} className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${reason === option ? "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500/30 dark:bg-red-950/35 dark:text-red-200" : "bg-background hover:border-red-300 hover:bg-red-50/40 dark:hover:bg-red-950/15"}`}>{reason === option && <CheckCircle2 className="mr-2 inline size-4" />}{option}</button>)}</div></Field>
        {reason === "Others" && <Field label="Specify Reason"><Input required value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Enter the reason" /></Field>}
        <div className="grid gap-4 lg:grid-cols-2"><Field label="Remarks"><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Describe the issue or condition observed..." /></Field><Field label="Required Action"><Textarea required value={requiredAction} onChange={(e) => setRequiredAction(e.target.value)} placeholder="Describe what must be done to clear this tag..." /></Field></div>
        <Field label="Issue Photo *"><div className="grid gap-2"><div className="flex flex-wrap items-center gap-2"><Button type="button" variant="outline" onClick={() => setCameraOpen(true)}><Camera className="size-4" /> Take Issue Photo</Button>{imageUrl && <div className="flex items-center gap-2 rounded-lg border p-1.5"><button type="button" onClick={() => setPreview(true)}><img src={imageUrl} alt="Issue preview" className="size-12 rounded object-cover" /></button><Button type="button" size="icon-sm" variant="ghost" aria-label="Remove issue photo" onClick={() => setImageUrl(undefined)}><Trash2 className="size-4" /></Button></div>}</div><p className="text-xs text-muted-foreground">A live issue photo is required before creating the Red Tag.</p></div></Field>
      </CardContent></Card>
      <div className="flex justify-end sm:hidden"><Button className="w-full" disabled={!valid || creating} type="submit"><Printer className="size-4" /> {creating ? "Creating Tag..." : "Create & Print Tag"}</Button></div>
    </form>
    <IssuePhotoCaptureDialog open={cameraOpen} onOpenChange={setCameraOpen} onUsePhoto={setImageUrl} />
    <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-w-4xl"><DialogHeader><DialogTitle>Issue Photo</DialogTitle></DialogHeader>{imageUrl && <img src={imageUrl} alt="Issue full-screen preview" className="max-h-[75vh] w-full object-contain" />}</DialogContent></Dialog>
  </PageContainer>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { const explicitlyRequired = label.endsWith(" *"); const required = explicitlyRequired || ["Name of Item / Equipment", "Quantity", "Reason", "Specify Reason", "Required Action"].includes(label); const displayLabel = explicitlyRequired ? label.slice(0, -2) : label; return <div className="grid content-start gap-2"><Label>{displayLabel}{required && <RequiredMark />}</Label>{children}</div>; }
function ReadOnly({ label, value }: { label: string; value: string }) { return <Field label={label}><div className="flex h-10 items-center rounded-md border bg-muted/35 px-3 text-sm font-medium">{value}</div></Field>; }

export function RedTagDetailPage({ tagId }: { tagId: string }) {
  const router = useRouter(); const user = useCurrentUser(); const tag = useRedTags().find((item) => item.id === tagId);
  const [plan, setPlan] = useState(""); const [memberId, setMemberId] = useState(""); const [dueDate, setDueDate] = useState(""); const [priority, setPriority] = useState<RedTagPriority>("Medium"); const [instructions, setInstructions] = useState("");
  const [captureOpen, setCaptureOpen] = useState(false); const [comment, setComment] = useState(""); const [reworkOpen, setReworkOpen] = useState(false); const [reworkComment, setReworkComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  if (!tag) return <Missing onBack={() => router.push("/5s/red")} />;
  const zoneConfig = FIVE_S_ZONE_CONFIGURATION.find((zone) => zone.name === tag.zone); const isLeader = zoneConfig?.leaderId === user.id; const isMember = tag.responsiblePersonId === user.id || (!tag.responsiblePersonId && tag.responsiblePersonName === user.name);
  const canPlan = isLeader && tag.status === "Open"; const canWork = isMember && ["Assigned", "In Progress", "Rework Required"].includes(tag.status);
  const savePlan = () => assignRedTagAction(tag.id, user, { actionPlan: plan || tag.actionPlan || tag.requiredAction, memberId: memberId || tag.responsiblePersonId, dueDate: dueDate || tag.dueDate || tag.targetDate, priority: tag.priority && priority === "Medium" ? tag.priority : priority, instructions: instructions || tag.instructions });
  return <PageContainer className="max-w-none"><FiveSPageHeader eyebrow="Red Tags / Details" title={tag.tagNumber} description={`${tag.itemName} · ${tag.section}`}
    leading={<Button variant="ghost" size="icon-sm" onClick={() => router.push("/5s/red")}><ArrowLeft className="size-4" /></Button>}
    actions={<Button onClick={() => router.push(`/5s/red/${tag.id}/print`)}><Printer className="size-4" /> Print Tag</Button>} />
    {successMessage && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400">{successMessage}</div>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,.7fr)]"><div className="grid gap-5">
      <Card><CardContent className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4"><Meta icon={Package} label="Item / Equipment" value={tag.itemName} /><Meta icon={Flag} label="Status" value={getRedTagDisplayStatus(tag.status)} /><Meta label="Zone / Section" value={`${tag.zone} · ${tag.section}`} /><Meta label="Reason" value={tag.reason === "Others" ? tag.customReason ?? tag.reason : tag.reason} /><Meta icon={UserRound} label="Responsible" value={tag.responsiblePersonName || "Unassigned"} /><Meta label="Priority" value={tag.priority ?? "Not set"} /><Meta icon={CalendarDays} label="Due Date" value={tag.dueDate ? displayDate(`${tag.dueDate}T00:00:00`) : "Not set"} /><Meta label="Raised By" value={`${tag.createdByName} · ${displayDate(tag.createdAt)}`} /></CardContent></Card>
      <div className="grid gap-5 md:grid-cols-2"><Panel title="Issue / Remarks" text={tag.remarks || "No remarks added."} /><Panel title="Initial Required Action" text={tag.requiredAction || "Awaiting Zone Leader action plan."} /></div>
      {canPlan && <Card><CardContent className="grid gap-4 p-5"><div><h2 className="font-semibold">Action Plan</h2><p className="mt-1 text-sm text-muted-foreground">As Zone Leader, define the work and assign it to a member of {tag.zone}.</p></div><Field label="Action Plan *"><Textarea value={plan} onChange={(e) => setPlan(e.target.value)} placeholder={tag.actionPlan || tag.requiredAction || "Describe the work required to clear this Red Tag"} /></Field><div className="grid gap-4 md:grid-cols-3"><Field label="Responsible Zone Member *"><Select value={memberId || tag.responsiblePersonId} onValueChange={(v) => setMemberId(v ?? "")}><SelectTrigger><SelectValue placeholder="Select Zone Member" /></SelectTrigger><SelectContent>{(zoneConfig?.members ?? []).map((member) => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Due Date *"><Input type="date" value={dueDate || tag.dueDate || tag.targetDate} onChange={(e) => setDueDate(e.target.value)} /></Field><Field label="Priority *"><Select value={tag.priority && priority === "Medium" ? tag.priority : priority} onValueChange={(v) => setPriority((v ?? "Medium") as RedTagPriority)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Low", "Medium", "High", "Critical"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></Field></div><Field label="Remarks"><Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder={tag.instructions || "Optional remarks"} /></Field><div className="flex justify-end"><Button disabled={!(plan || tag.actionPlan || tag.requiredAction).trim() || !(memberId || tag.responsiblePersonId) || !(dueDate || tag.dueDate || tag.targetDate) || !priority} onClick={() => { if(savePlan())setSuccessMessage("Action assigned to the responsible Zone Member."); }}>Assign Action</Button></div></CardContent></Card>}
      {tag.actionPlan && <Card><CardContent className="p-5"><h2 className="font-semibold">Action Plan</h2><p className="mt-3 text-sm leading-6">{tag.actionPlan}</p>{tag.instructions && <p className="mt-3 text-sm text-muted-foreground">{tag.instructions}</p>}<dl className="mt-4 grid gap-3 border-t pt-4 text-sm sm:grid-cols-3"><div><dt className="text-muted-foreground">Responsible</dt><dd className="font-medium">{tag.responsiblePersonName}</dd></div><div><dt className="text-muted-foreground">Assigned by</dt><dd className="font-medium">{tag.assignedByName ?? tag.zoneLeaderName}</dd></div><div><dt className="text-muted-foreground">Canonical Action</dt><dd className="font-mono text-xs font-medium">{tag.actionId ?? "Legacy record"}</dd></div></dl></CardContent></Card>}
      {tag.reviewComment && <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200"><p className="font-semibold">Zone Leader requested rework</p><p className="mt-1">{tag.reviewComment}</p></div>}
      <Card><CardContent className="p-5"><h2 className="font-semibold">Closure Evidence</h2><div className="mt-4 grid gap-5 md:grid-cols-2"><EvidenceImage label="Before" src={tag.imageUrl} alt="Original Red Tag issue" /><EvidenceImage label="After" src={tag.closureImageUrl} alt="Red Tag closure" /></div>{tag.completionComment && <div className="mt-4 border-t pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completion Comment</p><p className="mt-2 text-sm">{tag.completionComment}</p><p className="mt-2 text-xs text-muted-foreground">Submitted by {tag.submittedByName} {tag.submittedAt ? `· ${displayDate(tag.submittedAt, true)}` : ""}</p></div>}</CardContent></Card>
      {canWork && <Card><CardContent className="p-5"><h2 className="font-semibold">Zone Member Work</h2><div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={() => setCaptureOpen(true)}><Camera className="size-4" /> Add Closure Evidence</Button></div><div className="mt-4 grid gap-3"><Field label="Completion Comment *"><Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Describe the work completed" /></Field><div className="flex justify-end"><Button disabled={!tag.closureImageUrl || !comment.trim()} onClick={() => { if (submitRedTagForReview(tag.id, user, comment)) setSuccessMessage("Red Tag submitted for Zone Leader review."); }}>Submit for Review</Button></div></div></CardContent></Card>}
      {isLeader && tag.status === "Awaiting Review" && <Card><CardContent className="p-5"><h2 className="font-semibold">Zone Leader Review</h2><p className="mt-1 text-sm text-muted-foreground">Compare the evidence and review the member&apos;s completion comment.</p><div className="mt-4 flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setReworkOpen(true)}>Return for Rework</Button><Button onClick={() => { if (approveAndCloseRedTag(tag.id, user)) setSuccessMessage("Red Tag approved and closed."); }}><CheckCircle2 className="size-4" /> Approve & Close</Button></div></CardContent></Card>}
      {tag.status === "Closed" && <Card><CardContent className="grid gap-4 p-5 sm:grid-cols-3"><Meta label="Reviewed By" value={`${tag.reviewedBy ?? "Zone Leader"}${tag.reviewedByRole ? ` · ${tag.reviewedByRole}` : ""}`} /><Meta label="Closed By" value={`${tag.closedBy ?? "Zone Leader"}${tag.closedByRole ? ` · ${tag.closedByRole}` : ""}`} /><Meta label="Closure Date" value={tag.closedAt ? displayDate(tag.closedAt, true) : "Not recorded"} /></CardContent></Card>}
    </div><aside className="grid content-start gap-5"><Card><CardContent className="grid justify-items-center p-5"><QrCode value={`/5s/red/${tag.id}`} size={176} /><p className="mt-3 font-mono text-sm font-bold">{tag.tagNumber}</p></CardContent></Card><Card><CardContent className="p-5"><h2 className="font-semibold">Timeline</h2><div className="mt-5 grid gap-0">{(tag.history ?? []).map((event, i) => <div key={event.id} className="relative grid grid-cols-[18px_1fr] gap-3 pb-5 last:pb-0"><div className="relative"><span className="absolute left-[5px] top-1 size-2.5 rounded-full bg-red-600" />{i < tag.history.length - 1 && <span className="absolute left-[9px] top-4 h-full w-px bg-border" />}</div><div><p className="text-sm font-semibold">{event.label}</p><p className="mt-1 text-xs text-muted-foreground">{displayDate(event.at, true)} · {event.actor}{event.actorRole ? ` · ${event.actorRole}` : ""}</p>{event.comment && <p className="mt-1 text-xs">{event.comment}</p>}</div></div>)}</div></CardContent></Card></aside></div>
    <AfterPhotoCaptureDialog open={captureOpen} beforeImage={tag.imageUrl} beforeName={`${tag.tagNumber} original issue`} onOpenChange={setCaptureOpen} onUsePhoto={(photo) => saveRedTagClosureEvidence(tag.id, user, photo)} />
    <Dialog open={reworkOpen} onOpenChange={setReworkOpen}><DialogContent><DialogHeader><DialogTitle>Return for Rework</DialogTitle></DialogHeader><Field label="Comment *"><Textarea value={reworkComment} onChange={(e) => setReworkComment(e.target.value)} placeholder="Explain what must be corrected before resubmission" /></Field><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setReworkOpen(false)}>Cancel</Button><Button disabled={!reworkComment.trim()} onClick={() => { if (returnRedTagForRework(tag.id, user, reworkComment)) { setSuccessMessage("Red Tag returned for rework."); setReworkOpen(false); setReworkComment(""); } }}>Return for Rework</Button></div></DialogContent></Dialog>
  </PageContainer>;
}

function EvidenceImage({ label, src, alt }: { label: string; src?: string; alt: string }) { return <section><p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>{src ? <img src={src} alt={alt} className="aspect-video w-full rounded-xl border object-cover" /> : <div className="grid aspect-video place-items-center rounded-xl border border-dashed text-muted-foreground"><div className="text-center"><ImageIcon className="mx-auto size-7" /><p className="mt-2 text-xs">No {label.toLowerCase()} photo</p></div></div>}</section>; }

function Meta({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Flag }) { return <div className="min-w-0">{Icon && <Icon className="mb-2 size-4 text-red-600" />}<p className="break-words text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-semibold [overflow-wrap:anywhere]">{value}</p></div>; }
function Panel({ title, text }: { title: string; text: string }) { return <Card><CardContent className="p-5"><h2 className="font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></CardContent></Card>; }
function Missing({ onBack }: { onBack: () => void }) { return <PageContainer><div className="grid min-h-[50vh] place-items-center rounded-xl border border-dashed"><div className="text-center"><Flag className="mx-auto size-9 text-muted-foreground" /><h1 className="mt-3 font-semibold">Red Tag not found</h1><Button className="mt-4" variant="outline" onClick={onBack}>Back to Red Tags</Button></div></div></PageContainer>; }

export function RedTagPrintPage({ tagId }: { tagId: string }) {
  const router = useRouter(); const user = useCurrentUser(); const tag = useRedTags().find((item) => item.id === tagId);
  const { t } = useI18n();
  if (!tag) return <Missing onBack={() => router.push("/5s/red")} />;
  const tagIdToPrint = tag.id;
  async function print() {
    await document.fonts?.ready;
    const root = document.querySelector<HTMLElement>(".red-tag-print-surface");
    const images = root ? Array.from(root.querySelectorAll("img")) : [];
    await Promise.all(images.map(async (image) => { if (image.complete) return; try { await image.decode(); } catch { /* Print the tag even if optional evidence fails. */ } }));
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    markTagPrinted(tagIdToPrint, user);
    window.print();
  }
  return <PageContainer className="red-tag-print-page max-w-none"><style>{`@media print { @page { size: A4 portrait; margin: 10mm; } }`}</style><div className="print:hidden"><FiveSPageHeader eyebrow="Red Tags / Print Preview" title="Print Red Tag" description="Print this label and attach it to the tagged item."
    leading={<Button variant="ghost" size="icon-sm" onClick={() => router.back()}><ArrowLeft className="size-4" /></Button>}
    actions={<><Button variant="outline" onClick={() => router.push(`/5s/red/${tag.id}`)}><Eye className="size-4" /> {t("common.view")}</Button><Button className="min-h-11 md:min-h-9" onClick={print}><Printer className="size-4" /> {t("redTag.print")}</Button><ReportPdfActions selector=".red-tag-print-surface" filename={`IQ-Red-Tag-${tag.tagNumber}.pdf`} title={`IQ Red Tag Report - ${tag.tagNumber}`} /></>} /></div>
    <article className="grid gap-4 overflow-hidden rounded-xl border bg-white p-4 text-slate-950 shadow-sm md:hidden"><ReportHeader title={tag.status === "Closed" ? "Red Tag Closure Report" : "Red Tag Report"} reportId={tag.tagNumber} subtitle={`${tag.itemName} · ${tag.zone}`} className="-mx-4 -mt-4" /><MobileRedTagDetails tag={tag} /></article>
    <div className="red-tag-print-surface motion-success-in hidden w-full place-items-center gap-6 rounded-xl border bg-muted/25 p-4 sm:p-8 md:grid print:grid"><ReportHeader title={tag.status === "Closed" ? "Red Tag Closure Report" : "Red Tag Report"} reportId={tag.tagNumber} subtitle={`${tag.itemName} · ${tag.zone}`} className="w-full max-w-[800px] rounded-lg" /><RedTagLabel tag={tag} /></div>
  </PageContainer>;
}

function MobileRedTagDetails({ tag }: { tag: RedTag }) {
  return <div className="grid gap-4"><dl className="grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm">{[["Status", getRedTagDisplayStatus(tag.status)], ["Priority", tag.priority ?? "Not set"], ["Zone", tag.zone], ["Responsible", tag.responsiblePersonName || "Unassigned"], ["Due Date", tag.dueDate ? displayDate(`${tag.dueDate}T00:00:00`) : "Not set"], ["Zone Leader", tag.zoneLeaderName]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-0.5 break-words font-semibold">{value}</dd></div>)}</dl><MobileRedTagSection title="Issue"><p>{tag.remarks || tag.reason}</p></MobileRedTagSection><MobileRedTagSection title="Action Plan"><p>{tag.actionPlan || tag.requiredAction || "Awaiting Zone Leader action plan."}</p></MobileRedTagSection><MobileRedTagSection title="Before / After"><div className="grid gap-4"><EvidenceImage label="Before" src={tag.imageUrl} alt="Original Red Tag issue" /><EvidenceImage label="After" src={tag.closureImageUrl} alt="Red Tag closure" /></div></MobileRedTagSection>{tag.completionComment && <MobileRedTagSection title="Completion Comment"><p>{tag.completionComment}</p></MobileRedTagSection>}<MobileRedTagSection title="Zone Leader Review"><dl className="grid grid-cols-2 gap-3"><div><dt className="text-xs text-muted-foreground">Reviewed By</dt><dd className="font-semibold">{tag.reviewedBy ?? "—"}</dd></div><div><dt className="text-xs text-muted-foreground">Closed</dt><dd className="font-semibold">{tag.closedAt ? displayDate(tag.closedAt, true) : "—"}</dd></div></dl></MobileRedTagSection><MobileRedTagSection title="Timeline"><ol className="grid gap-3">{(tag.history ?? []).map((event) => <li key={event.id} className="border-l-2 border-red-600 pl-3"><p className="font-semibold">{event.label}</p><p className="mt-1 text-xs text-muted-foreground">{displayDate(event.at, true)} · {event.actor}</p>{event.comment && <p className="mt-1">{event.comment}</p>}</li>)}</ol></MobileRedTagSection></div>;
}

function MobileRedTagSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg border p-4"><h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-red-700">{title}</h2><div className="text-sm leading-6">{children}</div></section>; }

function RedTagLabel({ tag }: { tag: RedTag }) {
  return <article className="red-tag-label flex w-full max-w-[400px] flex-col overflow-hidden border-[3px] border-red-700 bg-white text-black shadow-lg">
    <header className="bg-red-700 px-5 py-3 text-center text-white"><p className="text-[10px] font-bold tracking-[.25em]">5S WORKPLACE CONTROL</p><h1 className="mt-1 text-3xl font-black tracking-wide">RED TAG</h1></header>
    <div className="grid flex-1 content-between gap-3 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-widest text-red-700">Tag Number</p><p className="mt-1 font-mono text-lg font-black">{tag.tagNumber}</p></div><span className="rounded border-2 border-red-700 px-2 py-1 text-[10px] font-black uppercase text-red-700">{getRedTagDisplayStatus(tag.status)}</span></div><div className="flex justify-center"><QrCode value={`/5s/red/${tag.id}`} size={116} /></div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-y-2 border-red-200 py-3"><LabelValue label="Plant" value={tag.plant} /><LabelValue label="Zone" value={tag.zone} /><LabelValue label="Item / Equipment" value={tag.itemName} wide /><LabelValue label="Section" value={tag.section} /><LabelValue label="Quantity" value={String(tag.quantity)} /><LabelValue label="Reason" value={tag.reason === "Others" ? tag.customReason ?? tag.reason : tag.reason} wide />{tag.remarks && <LabelValue label="Issue / Remarks" value={tag.remarks} wide />}<LabelValue label="Required Action" value={tag.requiredAction} wide /><LabelValue label="Responsible" value={tag.responsiblePersonName || "Awaiting Zone Leader"} /><LabelValue label="Target Date" value={tag.targetDate ? displayDate(`${tag.targetDate}T00:00:00`) : "Not set"} /></div>
      <div className="flex items-end justify-between gap-4 text-xs"><div><b>TAGGED BY</b><p>{tag.createdByName}</p></div><div className="text-right"><b>DATE</b><p>{displayDate(tag.createdAt)}</p></div></div>
      <p className="border-t border-red-200 pt-2 text-center text-[9px] font-semibold leading-3 text-red-800">Attach this tag to the identified item until the issue is resolved and the tag is formally cleared.</p>
    </div></article>;
}
function LabelValue({ label, value, wide }: { label: string; value: string; wide?: boolean }) { return <div className={wide ? "col-span-2" : ""}><p className="text-[9px] font-black uppercase tracking-widest text-red-700">{label}</p><p className="mt-0.5 text-xs font-bold leading-4">{value}</p></div>; }

/** Dependency-free deterministic matrix carrying a stable tag URL visual. */
function QrCode({ value, size }: { value: string; size: number }) {
  const cells = useMemo(() => { const n = 25; const grid = Array.from({ length: n }, () => Array(n).fill(false)); const finder = (x: number, y: number) => { for (let j=0;j<7;j++) for(let i=0;i<7;i++) grid[y+j][x+i] = i===0||j===0||i===6||j===6||(i>=2&&i<=4&&j>=2&&j<=4); }; finder(0,0); finder(18,0); finder(0,18); let seed=2166136261; for (const c of value) seed=(seed^c.charCodeAt(0))*16777619; for(let y=0;y<n;y++) for(let x=0;x<n;x++) if(!((x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16))) { seed=(seed*1664525+1013904223)>>>0; grid[y][x]=(seed&3)!==0; } return grid; }, [value]);
  return <svg width={size} height={size} viewBox="0 0 29 29" role="img" aria-label={`QR code for ${value}`} className="bg-white p-1"><rect width="29" height="29" fill="white" />{cells.flatMap((row,y)=>row.map((on,x)=>on?<rect key={`${x}-${y}`} x={x+2} y={y+2} width="1" height="1" fill="black" />:null))}</svg>;
}
