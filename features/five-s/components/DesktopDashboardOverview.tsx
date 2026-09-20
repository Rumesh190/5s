"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, FileText, Gauge, ListChecks, TimerReset } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";
import { getActionStatusLabel } from "@/lib/five-s/lifecycle-status";
import type { MyAction } from "../types/my-actions";

export interface DesktopDashboardMetrics {
  usingSampleData: boolean;
  totalAudits: number;
  completedAudits: number;
  draftAudits: number;
  inProgressAudits: number;
  averageScore: number;
  openActions: number;
  overdueActions: number;
  completedActions: number;
  nonCompliances: number;
  attention: MyAction[];
  zonePerformance: Array<{ zone: string; score: number; leader: string }>;
}

export function getAuditCompletionRate(total: number, completed: number) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

const KPI_ITEMS = [
  { key: "totalAudits", label: "Total Audits", icon: ClipboardCheck, tone: "bg-primary/10 text-primary" },
  { key: "completedAudits", label: "Completed Audits", icon: CheckCircle2, tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  { key: "draftAudits", label: "Draft Audits", icon: FileText, tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  { key: "inProgressAudits", label: "In Progress", icon: TimerReset, tone: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  { key: "averageScore", label: "Avg. Audit Score", icon: Gauge, tone: "bg-teal-500/10 text-teal-700 dark:text-teal-400", suffix: "%" },
] as const;

export default function DesktopDashboardOverview({ metrics, periodLabel, selectedZone, onViewActions, onOpenAction }: { metrics: DesktopDashboardMetrics; periodLabel: string; selectedZone: string; onViewActions: () => void; onOpenAction: (action: MyAction) => void }) {
  const completionRate = getAuditCompletionRate(metrics.totalAudits, metrics.completedAudits);
  const zoneScores = FIVE_S_ZONE_CONFIGURATION
    .filter((zone) => selectedZone === "All" || zone.name === selectedZone)
    .map((zone) => ({ ...zone, result: metrics.zonePerformance.find((item) => item.zone === zone.name) }));

  return <section className="hidden min-w-0 gap-4 md:grid" aria-label="Dashboard overview">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-foreground">Audit overview</h2>
      {metrics.usingSampleData && <Badge variant="secondary">Showing sample data</Badge>}
    </div>

    <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
      {KPI_ITEMS.map((item) => {
        const Icon = item.icon;
        const value = metrics[item.key];
        return <Card key={item.key} className="min-h-24 justify-center gap-0 rounded-2xl">
          <CardContent className="flex items-center gap-3 p-4 xl:px-5">
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.tone}`}><Icon className="size-5" aria-hidden="true" /></span>
            <span className="min-w-0"><span className="block text-2xl font-bold leading-none tracking-tight">{value}{"suffix" in item ? item.suffix : ""}</span><span className="mt-1.5 block text-[13px] font-medium text-muted-foreground">{item.label}</span></span>
          </CardContent>
        </Card>;
      })}
    </div>

    <div className="grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-[0.92fr_1fr_1.12fr]">
      <Card className="gap-0 overflow-hidden rounded-2xl">
        <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-center border-b border-border/60 pb-4">
          <CardTitle className="text-base">Action Summary</CardTitle>
          <Button type="button" variant="ghost" size="sm" onClick={onViewActions}>View All <ArrowRight className="size-4" /></Button>
        </CardHeader>
        <CardContent className="grid flex-1 grid-cols-2 gap-px bg-border/60 p-0">
          <SummaryMetric value={metrics.openActions} label="Open Actions" tone="text-amber-700 dark:text-amber-400" />
          <SummaryMetric value={metrics.overdueActions} label="Overdue Actions" tone="text-red-600 dark:text-red-400" />
          <SummaryMetric value={metrics.completedActions} label="Closed Actions" tone="text-emerald-700 dark:text-emerald-400" />
          <SummaryMetric value={metrics.nonCompliances} label="Non-Compliances" tone="text-primary" />
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden rounded-2xl">
        <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-start border-b border-border/60 pb-4">
          <div><CardTitle className="text-base">Audit Performance</CardTitle><p className="mt-1 text-xs text-muted-foreground">Completion across the selected period.</p></div>
          <Badge variant="outline">{periodLabel}</Badge>
        </CardHeader>
        <CardContent className="flex flex-1 items-center gap-5 py-5">
          <div className="relative grid size-28 shrink-0 place-items-center" role="img" aria-label={`Audit completion rate ${completionRate}%`}>
            <svg viewBox="0 0 42 42" className="size-28 -rotate-90" aria-hidden="true"><circle cx="21" cy="21" r="16" fill="none" stroke="var(--muted)" strokeWidth="4"/><circle cx="21" cy="21" r="16" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" pathLength="100" strokeDasharray={`${completionRate} 100`}/></svg>
            <span className="absolute text-center"><span className="block text-2xl font-bold leading-none">{completionRate}%</span><span className="mt-1 block text-[10px] font-medium text-muted-foreground">Completion</span></span>
          </div>
          <dl className="grid min-w-0 flex-1 gap-2.5 text-sm">
            <PerformanceRow label="Total audits" value={metrics.totalAudits} />
            <PerformanceRow label="Completed" value={metrics.completedAudits} tone="text-emerald-700 dark:text-emerald-400" />
            <PerformanceRow label="In progress" value={metrics.inProgressAudits} tone="text-blue-700 dark:text-blue-400" />
            <PerformanceRow label="Draft" value={metrics.draftAudits} tone="text-amber-700 dark:text-amber-400" />
          </dl>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-border/60 pb-4"><CardTitle className="text-base">5S Performance by Zone</CardTitle><p className="mt-1 text-xs text-muted-foreground">Average audit score for {selectedZone === "All" ? "configured zones" : selectedZone}.</p></CardHeader>
        <CardContent className="grid flex-1 content-center gap-4 py-5">
          {zoneScores.some((zone) => zone.result) ? zoneScores.map((zone) => <div key={zone.name} className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-sm">
            <span className="truncate font-medium">{zone.name}</span>
            {zone.result ? <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${zone.name} audit score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={zone.result.score}><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, zone.result.score))}%` }} /></div> : <div className="h-2.5 rounded-full bg-muted" aria-label={`${zone.name}: No data`} />}
            <span className="text-right font-semibold tabular-nums">{zone.result ? `${zone.result.score}%` : "—"}</span>
          </div>) : <div className="grid min-h-32 place-items-center text-center"><div><ListChecks className="mx-auto size-6 text-muted-foreground"/><p className="mt-2 text-sm font-medium">No audit data for this period.</p><p className="mt-1 text-xs text-muted-foreground">Zone scores will appear when completed audit data is available.</p></div></div>}
        </CardContent>
      </Card>
    </div>

    <Card className="gap-0 overflow-hidden rounded-2xl">
      <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-center border-b border-border/60 pb-4">
        <div className="flex min-w-0 items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400"><AlertTriangle className="size-4.5" aria-hidden="true" /></span><div><CardTitle className="text-base">Attention Required</CardTitle><p className="mt-1 text-xs text-muted-foreground">Open Actions ranked by urgency.</p></div></div>
        <Button type="button" variant="ghost" size="sm" onClick={onViewActions}>View All <ArrowRight className="size-4" /></Button>
      </CardHeader>
      <CardContent className="p-0">
        {metrics.attention.length ? <div className="overflow-x-auto"><table className="w-full min-w-[800px] border-collapse text-left text-sm"><thead className="bg-muted/55 text-[11px] uppercase tracking-wide text-muted-foreground"><tr>{["Item","Reference","Zone","Due Date","Priority","Status","Action"].map((heading)=><th key={heading} className="px-4 py-2.5 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y">{metrics.attention.map((action)=><tr key={action.id} className="group hover:bg-muted/25"><td className="max-w-80 px-4 py-3 font-semibold"><button type="button" className="line-clamp-1 text-left outline-none group-hover:text-primary group-hover:underline focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>onOpenAction(action)}>{action.title}</button></td><td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{action.id}</td><td className="whitespace-nowrap px-4 py-3">{action.area}</td><td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(action.dueDate)}</td><td className="px-4 py-3"><Badge variant={action.priority === "Critical" || action.priority === "High" ? "danger" : action.priority === "Medium" ? "warning" : "muted"}>{action.priority}</Badge></td><td className="whitespace-nowrap px-4 py-3"><StatusBadge action={action}/></td><td className="px-4 py-3 text-right"><Button type="button" size="icon-sm" variant="ghost" aria-label={`Open Action ${action.id}`} onClick={()=>onOpenAction(action)}><ArrowRight className="size-4" /></Button></td></tr>)}</tbody></table></div> : <div className="flex min-h-28 items-center justify-center gap-3 px-5 py-6 text-center"><span className="grid size-9 place-items-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-5" /></span><div className="text-left"><p className="text-sm font-semibold">You&apos;re all caught up</p><p className="mt-0.5 text-xs text-muted-foreground">No urgent Actions require your attention.</p></div></div>}
      </CardContent>
    </Card>
  </section>;
}

function SummaryMetric({ value, label, tone }: { value: number; label: string; tone: string }) { return <div className="bg-card px-5 py-5"><p className={`text-2xl font-bold leading-none ${tone}`}>{value}</p><p className="mt-2 text-[13px] font-medium text-muted-foreground">{label}</p></div>; }
function PerformanceRow({ label, value, tone = "text-foreground" }: { label: string; value: number; tone?: string }) { return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">{label}</dt><dd className={`font-semibold tabular-nums ${tone}`}>{value}</dd></div>; }
function StatusBadge({ action }: { action: MyAction }) { const variant = action.status === "Completed" ? "success" : action.status === "Overdue" || action.status === "Rework Required" ? "danger" : action.status === "Awaiting Assignment" ? "muted" : "info"; return <Badge variant={variant}>{getActionStatusLabel(action.status)}</Badge>; }
