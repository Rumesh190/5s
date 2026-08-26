"use client";

import FiveSPageHeader from "./components/FiveSPageHeader";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

import { useMemo, useState } from "react";

import FiveSAuditCreate from "./components/FiveSAuditCreate";
import FiveSAuditExecution from "./components/FiveSAuditExecution";

import {
  createFiveSAudit,
  updateFiveSAudit,
  useFiveSAuditStore,
} from "@/lib/five-s/audit-store";
import { useActionStore } from "@/lib/actions/action-store";
import {
  AuditScoreTrend,
} from "./components/FiveSDashboardCharts";

import type {
  FiveSAudit,
  FiveSCategory,
  FiveSQuestion,
  FiveSSection,
} from "./types/five-s";

import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Sparkles,
} from "lucide-react";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";
import { canAuditZone } from "@/lib/five-s/configuration";
import type { MyAction, MyActionEvidence, MyActionStatus } from "./types/my-actions";

type DashboardPeriod = "week" | "month" | "quarter" | "year" | "custom";

const PERIOD_OPTIONS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom" },
];

function parseDate(value?: string) {
  if (!value) return null;
  return new Date(value.includes("T") ? value : `${value}T00:00:00`);
}

function isWithinRange(value: string | undefined, start: string, end: string) {
  if (!value) return false;
  const date = value.slice(0, 10);
  return (!start || date >= start) && (!end || date <= end);
}

function getPeriodKey(value: string, period: DashboardPeriod) {
  const date = parseDate(value)!;
  const year = date.getFullYear();

  if (period === "year") return { key: `${year}`, label: `${year}` };
  if (period === "quarter") {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return { key: `${year}-Q${quarter}`, label: `Q${quarter} ${year}` };
  }
  if (period === "month" || period === "custom") {
    return {
      key: `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  }

  const monday = new Date(date);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  return {
    key: monday.toISOString().slice(0, 10),
    label: monday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function getPeriodStart(period: DashboardPeriod) {
  const date = new Date();
  if (period === "week") date.setDate(date.getDate() - 41);
  if (period === "month") date.setMonth(date.getMonth() - 3, 1);
  if (period === "quarter") date.setMonth(date.getMonth() - 9, 1);
  if (period === "year") date.setFullYear(date.getFullYear() - 3, 0, 1);
  if (period === "custom") return "";
  return date.toISOString().slice(0, 10);
}

/* =========================================================
   5S CHECKLIST
   ========================================================= */

const FIVE_S_QUESTIONS: Record<FiveSCategory, string[]> = {
  Sort: [
    "Are unnecessary tools, materials, and items removed from the work area?",
    "Are obsolete or unused items clearly identified and segregated?",
    "Are only required materials stored at the workstation?",
    "Are damaged, defective, or redundant items identified and removed?",
    "Are excess raw materials and work-in-progress controlled to required quantities?",
    "Are red-tagged or unwanted items reviewed and disposed of within the defined timeframe?",
    "Is there a clear process for deciding whether an item is required or unnecessary?",
  ],

  "Set in Order": [
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

  Shine: [
    "Is the work area clean and free from visible dirt and waste?",
    "Are machines and equipment maintained in a clean condition?",
    "Are abnormal conditions identified during cleaning activities?",
    "Are floors, work surfaces, and surrounding areas cleaned regularly?",
    "Are oil, coolant, grease, dust, and other contamination controlled?",
    "Are cleaning tools and materials themselves clean, organized, and properly stored?",
    "Are leaks, damage, loose parts, or other abnormalities reported and addressed?",
    "Are cleaning and inspection activities performed according to the defined schedule?",
  ],

  Standardize: [
    "Are standard 5S procedures available and followed?",
    "Are visual standards available for the work area?",
    "Are cleaning and inspection responsibilities clearly defined?",
    "Are standard locations, markings, labels, and color codes consistently maintained?",
    "Are 5S standards displayed or easily accessible to employees?",
    "Are standard cleaning, inspection, and workplace organization schedules followed?",
    "Are deviations from the defined 5S standards identified and corrected?",
  ],

  Sustain: [
    "Are 5S practices consistently followed by employees?",
    "Are regular 5S audits conducted according to the defined schedule?",
    "Are previous audit findings reviewed and closed within the required timeframe?",
    "Are employees aware of their 5S responsibilities?",
    "Are recurring 5S problems identified and addressed?",
    "Are 5S improvements communicated to the relevant employees?",
    "Is management or area ownership involved in maintaining 5S standards?",
    "Is continuous improvement encouraged based on 5S audit findings?",
  ],
};

/* =========================================================
   CATEGORY DESCRIPTIONS
   ========================================================= */

const FIVE_S_DESCRIPTIONS: Record<FiveSCategory, string> = {
  Sort:
    "Remove unnecessary items from the workplace and keep only what is required.",

  "Set in Order":
    "Arrange required items so they are easy to identify, access, and return.",

  Shine:
    "Keep the workplace, equipment, and surrounding areas clean and maintained.",

  Standardize:
    "Establish consistent standards for workplace organization and cleanliness.",

  Sustain:
    "Maintain 5S practices through discipline, monitoring, and continuous improvement.",
};

/* =========================================================
   CREATE EMPTY SECTIONS
   ========================================================= */

function createEmptyFiveSSections(): FiveSSection[] {
  const categories: FiveSCategory[] = [
    "Sort",
    "Set in Order",
    "Shine",
    "Standardize",
    "Sustain",
  ];

  const createdAt = Date.now();

  return categories.map((category, sectionIndex) => {
    const questions: FiveSQuestion[] =
      FIVE_S_QUESTIONS[category].map(
        (questionText, questionIndex) => ({
          id: `Q-${createdAt}-${sectionIndex}-${questionIndex + 1}`,

          category,

          question: questionText,

          description:
            "Assess the workplace against the defined 5S requirement.",

          maxScore: 2,

          score: null,

          status: "Not Started",

          observation: "",

          evidence: [],

          actionRequired: false,
        })
      );

    return {
      category,

      description: FIVE_S_DESCRIPTIONS[category],

      questions,

      score: 0,

      maxScore: questions.reduce(
        (total, question) => total + question.maxScore,
        0
      ),
    };
  });
}

/* =========================================================
   PAGE
   ========================================================= */

export default function FiveSDashboardPage() {
  const audits = useFiveSAuditStore();
  const actions = useActionStore();

  const [selectedAudit, setSelectedAudit] =
    useState<FiveSAudit | null>(null);

  const [isCreatingAudit, setIsCreatingAudit] =
    useState(false);

  const router = useRouter();
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All");
  const [preview, setPreview] = useState<MyActionEvidence | null>(null);

  /* =======================================================
     DASHBOARD METRICS
     ======================================================= */

  const metrics = useMemo(() => {
    const rangeStart = period === "custom" ? startDate : getPeriodStart(period);
    const rangeEnd = period === "custom" ? endDate : "";
    const filteredAudits = audits.filter((audit) => isWithinRange(audit.startedAt ?? audit.completedAt ?? audit.dueDate, rangeStart, rangeEnd) && (zoneFilter === "All" || audit.area === zoneFilter));
    const filteredActions = actions.filter((action) => isWithinRange(action.createdAt, rangeStart, rangeEnd) && (zoneFilter === "All" || action.area === zoneFilter));

    const totalScore = filteredAudits.reduce((sum, audit) => sum + audit.score, 0);
    const totalMaxScore = filteredAudits.reduce((sum, audit) => sum + audit.maxScore, 0);
    const averageScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    const zoneScores = new Map<string, { score: number; maxScore: number }>();
    filteredAudits.forEach((audit) => {
      const current = zoneScores.get(audit.area) ?? { score: 0, maxScore: 0 };
      current.score += audit.score;
      current.maxScore += audit.maxScore;
      zoneScores.set(audit.area, current);
    });
    const zonePerformance = Array.from(zoneScores, ([zone, value]) => ({
      zone,
      score: value.maxScore > 0 ? Math.round((value.score / value.maxScore) * 100) : 0,
      leader: FIVE_S_ZONE_CONFIGURATION.find((item) => item.name === zone)?.leader ?? "—",
    })).sort((a, b) => b.score - a.score);

    const auditPeriods = new Map<string, { label: string; score: number; maxScore: number }>();
    filteredAudits.forEach((audit) => {
      const date = audit.startedAt ?? audit.completedAt ?? audit.dueDate;
      const bucket = getPeriodKey(date, period);
      const current = auditPeriods.get(bucket.key) ?? { label: bucket.label, score: 0, maxScore: 0 };
      current.score += audit.score;
      current.maxScore += audit.maxScore;
      auditPeriods.set(bucket.key, current);
    });
    const auditTrend = Array.from(auditPeriods.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => ({ label: value.label, value: value.maxScore > 0 ? Math.round((value.score / value.maxScore) * 100) : 0, audits: 1 }));

    const completedActions = filteredActions.filter((action) => action.status === "Completed").length;
    const openActions = filteredActions.length - completedActions;
    const overdueActions = filteredActions.filter((action) => action.status === "Overdue" || (action.status !== "Completed" && action.dueDate < new Date().toISOString().slice(0, 10))).length;
    const closureRate = filteredActions.length ? Math.round((completedActions / filteredActions.length) * 100) : 0;
    const trendChange = auditTrend.length > 1 ? auditTrend.at(-1)!.value - auditTrend.at(-2)!.value : 0;
    const statusCounts = filteredActions.reduce<Record<string, number>>((counts, action) => {
      counts[action.status] = (counts[action.status] ?? 0) + 1;
      return counts;
    }, {});
    const closureDays = filteredActions.flatMap((action) => action.completedAt ? [Math.max(0, (new Date(action.completedAt).getTime() - new Date(action.createdAt).getTime()) / 86_400_000)] : []);
    const averageClosureDays = closureDays.length ? closureDays.reduce((sum, days) => sum + days, 0) / closureDays.length : 0;
    const attentionRank = (action: MyAction) => {
      const overdue = action.status === "Overdue" || (action.status !== "Completed" && action.dueDate < new Date().toISOString().slice(0, 10));
      return (overdue ? 100 : 0) + (action.priority === "Critical" ? 40 : action.priority === "High" ? 30 : 0) + (action.status === "Rework Required" ? 20 : action.status === "Pending Review" || action.status === "Awaiting Review" ? 10 : 0);
    };

    return {
      averageScore,
      topZone: zonePerformance[0],
      totalActions: filteredActions.length,
      openActions,
      completedActions,
      overdueActions,
      closureRate,
      zonePerformance,
      auditTrend,
      trendChange,
      statusCounts,
      averageClosureDays,
      attention: filteredActions.filter((action) => action.status !== "Completed").sort((a,b) => attentionRank(b) - attentionRank(a) || a.dueDate.localeCompare(b.dueDate)).slice(0, 5),
      improvements: filteredActions.filter((action) => action.status === "Completed").sort((a,b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? "")).slice(0, 3),
    };
  }, [actions, audits, endDate, period, startDate, zoneFilter]);

  /* =======================================================
     START AUDIT
     ======================================================= */

  function handleStartAudit() {
    setSelectedAudit(null);
    setIsCreatingAudit(true);
  }

  /* =======================================================
     CREATE AUDIT
     ======================================================= */

  function handleCreateAudit(input: {
    title: string;
    plant: string;
    department: string;
    area: string;
    auditor: string;
    dueDate: string;
  }) {
    const auditorZone = FIVE_S_ZONE_CONFIGURATION.find((zone) => zone.leader === input.auditor)?.name ?? "";
    if (!canAuditZone({ primaryZone: auditorZone }, input.area)) return;
    const sections = createEmptyFiveSSections();

    const audit = createFiveSAudit({
      title: input.title,

      plant: input.plant,

      department: input.department,

      area: input.area,

      auditor: input.auditor,

      dueDate: input.dueDate,

      sections,
    });

    setIsCreatingAudit(false);

    setSelectedAudit(audit);
  }

  /* =======================================================
     UPDATE AUDIT
     ======================================================= */

  function handleAuditUpdate(
    updatedAudit: FiveSAudit
  ) {
    updateFiveSAudit(
      updatedAudit.id,
      updatedAudit
    );

    setSelectedAudit(updatedAudit);
  }

  /* =======================================================
     COMPLETE AUDIT
     ======================================================= */

  function handleCompleteAudit(
    completedAudit: FiveSAudit
  ) {
    updateFiveSAudit(
      completedAudit.id,
      completedAudit
    );

    setSelectedAudit(null);

    setIsCreatingAudit(false);
  }

  /* =======================================================
     BACK
     ======================================================= */

  function handleBack() {
    setSelectedAudit(null);

    setIsCreatingAudit(false);
  }

  /* =======================================================
     CREATE SCREEN
     ======================================================= */

  if (isCreatingAudit) {
    return (
      <FiveSAuditCreate
        onBack={handleBack}
        onStart={handleCreateAudit}
      />
    );
  }

  /* =======================================================
     AUDIT EXECUTION
     ======================================================= */

  if (selectedAudit) {
    return (
      <div className="grid gap-6">
        <FiveSAuditExecution
          audit={selectedAudit}
          onBack={handleBack}
          onComplete={handleCompleteAudit}
        />
      </div>
    );
  }

  /* =======================================================
     DASHBOARD
     ======================================================= */

  return (
    <PageContainer className="max-w-none">
      <FiveSPageHeader
        eyebrow="5S Workspace"
        title="Dashboard"
        description="Monitor workplace 5S performance, corrective issues, and completed improvements."
        actions={
          <Button type="button" onClick={handleStartAudit}>
            <Plus className="size-4" />
            Start 5S Audit
          </Button>
        }
        toolbar={
          <>
            <div className="flex w-full gap-1 overflow-x-auto rounded-lg border border-border/80 bg-muted/35 p-1 sm:w-auto" role="group" aria-label="Dashboard time grouping">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={period === option.value ? "default" : "ghost"}
                  onClick={() => setPeriod(option.value)}
                  aria-pressed={period === option.value}
                  className="shrink-0"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="grid w-full gap-2 sm:ml-auto sm:w-auto sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex h-9 items-center rounded-md border bg-muted/25 px-3 text-xs font-medium">Egmore Plant</div>
              <DashboardFilter value={zoneFilter} onChange={setZoneFilter} label="All Zones" options={FIVE_S_ZONE_CONFIGURATION.map((zone) => zone.name)} />
              {period === "custom" && <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <input type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
              </label>}
              {period === "custom" && <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
              </label>}
            </div>
          </>
        }
      />

      <section className="grid min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)]">
        <div className="flex min-w-0 flex-col justify-between gap-6 border-b p-4 sm:p-5 xl:min-h-64 xl:border-b-0 xl:border-r xl:p-6">
          <div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">Overall 5S Health</p><div className="mt-5 flex flex-wrap items-center gap-7"><HealthGauge score={metrics.averageScore} /><div><p className={`text-5xl font-bold tracking-tight ${metrics.averageScore < 60 ? "text-red-600 dark:text-red-400" : metrics.averageScore < 80 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>{metrics.averageScore}%</p><p className="mt-1 text-lg font-semibold">{healthLabel(metrics.averageScore)}</p><p className="mt-2 text-sm text-muted-foreground">{metrics.trendChange >= 0 ? "↑" : "↓"} {Math.abs(metrics.trendChange)}% versus previous period</p></div></div></div>
          <p className="rounded-lg border bg-muted/25 px-3 py-2 text-sm text-muted-foreground">{metrics.overdueActions ? `${metrics.overdueActions} corrective action${metrics.overdueActions === 1 ? " is" : "s are"} overdue and require attention.` : "No overdue corrective actions in this period."}</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y">
          <ExecutiveMetric label="Open non-compliances" value={metrics.openActions} detail={`${metrics.overdueActions} overdue`} icon={AlertTriangle} tone="danger" />
          <ExecutiveMetric label="Closed actions" value={metrics.completedActions} detail={`${metrics.closureRate}% closure rate`} icon={CheckCircle2} tone="success" />
          <ExecutiveMetric label="Overdue actions" value={metrics.overdueActions} detail="Require attention" icon={Clock3} tone="warning" />
          <ExecutiveMetric label="Improvements" value={metrics.completedActions} detail="Verified corrective actions" icon={Sparkles} tone="info" />
        </div>
      </section>

      <div className="grid min-w-0 items-stretch gap-5 lg:grid-cols-2 2xl:grid-cols-[1.25fr_.9fr_.85fr]">
        <AuditScoreTrend data={metrics.auditTrend} change={metrics.trendChange} />
        <ZoneRanking data={metrics.zonePerformance} />
        <ActionHealth total={metrics.totalActions} counts={metrics.statusCounts} closureRate={metrics.closureRate} averageDays={metrics.averageClosureDays} />
      </div>

      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-2">
        <Card className="overflow-hidden"><CardHeader className="border-b"><div className="flex w-full items-start justify-between gap-4"><div><CardTitle className="text-base">Attention Required</CardTitle><p className="mt-1 text-xs text-muted-foreground">Priority corrective work needing management focus.</p></div><Button variant="ghost" size="sm" className="shrink-0" onClick={()=>router.push("/5s/actions")}>View All <ArrowRight className="size-4" /></Button></div></CardHeader><CardContent className="p-0">{metrics.attention.length ? metrics.attention.map((action)=><button key={action.id} onClick={()=>router.push(`/5s/actions/${action.id}`)} className="flex w-full items-center gap-3 border-b px-5 py-3 text-left transition-colors last:border-0 hover:bg-muted/35"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><PriorityBadge priority={action.priority} /><p className="truncate text-sm font-semibold">{action.title}</p></div><p className="mt-1 text-xs text-muted-foreground">{action.area} · {action.responsiblePersonName ?? action.assignedTo} · Due {formatDashboardDate(action.dueDate)}</p></div><ActionStatusBadge status={action.status} /></button>) : <p className="py-14 text-center text-sm text-muted-foreground">No corrective actions currently require attention.</p>}</CardContent></Card>
        {metrics.improvements[0] ? <ImprovementSpotlight action={metrics.improvements[0]} onPreview={setPreview} onOpen={()=>router.push(`/5s/actions/${metrics.improvements[0].id}/report`)} /> : <Card className="grid min-h-64 place-items-center border-dashed"><div className="text-center"><Sparkles className="mx-auto size-6 text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">No completed improvements for this period.</p></div></Card>}
      </div>

      {metrics.improvements.length > 1 && <section><div className="mb-3 flex items-end justify-between"><div><h2 className="text-base font-semibold">Recent Improvements</h2><p className="mt-1 text-sm text-muted-foreground">Verified workplace changes from completed actions.</p></div><Button variant="ghost" size="sm" onClick={()=>router.push("/5s/actions")}>View All Improvements <ArrowRight className="size-4" /></Button></div><div className="grid gap-4 xl:grid-cols-2">{metrics.improvements.slice(1).map((action)=><ImprovementCard key={action.id} action={action} onOpen={()=>router.push(`/5s/actions/${action.id}/report`)} />)}</div></section>}

      <Dialog open={Boolean(preview)} onOpenChange={(open)=>!open&&setPreview(null)}><DialogContent className="max-w-5xl"><DialogHeader><DialogTitle>{preview?.name}</DialogTitle></DialogHeader>{preview?.type === "image" && preview.url ? <img src={preview.url} alt={preview.name} className="max-h-[75vh] w-full object-contain" /> : <div className="grid min-h-52 place-items-center text-muted-foreground"><ImageIcon className="size-9" /></div>}</DialogContent></Dialog>
    </PageContainer>
  );
}

function DashboardFilter({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: string[] }) { return <Select value={value} onValueChange={(next)=>onChange(next ?? "All")}><SelectTrigger className="h-9 min-w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">{label}</SelectItem>{options.map((option)=><SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>; }

function healthLabel(score: number) { return score >= 80 ? "Healthy" : score >= 60 ? "Moderate" : "Needs Attention"; }

function HealthGauge({ score }: { score: number }) { const color = score < 60 ? "#dc2626" : score < 80 ? "#d97706" : "#16a34a"; return <div className="relative size-32 shrink-0 rounded-full" style={{ background: `conic-gradient(${color} ${Math.max(0, Math.min(100, score)) * 3.6}deg, var(--muted) 0)` }} aria-label={`Overall 5S health ${score}%`} role="img"><div className="absolute inset-[13px] grid place-items-center rounded-full bg-card"><span className="text-2xl font-bold">{score}%</span></div></div>; }

function ExecutiveMetric({ label, value, detail, icon: Icon, tone }: { label: string; value: number; detail: string; icon: typeof AlertTriangle; tone: "danger" | "warning" | "success" | "info" }) { const tones = { danger: "bg-red-500/10 text-red-600 dark:text-red-400", warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400", success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", info: "bg-primary/10 text-primary" }; return <div className="flex min-h-32 flex-col justify-between gap-3 p-5"><div className={`grid size-8 place-items-center rounded-lg ${tones[tone]}`}><Icon className="size-4" /></div><div><p className="text-2xl font-bold tracking-tight">{value}</p><p className="text-sm font-semibold">{label}</p><p className="mt-0.5 text-xs text-muted-foreground">{detail}</p></div></div>; }

function ZoneRanking({ data }: { data: Array<{ zone: string; score: number; leader: string }> }) { return <Card className="min-w-0 overflow-hidden"><CardHeader className="border-b"><CardTitle className="text-base">Zone Performance</CardTitle><p className="mt-1 text-xs text-muted-foreground">Ranked average audit score by zone.</p></CardHeader><CardContent className="space-y-4 p-5">{data.length ? data.map((zone,index)=><div key={zone.zone} className="grid grid-cols-[24px_1fr_auto] items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-muted text-[11px] font-bold">{index+1}</span><div className="min-w-0"><div className="flex justify-between gap-2 text-sm"><span className="font-semibold">{zone.zone}</span><span className="font-bold">{zone.score}%</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:`${zone.score}%`}} /></div><p className="mt-1 text-[11px] text-muted-foreground">{zone.leader}</p></div><span className="text-xs text-muted-foreground">{index === 0 ? "Top" : ""}</span></div>) : <p className="py-16 text-center text-sm text-muted-foreground">No zone scores available.</p>}</CardContent></Card>; }

function ActionHealth({ total, counts, closureRate, averageDays }: { total: number; counts: Record<string, number>; closureRate: number; averageDays: number }) { const rows = ["Assigned","In Progress","Pending Review","Rework Required","Overdue","Completed"]; return <Card className="min-w-0 overflow-hidden"><CardHeader className="border-b"><div className="flex items-start justify-between"><div><CardTitle className="text-base">Action Health</CardTitle><p className="mt-1 text-xs text-muted-foreground">Corrective-action workflow status.</p></div><div className="text-right"><p className="text-2xl font-bold">{total}</p><p className="text-[10px] uppercase text-muted-foreground">Total</p></div></div></CardHeader><CardContent className="p-5"><div className="space-y-2.5">{rows.map((status)=><div key={status} className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{status}</span><span className="font-semibold">{counts[status] ?? 0}</span></div>)}</div><div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4"><div><p className="text-lg font-bold">{closureRate}%</p><p className="text-[10px] text-muted-foreground">Closure rate</p></div><div><p className="text-lg font-bold">{averageDays ? `${averageDays.toFixed(1)}d` : "—"}</p><p className="text-[10px] text-muted-foreground">Avg. closure</p></div></div></CardContent></Card>; }

function PriorityBadge({ priority }: { priority: MyAction["priority"] }) { return <Badge variant={priority === "Critical" || priority === "High" ? "danger" : priority === "Medium" ? "warning" : "info"}>{priority}</Badge>; }

function ImprovementSpotlight({ action, onPreview, onOpen }: { action: MyAction; onPreview: (evidence: MyActionEvidence) => void; onOpen: () => void }) { const before = action.issueEvidence?.find((evidence)=>evidence.type === "image" && evidence.url); const after = action.evidence.find((evidence)=>evidence.type === "image" && evidence.url); return <Card className="min-w-0 overflow-hidden"><CardHeader className="border-b"><div className="flex min-w-0 flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="text-[11px] font-bold uppercase tracking-[.12em] text-primary">Improvement Spotlight</p><CardTitle className="mt-2 line-clamp-2 text-base">{action.title}</CardTitle><p className="mt-1 truncate text-xs text-muted-foreground">{action.area} · {action.category ?? "5S"}</p></div><Badge variant="success">Completed</Badge></div></CardHeader><CardContent className="p-4 sm:p-5"><div className="grid gap-3 sm:grid-cols-[1fr_28px_1fr] sm:items-center"><button onClick={()=>before&&onPreview(before)} disabled={!before} className="min-w-0 text-left"><ComparisonImage label="Before" evidence={before} /></button><ArrowRight className="mx-auto hidden size-4 text-primary sm:block" /><button onClick={()=>after&&onPreview(after)} disabled={!after} className="min-w-0 text-left"><ComparisonImage label="After" evidence={after} /></button></div><div className="mt-4 flex min-w-0 flex-wrap items-end justify-between gap-3 border-t pt-4"><div className="min-w-0 text-xs text-muted-foreground"><p className="truncate">Completed by <b className="text-foreground">{action.completedByName ?? action.responsiblePersonName ?? action.assignedTo}</b></p><p className="mt-1 truncate">Reviewed by <b className="text-foreground">{action.reviewedBy ?? action.auditor ?? "—"}</b></p></div><div className="text-right"><p className="break-all text-xl font-bold text-emerald-700 dark:text-emerald-400">₹{(action.costSaving ?? 0).toLocaleString("en-IN")}</p><p className="text-[10px] text-muted-foreground">{action.costSaving ? "Cost saving" : "Recorded"}</p></div></div><Button variant="ghost" size="sm" className="mt-3 w-full" onClick={onOpen}>View Improvement Report <ArrowRight className="size-4" /></Button></CardContent></Card>; }

function formatDashboardDate(value?: string) { if (!value) return "—"; const date = new Date(value.includes("T") ? value : `${value}T00:00:00`); return new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric"}).format(date); }

function ActionStatusBadge({ status }: { status: MyActionStatus }) { const variant = status === "Completed" ? "success" : status === "Overdue" || status === "Rework Required" ? "danger" : status === "In Progress" || status === "Pending Review" ? "warning" : "info"; return <Badge variant={variant}>{status}</Badge>; }

function ImprovementCard({ action, onOpen }: { action: MyAction; onOpen: () => void }) { const before = action.issueEvidence?.find((evidence)=>evidence.type === "image" && evidence.url); const after = action.evidence.find((evidence)=>evidence.type === "image" && evidence.url); return <Card className="overflow-hidden transition hover:border-primary/30 hover:shadow-md"><button className="block w-full text-left" onClick={onOpen}><div className="flex items-start justify-between gap-3 border-b px-4 py-3"><div><p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{action.area} · {action.category ?? "5S"}</p><h3 className="mt-1 font-semibold">{action.title}</h3></div><Badge variant="success">Completed</Badge></div><div className="grid grid-cols-[1fr_28px_1fr] items-center gap-2 p-4"><ComparisonImage label="Before" evidence={before} /><ArrowRight className="mx-auto size-4 text-primary" /><ComparisonImage label="After" evidence={after} /></div><div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/15 px-4 py-3 text-xs"><span><b>{action.completedByName ?? action.responsiblePersonName ?? action.assignedTo}</b> · Responsible</span><span className="font-semibold text-emerald-700 dark:text-emerald-400">₹{(action.costSaving ?? 0).toLocaleString("en-IN")} saved</span></div></button></Card>; }
function ComparisonImage({ label, evidence }: { label: string; evidence?: MyActionEvidence }) { return <div><p className={`mb-1.5 text-[10px] font-bold uppercase tracking-wider ${label === "Before" ? "text-red-600" : "text-green-600"}`}>{label}</p><div className="aspect-[16/10] overflow-hidden rounded-lg border bg-muted">{evidence?.url ? <img src={evidence.url} alt={evidence.name} className="size-full object-cover" /> : <div className="grid size-full place-items-center"><ImageIcon className="size-5 text-muted-foreground" /></div>}</div></div>; }
