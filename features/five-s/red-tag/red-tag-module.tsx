"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Camera, CheckCircle2, Eye, Flag, Image as ImageIcon, Package, Plus, Printer, Search, Trash2, Upload, UserRound, Wrench, X } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FiveSPageHeader from "@/features/five-s/components/FiveSPageHeader";
import { FIVE_S_ZONE_CONFIGURATION, getMembersForZone, toLocalInputDate } from "@/lib/five-s/configuration";
import { useCurrentUser } from "@/lib/current-user";
import { createRedTag, markTagPrinted, useRedTags } from "./store";
import { RED_TAG_REASONS, RED_TAG_SECTIONS, type RedTag, type RedTagReason, type RedTagStatus } from "./types";
import { useI18n } from "@/components/preferences/use-i18n";
import { optimizeEvidenceImage } from "@/lib/evidence-images";

const STATUS_TONE: Record<RedTagStatus, "danger" | "warning" | "success" | "secondary"> = {
  Open: "danger", "In Progress": "warning", Resolved: "success", Closed: "secondary",
};

function displayDate(value: string, time = false) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", ...(time ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(value));
}

function Summary({ tags }: { tags: RedTag[] }) {
  const items = ["Total Tags", "Open", "In Progress", "Resolved"].map((label) => ({
    label, value: label === "Total Tags" ? tags.length : tags.filter((tag) => tag.status === label).length,
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
      (status === "All" || tag.status === status) && (section === "All" || tag.section === section) &&
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
        <Filter value={status} onChange={setStatus} label="All statuses" options={["Open", "In Progress", "Resolved", "Closed"]} />
        <Filter value={section} onChange={setSection} label="All sections" options={[...RED_TAG_SECTIONS]} />
        <Filter value={reason} onChange={setReason} label="All reasons" options={[...RED_TAG_REASONS]} />
        <Filter value={person} onChange={setPerson} label="All responsible" options={people} />
        <Input type="date" aria-label="Created date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid gap-3 p-3 md:hidden">{filtered.map((tag) => <button key={tag.id} onClick={() => router.push(`/5s/red/${tag.id}`)} className="min-w-0 rounded-xl border bg-background p-4 text-left active:bg-muted/40"><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className="font-mono text-xs font-bold text-red-700 dark:text-red-400">{tag.tagNumber}</p><h2 className="mt-1 break-words font-semibold">{tag.itemName}</h2></div><Badge variant={STATUS_TONE[tag.status]}>{tag.status}</Badge></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm"><div><dt className="text-xs text-muted-foreground">Section</dt><dd className="mt-1 break-words font-medium">{tag.section}</dd></div><div><dt className="text-xs text-muted-foreground">Reason</dt><dd className="mt-1 break-words font-medium">{tag.reason}</dd></div><div><dt className="text-xs text-muted-foreground">Responsible</dt><dd className="mt-1 break-words font-medium">{tag.responsiblePersonName}</dd></div><div><dt className="text-xs text-muted-foreground">Target</dt><dd className="mt-1 font-medium">{displayDate(tag.targetDate)}</dd></div></dl></button>)}</div>
      <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1180px] text-sm"><thead className="border-b bg-muted/20 text-left text-[11px] uppercase tracking-wide text-muted-foreground"><tr>
        {["Tag No.", "Item / Issue", "Section", "Reason", "Responsible Person", "Target Date", "Status", "Created By", "Created Date", "Actions"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
      </tr></thead><tbody>{filtered.map((tag) => <tr key={tag.id} className="border-b last:border-0 hover:bg-muted/20">
        <td className="px-4 py-3 font-mono text-xs font-semibold text-red-700 dark:text-red-400">{tag.tagNumber}</td><td className="px-4 py-3 font-medium">{tag.itemName}</td>
        <td className="px-4 py-3">{tag.section}</td><td className="px-4 py-3">{tag.reason}</td><td className="px-4 py-3">{tag.responsiblePersonName}</td>
        <td className="px-4 py-3 whitespace-nowrap">{displayDate(tag.targetDate)}</td><td className="px-4 py-3"><Badge variant={STATUS_TONE[tag.status]}>{tag.status}</Badge></td>
        <td className="px-4 py-3">{tag.createdByName}</td><td className="px-4 py-3 whitespace-nowrap">{displayDate(tag.createdAt)}</td><td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => router.push(`/5s/red/${tag.id}`)}><Eye className="size-4" /> View</Button></td>
      </tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="py-14 text-center text-sm text-muted-foreground">No Red Tags match the selected filters.</div>}
    </section>
  </PageContainer>;
}

function Filter({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[] }) {
  return <Select value={value} onValueChange={(v) => onChange(v ?? "All")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">{label}</SelectItem>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>;
}

export function RedTagCreatePage() {
  const router = useRouter(); const user = useCurrentUser();
  const { t } = useI18n();
  const today = useMemo(() => toLocalInputDate(new Date()), []); const tomorrow = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return toLocalInputDate(d); }, []);
  const [zone, setZone] = useState(user.primaryZone); const [section, setSection] = useState("Production"); const [item, setItem] = useState(""); const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState<RedTagReason | "">(""); const [customReason, setCustomReason] = useState(""); const [remarks, setRemarks] = useState(""); const [requiredAction, setRequiredAction] = useState("");
  const [personId, setPersonId] = useState(""); const [targetDate, setTargetDate] = useState(tomorrow); const [imageUrl, setImageUrl] = useState<string>(); const [preview, setPreview] = useState(false);
  const [creating, setCreating] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null); const cameraRef = useRef<HTMLInputElement>(null); const members = getMembersForZone(zone); const zoneConfig = FIVE_S_ZONE_CONFIGURATION.find((z) => z.name === zone);
  const valid = item.trim() && Number(quantity) >= 1 && reason && (reason !== "Others" || customReason.trim()) && requiredAction.trim() && personId && targetDate >= today;
  async function imageChanged(e: React.ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (!file) return; try { const { dataUrl } = await optimizeEvidenceImage(file); setImageUrl(dataUrl); } catch (error) { window.alert(error instanceof Error ? error.message : "Unable to process this image."); } e.target.value = ""; }
  function submit() { if (!valid || !reason || creating) return; const person = members.find((m) => m.id === personId); if (!person) return; setCreating(true); window.setTimeout(() => { const tag = createRedTag({ plant: user.plant, zone, section, itemName: item.trim(), quantity: Number(quantity), reason, customReason: customReason.trim() || undefined, remarks: remarks.trim(), requiredAction: requiredAction.trim(), responsiblePersonId: person.id, responsiblePersonName: person.name, targetDate, createdById: user.id, createdByName: user.name, imageUrl }, user); router.push(`/5s/red/${tag.id}/print`); }, 240); }
  return <PageContainer className="max-w-none">
    <FiveSPageHeader eyebrow="Red Tags / Create" title="Create Red Tag" description="Capture the issue, assign it and print a physical tag."
      leading={<Button variant="ghost" size="icon-sm" onClick={() => router.push("/5s/red")}><ArrowLeft className="size-4" /></Button>}
      actions={<><Button variant="ghost" onClick={() => router.push("/5s/red")} disabled={creating}>{t("common.cancel")}</Button><Button disabled={!valid || creating} onClick={submit}><Printer className="size-4" /> {creating ? "Creating Tag..." : t("redTag.create")}</Button></>} />
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid gap-5">
      <Card><CardContent className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <ReadOnly label="Plant" value={user.plant} /><Field label="Zone"><Select value={zone} onValueChange={(v) => { setZone(v ?? user.primaryZone); setPersonId(""); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FIVE_S_ZONE_CONFIGURATION.map((z) => <SelectItem key={z.name} value={z.name}>{z.name}</SelectItem>)}</SelectContent></Select></Field>
        <ReadOnly label="Tag No." value={`RT-EGM-${zoneConfig?.code ?? "ZA"}-###`} /><ReadOnly label="Date" value={displayDate(new Date().toISOString(), true)} />
      </CardContent></Card>
      <Card><CardContent className="grid gap-5 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_2fr_140px]"><Field label="Section"><Filter value={section} onChange={setSection} label="Select section" options={[...RED_TAG_SECTIONS]} /></Field><Field label="Name of Item / Equipment"><Input required value={item} onChange={(e) => setItem(e.target.value)} placeholder="Enter machine, item or area name" /></Field><Field label="Quantity"><Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Field></div>
        <Field label="Reason"><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{RED_TAG_REASONS.map((option) => <button key={option} type="button" onClick={() => setReason(option)} className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${reason === option ? "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500/30 dark:bg-red-950/35 dark:text-red-200" : "bg-background hover:border-red-300 hover:bg-red-50/40 dark:hover:bg-red-950/15"}`}>{reason === option && <CheckCircle2 className="mr-2 inline size-4" />}{option}</button>)}</div></Field>
        {reason === "Others" && <Field label="Specify Reason"><Input required value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Enter the reason" /></Field>}
        <div className="grid gap-4 lg:grid-cols-2"><Field label="Remarks"><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Describe the issue or condition observed..." /></Field><Field label="Required Action"><Textarea required value={requiredAction} onChange={(e) => setRequiredAction(e.target.value)} placeholder="Describe what must be done to clear this tag..." /></Field></div>
        <Field label="Issue Photo"><div className="flex flex-wrap items-center gap-2"><Button type="button" variant="outline" onClick={() => uploadRef.current?.click()}><Upload className="size-4" /> Upload</Button><Button type="button" variant="outline" onClick={() => cameraRef.current?.click()}><Camera className="size-4" /> Camera</Button><input ref={uploadRef} hidden type="file" accept="image/*" onChange={imageChanged} /><input ref={cameraRef} hidden type="file" accept="image/*" capture="environment" onChange={imageChanged} />{imageUrl && <div className="flex items-center gap-2 rounded-lg border p-1.5"><button type="button" onClick={() => setPreview(true)}><img src={imageUrl} alt="Issue preview" className="size-12 rounded object-cover" /></button><Button type="button" size="icon-sm" variant="ghost" onClick={() => setImageUrl(undefined)}><Trash2 className="size-4" /></Button></div>}</div></Field>
        <div className="grid gap-4 md:grid-cols-2"><Field label="Responsible Person"><Select value={personId} onValueChange={(v) => setPersonId(v ?? "")}><SelectTrigger><SelectValue placeholder="Select zone member" /></SelectTrigger><SelectContent>{members.map((m) => <SelectItem key={m.id} value={m.id}>{m.name} · {m.role}</SelectItem>)}</SelectContent></Select></Field><Field label="Target Date"><Input type="date" min={today} value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></Field></div>
      </CardContent></Card>
      <div className="flex justify-end sm:hidden"><Button className="w-full" disabled={!valid || creating} type="submit"><Printer className="size-4" /> {creating ? "Creating Tag..." : "Create & Print Tag"}</Button></div>
    </form>
    <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-w-4xl"><DialogHeader><DialogTitle>Issue Photo</DialogTitle></DialogHeader>{imageUrl && <img src={imageUrl} alt="Issue full-screen preview" className="max-h-[75vh] w-full object-contain" />}</DialogContent></Dialog>
  </PageContainer>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="grid content-start gap-2"><Label>{label}</Label>{children}</div>; }
function ReadOnly({ label, value }: { label: string; value: string }) { return <Field label={label}><div className="flex h-10 items-center rounded-md border bg-muted/35 px-3 text-sm font-medium">{value}</div></Field>; }

export function RedTagDetailPage({ tagId }: { tagId: string }) {
  const router = useRouter(); const tag = useRedTags().find((item) => item.id === tagId);
  if (!tag) return <Missing onBack={() => router.push("/5s/red")} />;
  return <PageContainer className="max-w-none"><FiveSPageHeader eyebrow="Red Tags / Details" title={tag.tagNumber} description={`${tag.itemName} · ${tag.section}`}
    leading={<Button variant="ghost" size="icon-sm" onClick={() => router.push("/5s/red")}><ArrowLeft className="size-4" /></Button>}
    actions={<Button onClick={() => router.push(`/5s/red/${tag.id}/print`)}><Printer className="size-4" /> Print Tag</Button>} />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,.7fr)]"><div className="grid gap-5">
      <Card><CardContent className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4"><Meta icon={Package} label="Item / Equipment" value={tag.itemName} /><Meta icon={Flag} label="Status" value={tag.status} /><Meta label="Section" value={tag.section} /><Meta label="Quantity" value={String(tag.quantity)} /><Meta label="Reason" value={tag.reason === "Others" ? tag.customReason ?? tag.reason : tag.reason} /><Meta icon={UserRound} label="Responsible" value={tag.responsiblePersonName} /><Meta icon={CalendarDays} label="Target Date" value={displayDate(tag.targetDate)} /><Meta label="Tagged By" value={tag.createdByName} /></CardContent></Card>
      <div className="grid gap-5 md:grid-cols-2"><Panel title="Remarks" text={tag.remarks || "No remarks added."} /><Panel title="Required Action" text={tag.requiredAction} /></div>
      <Card><CardContent className="p-5"><h2 className="font-semibold">Issue Photo</h2>{tag.imageUrl ? <img src={tag.imageUrl} alt={tag.itemName} className="mt-4 max-h-[420px] w-full rounded-lg border object-cover" /> : <div className="mt-4 grid h-40 place-items-center rounded-lg border border-dashed text-muted-foreground"><ImageIcon className="size-8" /></div>}</CardContent></Card>
    </div><aside className="grid content-start gap-5"><Card><CardContent className="grid justify-items-center p-5"><QrCode value={`/5s/red/${tag.id}`} size={176} /><p className="mt-3 font-mono text-sm font-bold">{tag.tagNumber}</p></CardContent></Card><Card><CardContent className="p-5"><h2 className="font-semibold">Tag History</h2><div className="mt-5 grid gap-0">{tag.history.map((event, i) => <div key={event.id} className="relative grid grid-cols-[18px_1fr] gap-3 pb-5 last:pb-0"><div className="relative"><span className="absolute left-[5px] top-1 size-2.5 rounded-full bg-red-600" />{i < tag.history.length - 1 && <span className="absolute left-[9px] top-4 h-full w-px bg-border" />}</div><div><p className="text-sm font-semibold">{event.label}</p><p className="mt-1 text-xs text-muted-foreground">{displayDate(event.at, true)} · by {event.actor}</p></div></div>)}</div></CardContent></Card></aside></div>
  </PageContainer>;
}

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
    actions={<><Button variant="outline" onClick={() => router.push(`/5s/red/${tag.id}`)}><Eye className="size-4" /> {t("common.view")}</Button><Button onClick={print}><Printer className="size-4" /> {t("redTag.print")}</Button></>} /></div>
    <div className="red-tag-print-surface motion-success-in grid place-items-center rounded-xl border bg-muted/25 p-4 sm:p-8"><RedTagLabel tag={tag} /></div>
  </PageContainer>;
}

function RedTagLabel({ tag }: { tag: RedTag }) {
  return <article className="red-tag-label flex w-full max-w-[400px] flex-col overflow-hidden border-[3px] border-red-700 bg-white text-black shadow-lg">
    <header className="bg-red-700 px-5 py-3 text-center text-white"><p className="text-[10px] font-bold tracking-[.25em]">5S WORKPLACE CONTROL</p><h1 className="mt-1 text-3xl font-black tracking-wide">RED TAG</h1></header>
    <div className="grid flex-1 content-between gap-3 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-widest text-red-700">Tag Number</p><p className="mt-1 font-mono text-lg font-black">{tag.tagNumber}</p></div><span className="rounded border-2 border-red-700 px-2 py-1 text-[10px] font-black uppercase text-red-700">{tag.status}</span></div><div className="flex justify-center"><QrCode value={`/5s/red/${tag.id}`} size={116} /></div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-y-2 border-red-200 py-3"><LabelValue label="Plant" value={tag.plant} /><LabelValue label="Zone" value={tag.zone} /><LabelValue label="Item / Equipment" value={tag.itemName} wide /><LabelValue label="Section" value={tag.section} /><LabelValue label="Quantity" value={String(tag.quantity)} /><LabelValue label="Reason" value={tag.reason === "Others" ? tag.customReason ?? tag.reason : tag.reason} wide />{tag.remarks && <LabelValue label="Issue / Remarks" value={tag.remarks} wide />}<LabelValue label="Required Action" value={tag.requiredAction} wide /><LabelValue label="Responsible" value={tag.responsiblePersonName} /><LabelValue label="Target Date" value={displayDate(tag.targetDate)} /></div>
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
