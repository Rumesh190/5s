"use client";

import FiveSPageHeader from "./components/FiveSPageHeader";
import ReportHeader, { prepareReportForPrint } from "./components/ReportHeader";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  CorrectiveActionsChart,
  ImprovementsTrend,
  ZonePerformanceChart,
} from "./components/FiveSDashboardCharts";

import type {
  FiveSAudit,
  FiveSCategory,
  FiveSQuestion,
  FiveSSection,
} from "./types/five-s";

import {
  Download,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Printer,
  RotateCcw,
  Search,
} from "lucide-react";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";
import { canAuditZone } from "@/lib/five-s/configuration";
import type { MyAction, MyActionEvidence, MyActionStatus } from "./types/my-actions";
import { getActionStatusLabel } from "@/lib/five-s/lifecycle-status";
import { useI18n } from "@/components/preferences/use-i18n";
import { MVP_DASHBOARD_DATA } from "./data/mvp-dashboard-data";
import { filterActionsByZoneMember, getDashboardZoneMembers, hasBeforeAfterEvidence, searchNCActions, selectActionsByIds } from "@/lib/five-s/dashboard-action-filters";

type DashboardPeriod = "week" | "month" | "year" | "custom";
type DashboardView = "overview" | "nc-summary" | "before-after";

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
  const { t } = useI18n();

  const [selectedAudit, setSelectedAudit] =
    useState<FiveSAudit | null>(null);

  const [isCreatingAudit, setIsCreatingAudit] =
    useState(false);

  const router = useRouter();
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All");
  const [zoneMemberFilter, setZoneMemberFilter] = useState("All");
  const [preview, setPreview] = useState<MyActionEvidence | null>(null);
  const [dashboardView, setDashboardView] = useState<DashboardView>("overview");
  const [selectedImprovementId, setSelectedImprovementId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const zoneMemberOptions = useMemo(() => {
    return getDashboardZoneMembers(actions, zoneFilter);
  }, [actions, zoneFilter]);

  const effectiveZoneMemberFilter = zoneMemberFilter === "All" || zoneMemberOptions.some((member) => member.id === zoneMemberFilter)
    ? zoneMemberFilter
    : "All";

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
      return (overdue ? 100 : 0) + (action.priority === "Critical" ? 40 : action.priority === "High" ? 30 : 0) + (action.status === "Rework Required" ? 20 : action.status === "Awaiting Review" ? 10 : 0);
    };

    const actionsByZone = new Map<string, { Open: number; Closed: number }>();
    filteredActions.forEach((action) => {
      const current = actionsByZone.get(action.area) ?? { Open: 0, Closed: 0 };
      if (action.status === "Completed") current.Closed += 1;
      else current.Open += 1;
      actionsByZone.set(action.area, current);
    });
    const nonComplianceByZone = Array.from(actionsByZone, ([zone, counts]) => ({ zone, ...counts }))
      .sort((a, b) => a.zone.localeCompare(b.zone));

    const improvementPeriods = new Map<string, { label: string; value: number }>();
    filteredActions.filter((action) => action.status === "Completed").forEach((action) => {
      const date = action.completedAt ?? action.createdAt;
      const bucket = getPeriodKey(date, period);
      const current = improvementPeriods.get(bucket.key) ?? { label: bucket.label, value: 0 };
      current.value += 1;
      improvementPeriods.set(bucket.key, current);
    });
    const improvementTrend = Array.from(improvementPeriods.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);

    const useMvpDemo = period === "month" && !startDate && !endDate && zoneFilter === "All";
    const demo = MVP_DASHBOARD_DATA;

    return {
      usingSampleData: useMvpDemo,
      totalAudits: useMvpDemo ? demo.summary.totalAudits : filteredAudits.length,
      completedAudits: useMvpDemo ? demo.summary.completedAudits : filteredAudits.filter((item) => item.status === "Completed").length,
      draftAudits: useMvpDemo ? demo.summary.draftAudits : filteredAudits.filter((item) => item.status === "Draft").length,
      inProgressAudits: useMvpDemo ? demo.summary.inProgressAudits : filteredAudits.filter((item) => item.status === "In Progress").length,
      nonCompliances: useMvpDemo ? demo.summary.nonCompliances : filteredActions.length,
      averageScore: useMvpDemo ? demo.summary.averageScore : averageScore,
      topZone: useMvpDemo ? demo.zonePerformance[0] : zonePerformance[0],
      totalActions: filteredActions.length,
      openActions: useMvpDemo ? demo.summary.openActions : openActions,
      completedActions: useMvpDemo ? demo.summary.completedActions : completedActions,
      overdueActions: useMvpDemo ? demo.summary.overdueActions : overdueActions,
      closureRate,
      zonePerformance: useMvpDemo ? [...demo.zonePerformance] : zonePerformance,
      auditTrend: useMvpDemo ? [...demo.auditTrend] : auditTrend,
      trendChange,
      statusCounts,
      averageClosureDays,
      nonComplianceByZone: useMvpDemo ? [...demo.nonComplianceByZone] : nonComplianceByZone,
      improvementTrend: useMvpDemo ? [...demo.improvementTrend] : improvementTrend,
      filteredActions,
      attention: filteredActions.filter((action) => action.status !== "Completed").sort((a,b) => attentionRank(b) - attentionRank(a) || a.dueDate.localeCompare(b.dueDate)).slice(0, 5),
      improvements: filteredActions.filter((action) => action.status === "Completed").sort((a,b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? "")).slice(0, 3),
    };
  }, [actions, audits, endDate, period, startDate, zoneFilter]);

  const memberScopedActions = useMemo(
    () => filterActionsByZoneMember(metrics.filteredActions, effectiveZoneMemberFilter, zoneMemberOptions),
    [effectiveZoneMemberFilter, metrics.filteredActions, zoneMemberOptions]
  );
  const beforeAfterActions = useMemo(() => memberScopedActions.filter(hasBeforeAfterEvidence), [memberScopedActions]);

  const selectedImprovement =
    beforeAfterActions.find((action) => action.id === selectedImprovementId) ??
    beforeAfterActions.find((action) => action.status === "Completed") ??
    beforeAfterActions[0];

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

  /* =======================================================
     COMPLETE AUDIT
     ======================================================= */

  function handleCompleteAudit(
    completedAudit: FiveSAudit
  ) {
    const updated = updateFiveSAudit(
      completedAudit.id,
      completedAudit
    );

    if (updated) {
      setSuccessMessage("Audit completed successfully.");
      window.setTimeout(() => setSuccessMessage(""), 3000);
    }

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
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <Button type="button" onClick={handleStartAudit}>
            <Plus className="size-4" />
            {t("audit.start")}
          </Button>
        }
      />

      {successMessage && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400">{successMessage}</div>}

      <div className="grid min-w-0 gap-2 lg:grid-cols-[auto_minmax(0,1fr)]">
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl border border-border/80 bg-card p-1 shadow-sm" aria-label="Dashboard views">
          <span className="hidden px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground xl:inline">View</span>
          {([
            ["overview", t("dashboard.overview")],
            ["nc-summary", t("dashboard.ncSummary")],
            ["before-after", t("dashboard.beforeAfter")],
          ] as const).map(([value, label]) => (
            <Button key={value} type="button" size="sm" variant={dashboardView === value ? "default" : "ghost"} onClick={() => setDashboardView(value)} className="shrink-0">
              {label}
            </Button>
          ))}
        </nav>
        <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-border/80 bg-card p-1 shadow-sm lg:flex-row lg:items-center lg:justify-end lg:gap-1" role="group" aria-label="Dashboard filters">
          <span className="hidden px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground xl:inline">Filters</span>
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center lg:gap-1">
            <DashboardFilter value={zoneFilter} onChange={(value) => { setZoneFilter(value); setZoneMemberFilter("All"); }} label="All zones" options={FIVE_S_ZONE_CONFIGURATION.map((zone)=>zone.name)} />
            {dashboardView !== "overview" && <Select value={effectiveZoneMemberFilter} onValueChange={(value) => setZoneMemberFilter(value ?? "All")}>
              <SelectTrigger className="h-11 w-full min-w-0 md:h-9 lg:min-w-44" aria-label="Zone Member"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="All">All Zone Members</SelectItem>{zoneMemberOptions.map((member) => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent>
            </Select>}
          </div>
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0" aria-label="Dashboard time range">
            {(["week", "month", "year", "custom"] as const).map((value) => (
              <Button key={value} type="button" size="sm" variant={period === value ? "secondary" : "ghost"} onClick={() => setPeriod(value)} aria-pressed={period === value} className="min-h-11 shrink-0 capitalize md:min-h-8">
                {value === "week" ? t("common.weekly") : value === "month" ? t("common.monthly") : value === "year" ? t("common.yearly") : t("common.custom")}
              </Button>
            ))}
          </div>
          {period === "custom" && <div className="grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-1 lg:flex lg:pl-1">
            <Input aria-label="Dashboard start date" type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} className="h-11 min-w-0 px-2 text-xs md:h-9" />
            <span className="text-xs text-muted-foreground">to</span>
            <Input aria-label="Dashboard end date" type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className="h-11 min-w-0 px-2 text-xs md:h-9" />
          </div>}
        </div>
      </div>

      {dashboardView === "overview" && <section className="grid min-w-0 gap-5">
        <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Audit Summary</h2>{metrics.usingSampleData && <Badge variant="secondary">Showing sample data</Badge>}</div>
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <DashboardKpi value={metrics.totalAudits} label="Total audits" tone="info" />
          <DashboardKpi value={metrics.completedAudits} label="Completed audits" tone="success" />
          <DashboardKpi value={metrics.draftAudits} label="Draft audits" tone="warning" />
          <DashboardKpi value={metrics.inProgressAudits} label="In progress" tone="info" />
          <DashboardKpi value={`${metrics.averageScore}%`} label={t("dashboard.auditScore")} tone={metrics.averageScore < 60 ? "danger" : metrics.averageScore < 80 ? "warning" : "success"} />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Action Summary</h2>
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
          <DashboardKpi value={metrics.openActions} label="Open actions" tone="warning" />
          <DashboardKpi value={metrics.overdueActions} label="Overdue actions" tone="danger" />
          <DashboardKpi value={metrics.completedActions} label="Closed actions" tone="success" />
          <DashboardKpi value={metrics.nonCompliances} label="Non-compliances" tone="danger" />
        </div>

        <Card className="gap-0 overflow-hidden"><CardHeader className="border-b bg-muted/15"><CardTitle className="text-base">{t("dashboard.attentionRequired")}</CardTitle><p className="text-sm text-muted-foreground">Open corrective actions ranked by urgency.</p></CardHeader><CardContent className="p-0">{metrics.attention.length ? <div className="divide-y">{metrics.attention.map((action) => <button key={action.id} type="button" onClick={() => router.push(`/5s/actions/${encodeURIComponent(action.id)}`)} className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{action.title}</span><span className="mt-1 block text-xs text-muted-foreground">{action.id} · {action.area} · Due {formatDashboardDate(action.dueDate)}</span></span><span className="flex shrink-0 items-center gap-2"><Badge variant={action.priority === "Critical" || action.priority === "High" ? "danger" : "warning"}>{action.priority}</Badge><ActionStatusBadge status={action.status} /></span></button>)}</div> : <p className="p-6 text-sm text-muted-foreground">No open corrective actions require attention.</p>}</CardContent></Card>

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <AuditScoreTrend data={metrics.auditTrend} change={metrics.trendChange} />
          <ZonePerformanceChart data={metrics.zonePerformance} selectedZone={zoneFilter} onSelectZone={setZoneFilter} />
          <CorrectiveActionsChart data={metrics.nonComplianceByZone} />
          <ImprovementsTrend data={metrics.improvementTrend} />
        </div>
      </section>}

      {dashboardView === "nc-summary" && (
        <NCSummaryTable
          key={zoneFilter}
          actions={memberScopedActions}
          dashboardZone={zoneFilter}
          memberFiltered={effectiveZoneMemberFilter !== "All"}
          onClearMember={() => setZoneMemberFilter("All")}
          onPreview={setPreview}
          onOpen={(action) => {
            setSelectedImprovementId(action.id);
            setDashboardView("before-after");
          }}
          onViewAction={(action) => router.push(`/5s/actions/${encodeURIComponent(action.id)}`)}
          onReport={(action) => router.push(`/5s/actions/${encodeURIComponent(action.id)}/report`)}
        />
      )}

      {dashboardView === "before-after" && (
        <BeforeAfterView
          action={selectedImprovement}
          actions={beforeAfterActions}
          memberFiltered={effectiveZoneMemberFilter !== "All"}
          onClearMember={() => setZoneMemberFilter("All")}
          onSelect={setSelectedImprovementId}
          onPreview={setPreview}
          onReport={(action) => router.push(`/5s/actions/${encodeURIComponent(action.id)}/report`)}
        />
      )}

      <Dialog open={Boolean(preview)} onOpenChange={(open)=>!open&&setPreview(null)}><DialogContent className="!w-[calc(100vw-24px)] !max-w-5xl [&_[data-slot=dialog-close]]:size-11 md:[&_[data-slot=dialog-close]]:size-8"><DialogHeader><DialogTitle>{preview?.evidenceType === "resolution" ? "After Photo" : "Before Photo"}</DialogTitle><DialogDescription>{preview ? `${preview.name} · Uploaded by ${preview.uploadedBy} · ${formatDashboardDate(preview.uploadedAt)}` : "Evidence preview"}</DialogDescription></DialogHeader>{preview?.type === "image" && preview.url ? <img src={preview.url} alt={preview.name} className="max-h-[75vh] w-full object-contain" /> : <div className="grid min-h-52 place-items-center text-muted-foreground"><ImageIcon className="size-9" /></div>}</DialogContent></Dialog>
    </PageContainer>
  );
}

function NCSummaryTable({ actions, dashboardZone, memberFiltered, onClearMember, onPreview, onOpen, onViewAction, onReport }: { actions: MyAction[]; dashboardZone:string; memberFiltered: boolean; onClearMember: () => void; onPreview: (evidence: MyActionEvidence) => void; onOpen: (action: MyAction) => void; onViewAction: (action: MyAction) => void; onReport: (action: MyAction) => void }) {
  const zones = useMemo(() => FIVE_S_ZONE_CONFIGURATION.map((zone)=>zone.name), []);
  const [selectedZones,setSelectedZones]=useState<string[]>(()=>dashboardZone==="All"?zones:[dashboardZone]);
  const [fromDate,setFromDate]=useState(""); const [toDate,setToDate]=useState("");
  const [exportOpen,setExportOpen]=useState(false);
  const allZonesSelected=selectedZones.length===zones.length;
  const hasActiveFilters=!allZonesSelected||Boolean(fromDate)||Boolean(toDate);
  const zoneLabel=allZonesSelected?"All zones":selectedZones.length===0?"No zones selected":selectedZones.length<=2?selectedZones.join(" + "):`${selectedZones.length} zones`;
  const filteredActions=actions.filter((action)=>selectedZones.includes(action.area)&&(!fromDate||action.createdAt.slice(0,10)>=fromDate)&&(!toDate||action.createdAt.slice(0,10)<=toDate));
  function toggleZone(zone:string,checked:boolean){setSelectedZones(current=>checked?[...new Set([...current,zone])]:current.filter(item=>item!==zone));}
  function openExport(){if(filteredActions.length)setExportOpen(true);}
  function clearFilters(){setSelectedZones([...zones]);setFromDate("");setToDate("");if(memberFiltered)onClearMember();}
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="grid-cols-1 gap-x-6 gap-y-3 border-b bg-muted/15 pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:pb-6">
        <div className="min-w-0"><CardTitle className="text-base">Non-Compliance Summary</CardTitle><p className="mt-1 text-sm leading-5 text-muted-foreground">Review findings, ownership, progress, evidence, and closure details in one place.</p></div>
        <CardAction className="col-start-1 row-start-2 w-full justify-self-stretch sm:col-start-2 sm:row-span-1 sm:row-start-1 sm:w-auto sm:justify-self-end">
          <div className="grid w-full grid-cols-2 gap-2 md:hidden">
            <details className="group relative col-span-1">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-md border bg-background px-3 text-sm font-medium shadow-sm marker:content-none">More Filters <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span></summary>
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 grid w-[min(20rem,calc(100vw-3rem))] gap-2 rounded-lg border bg-popover p-3 shadow-lg">
                <DropdownMenu><DropdownMenuTrigger render={<Button type="button" variant="outline" className="min-h-11 w-full justify-between bg-background shadow-none"/>}>{zoneLabel}<span className="text-muted-foreground">▾</span></DropdownMenuTrigger><DropdownMenuContent align="start" className="w-52"><DropdownMenuCheckboxItem checked={allZonesSelected} onCheckedChange={(checked)=>setSelectedZones(checked?[...zones]:[])}>All zones</DropdownMenuCheckboxItem>{zones.map(zone=><DropdownMenuCheckboxItem key={zone} checked={selectedZones.includes(zone)} onCheckedChange={(checked)=>toggleZone(zone,checked)}>{zone}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>
                <div className="grid grid-cols-2 gap-2"><Input aria-label="Non-Compliance summary from date" type="date" value={fromDate} max={toDate||undefined} onChange={(event)=>setFromDate(event.target.value)} className="h-11 min-w-0 px-2 text-xs"/><Input aria-label="Non-Compliance summary to date" type="date" value={toDate} min={fromDate||undefined} onChange={(event)=>setToDate(event.target.value)} className="h-11 min-w-0 px-2 text-xs"/></div>
                <Button type="button" variant="ghost" className="min-h-11" disabled={!hasActiveFilters&&!memberFiltered} onClick={clearFilters}><RotateCcw className="size-4"/>Clear Filters</Button>
              </div>
            </details>
            <Button type="button" variant="outline" className="min-h-11 w-full bg-background shadow-none" disabled={!filteredActions.length} onClick={openExport}><Download className="size-4"/>Export</Button>
          </div>
          <div className="hidden w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap md:items-center md:justify-end">
            <DropdownMenu><DropdownMenuTrigger render={<Button type="button" size="sm" variant="outline" className="col-span-2 min-w-40 justify-between bg-background shadow-none sm:col-span-1"/>}>{zoneLabel}<span className="text-muted-foreground">▾</span></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52"><DropdownMenuCheckboxItem checked={allZonesSelected} onCheckedChange={(checked)=>setSelectedZones(checked?[...zones]:[])}>All zones</DropdownMenuCheckboxItem>{zones.map(zone=><DropdownMenuCheckboxItem key={zone} checked={selectedZones.includes(zone)} onCheckedChange={(checked)=>toggleZone(zone,checked)}>{zone}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>
            <Input aria-label="Non-Compliance summary from date" type="date" value={fromDate} max={toDate||undefined} onChange={(event)=>setFromDate(event.target.value)} className="h-9 min-w-0 px-2 text-xs"/>
            <Input aria-label="Non-Compliance summary to date" type="date" value={toDate} min={fromDate||undefined} onChange={(event)=>setToDate(event.target.value)} className="h-9 min-w-0 px-2 text-xs"/>
            <Button type="button" size="sm" variant="ghost" className="col-span-2 min-h-11 sm:col-span-1 md:min-h-8" disabled={!hasActiveFilters&&!memberFiltered} onClick={clearFilters}><RotateCcw className="size-4"/>Clear Filters</Button>
            <Button type="button" size="sm" variant="outline" className="col-span-2 w-full bg-background shadow-none sm:col-span-1 sm:w-auto" disabled={!filteredActions.length} onClick={openExport}><Download className="size-4" /> Export</Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-3 md:hidden">
          {filteredActions.length ? filteredActions.map((action) => {
            const before=action.issueEvidence?.find((item)=>item.type==="image"&&item.url);
            const after=action.evidence.find((item)=>item.type==="image"&&item.url);
            return <article key={action.id} className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-mono text-sm font-semibold text-primary">{action.id}</p><p className="mt-1 truncate text-xs text-muted-foreground">{action.category??"5S"} · {action.area}</p></div><ActionStatusBadge status={action.status}/></div>
              <p className="mt-3 line-clamp-3 text-sm font-medium leading-5">{action.originalFinding??action.description}</p>
              <div className="mt-3 flex items-center justify-between gap-3 border-y py-2.5 text-xs"><span className="min-w-0 truncate font-medium">{action.responsiblePersonName??action.assignedTo??"Unassigned"}</span><span className="shrink-0 text-muted-foreground">{action.priority} · {formatDashboardDate(action.dueDate)}</span></div>
              <div className="mt-3 grid grid-cols-2 gap-2"><MobileEvidencePreview label="Before" evidence={before} emptyLabel="No Before Evidence" onPreview={onPreview}/><MobileEvidencePreview label="After" evidence={after} emptyLabel="Awaiting After Evidence" onPreview={onPreview}/></div>
              <div className="mt-3 grid grid-cols-2 gap-2"><Button type="button" variant="outline" className="min-h-11" onClick={()=>onViewAction(action)}>View Action</Button>{action.status==="Completed"?<Button type="button" className="min-h-11" onClick={()=>onReport(action)}>View Report</Button>:<Button type="button" variant="outline" className="min-h-11" onClick={()=>onOpen(action)}>View Evidence</Button>}</div>
            </article>;
          }):<div className="grid min-h-48 place-items-center rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground"><div><p>{memberFiltered?"No corrective actions found for this Zone Member.":"No non-compliances match the selected filters."}</p>{(hasActiveFilters||memberFiltered)&&<Button type="button" variant="outline" className="mt-4 min-h-11" onClick={clearFilters}>Clear Filters</Button>}</div></div>}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1180px] border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10 bg-muted/95 text-xs uppercase tracking-wide text-muted-foreground backdrop-blur">
              <tr>{["Zone", "Observed", "Problem description", "Before", "Responsible", "Status", "Due date", "Action taken", "After", "Closed", "Report"].map((heading) => <th key={heading} className="whitespace-nowrap border-b px-3 py-3 font-semibold">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {filteredActions.length ? filteredActions.map((action) => {
                const before = action.issueEvidence?.find((item) => item.type === "image" && item.url);
                const after = action.evidence.find((item) => item.type === "image" && item.url);
                return <tr key={action.id} className="bg-card align-top transition-colors hover:bg-muted/20">
                  <td className="whitespace-nowrap px-3 py-3 font-semibold">{action.area}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatDashboardDate(action.createdAt)}</td>
                  <td className="max-w-52 px-3 py-3"><button type="button" onClick={() => onOpen(action)} className="line-clamp-3 text-left font-medium hover:text-primary hover:underline">{action.originalFinding ?? action.description}</button></td>
                  <td className="px-3 py-3"><EvidenceThumbnail evidence={before} onPreview={onPreview} /></td>
                  <td className="max-w-36 px-3 py-3">{action.responsiblePersonName ?? action.assignedTo}</td>
                  <td className="whitespace-nowrap px-3 py-3"><ActionStatusBadge status={action.status} /></td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatDashboardDate(action.dueDate)}</td>
                  <td className="max-w-52 px-3 py-3 text-muted-foreground"><span className="line-clamp-3">{action.actionTakenDescription ?? action.resolutionObservation ?? "—"}</span></td>
                  <td className="px-3 py-3"><EvidenceThumbnail evidence={after} onPreview={onPreview} /></td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatDashboardDate(action.completedAt)}</td>
                  <td className="px-3 py-3"><Button type="button" size="sm" variant="ghost" onClick={() => action.status === "Completed" ? onReport(action) : onOpen(action)}>{action.status === "Completed" ? "Report" : "View"}<ExternalLink className="size-3.5" /></Button></td>
                </tr>;
              }) : <tr><td colSpan={11} className="px-6 py-16 text-center text-sm text-muted-foreground"><p>{memberFiltered ? "No corrective actions found for this Zone Member." : "No non-compliances match the selected filters."}</p>{(hasActiveFilters||memberFiltered)&&<Button type="button" size="sm" variant="ghost" className="mt-3" onClick={clearFilters}>Clear Filters</Button>}</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
      {exportOpen&&<ExportNCSummaryDialog open actions={filteredActions} onOpenChange={setExportOpen} />}
    </Card>
  );
}

function ExportNCSummaryDialog({ open, actions, onOpenChange }: { open: boolean; actions: MyAction[]; onOpenChange: (open: boolean) => void }) {
  const [query,setQuery]=useState("");
  const [selectedIds,setSelectedIds]=useState<string[]>(()=>actions.map((action)=>action.id));
  const availableIds=actions.map((action)=>action.id);
  const selectedCount=selectedIds.filter((id)=>availableIds.includes(id)).length;
  const allSelected=actions.length>0&&selectedCount===actions.length;
  const searchedActions=searchNCActions(actions,query);
  function handleOpenChange(next:boolean){
    onOpenChange(next);
  }
  function toggleAction(id:string,checked:boolean){setSelectedIds(current=>checked?[...new Set([...current,id])]:current.filter(item=>item!==id));}
  function exportSelected(){
    const selected=selectActionsByIds(actions,selectedIds);
    if(!selected.length)return;
    exportNonComplianceCsv(selected);
    onOpenChange(false);
  }
  return <Dialog open={open} onOpenChange={handleOpenChange}>
    <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-0 sm:!max-w-4xl">
      <DialogHeader className="shrink-0 border-b px-5 py-4 sm:px-6"><DialogTitle>Export Non-Compliance Summary</DialogTitle><DialogDescription>Choose the Non-Compliance records you want to export.</DialogDescription></DialogHeader>
      <div className="grid min-h-0 gap-3 px-5 py-4 sm:px-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(event)=>setQuery(event.target.value)} className="pl-9" placeholder="Search NC ID, Zone, Member..." aria-label="Search export records"/></div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/15 px-3 py-2.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium"><Checkbox checked={allSelected} onCheckedChange={(checked)=>setSelectedIds(checked?[...availableIds]:[])}/>Select All</label>
          <div className="flex items-center gap-3"><span className="text-xs font-medium text-muted-foreground">{selectedCount} of {actions.length} selected</span><Button type="button" size="sm" variant="ghost" disabled={!selectedCount} onClick={()=>setSelectedIds([])}>Clear All</Button></div>
        </div>
        <div className="min-h-0 overflow-auto rounded-lg border">
          <div className="divide-y md:hidden">{searchedActions.map((action)=><label key={action.id} htmlFor={`export-${action.id}`} className="flex min-h-20 cursor-pointer items-start gap-3 p-3 active:bg-muted/30"><Checkbox id={`export-${action.id}`} className="mt-1 size-5" checked={selectedIds.includes(action.id)} onCheckedChange={(checked)=>toggleAction(action.id,Boolean(checked))} aria-label={`Select ${action.id}`}/><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><span className="truncate font-mono text-sm font-semibold text-primary">{action.id}</span><ActionStatusBadge status={action.status}/></span><span className="mt-1 block truncate text-xs text-muted-foreground">{action.category??"—"} · {action.area}</span><span className="mt-1 flex items-center justify-between gap-2 text-xs"><span className="min-w-0 truncate">{action.responsiblePersonName??action.assignedTo??"Unassigned"}</span><span className="shrink-0 font-medium">{action.priority}</span></span></span></label>)}</div>
          <table className="hidden w-full min-w-[700px] border-collapse text-left text-xs md:table">
            <thead className="sticky top-0 z-10 bg-muted/90 uppercase tracking-wide text-muted-foreground backdrop-blur"><tr>{["", "NC / Action ID", "5S Category", "Zone", "Responsible Zone Member", "Priority", "Status"].map((heading,index)=><th key={`${heading}-${index}`} className="whitespace-nowrap border-b px-3 py-2.5 font-semibold">{heading}</th>)}</tr></thead>
            <tbody className="divide-y">{searchedActions.map((action)=><tr key={action.id} className="hover:bg-muted/20"><td className="px-3 py-3"><Checkbox checked={selectedIds.includes(action.id)} onCheckedChange={(checked)=>toggleAction(action.id,Boolean(checked))} aria-label={`Select ${action.id}`}/></td><td className="whitespace-nowrap px-3 py-3 font-mono font-semibold text-primary">{action.id}</td><td className="whitespace-nowrap px-3 py-3">{action.category??"—"}</td><td className="whitespace-nowrap px-3 py-3">{action.area}</td><td className="whitespace-nowrap px-3 py-3">{action.responsiblePersonName??action.assignedTo??"—"}</td><td className="whitespace-nowrap px-3 py-3">{action.priority}</td><td className="whitespace-nowrap px-3 py-3"><ActionStatusBadge status={action.status}/></td></tr>)}</tbody>
          </table>
          {!searchedActions.length&&<div className="grid min-h-32 place-items-center p-6 text-center text-sm text-muted-foreground"><div><p>No NC records match this search.</p>{query&&<Button type="button" variant="outline" className="mt-3 min-h-11 md:min-h-9" onClick={()=>setQuery("")}>Clear Search</Button>}</div></div>}
        </div>
      </div>
      <DialogFooter className="shrink-0 border-t px-5 py-3 sm:px-6"><span className="mb-1 text-center text-xs font-medium text-muted-foreground sm:mb-0 sm:mr-auto sm:self-center">{selectedCount} selected</span><Button type="button" variant="outline" className="min-h-11 md:min-h-9" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="button" className="min-h-11 md:min-h-9" disabled={!selectedCount} onClick={exportSelected}><Download className="size-4"/>Export Selected ({selectedCount})</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function EvidenceThumbnail({ evidence, onPreview }: { evidence?: MyActionEvidence; onPreview: (evidence: MyActionEvidence) => void }) {
  if (!evidence?.url) return <span className="grid size-14 place-items-center rounded-lg border bg-muted/30 text-muted-foreground"><ImageIcon className="size-4" /></span>;
  return <button type="button" onClick={() => onPreview(evidence)} className="block size-14 overflow-hidden rounded-lg border transition hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Preview ${evidence.name}`}><img src={evidence.url} alt={evidence.name} className="size-full object-cover" /></button>;
}

function MobileEvidencePreview({label,evidence,emptyLabel,onPreview}:{label:string;evidence?:MyActionEvidence;emptyLabel:string;onPreview:(evidence:MyActionEvidence)=>void}){
  return <div className="min-w-0"><p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>{evidence?.url?<button type="button" className="block aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>onPreview(evidence)} aria-label={`Preview ${label} evidence`}><img src={evidence.url} alt={evidence.name} className="size-full object-cover"/></button>:<div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed bg-muted/20 px-2 text-center text-xs text-muted-foreground">{emptyLabel}</div>}</div>;
}

function BeforeAfterView({ action, actions, memberFiltered, onClearMember, onSelect, onPreview, onReport }: { action?: MyAction; actions: MyAction[]; memberFiltered: boolean; onClearMember: () => void; onSelect: (id: string) => void; onPreview: (evidence: MyActionEvidence) => void; onReport: (action: MyAction) => void }) {
  if (!action) return <Card><CardContent className="grid min-h-72 place-items-center text-center text-sm text-muted-foreground"><div><p>{memberFiltered ? "No Before / After evidence available for this Zone Member." : "No Before / After evidence is available for this view."}</p>{memberFiltered && <Button type="button" size="sm" variant="ghost" className="mt-3" onClick={onClearMember}>View all members</Button>}</div></CardContent></Card>;
  const before = action.issueEvidence?.find((item) => item.type === "image" && item.url);
  const after = action.evidence.find((item) => item.type === "image" && item.url);
  const handlePrint = async () => {
    const previousTitle = document.title;
    document.title = `5S-Before-After-Report-${new Date().toISOString().slice(0, 10)}`;
    window.addEventListener("afterprint", () => { document.title = previousTitle; }, { once: true });
    await prepareReportForPrint(".before-after-print-report");
    window.print();
  };
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="grid-cols-1 gap-x-6 gap-y-3 border-b bg-muted/15 pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:pb-6">
        <div className="min-w-0"><CardTitle className="text-base">Before &amp; After</CardTitle><p className="mt-1 text-sm leading-5 text-muted-foreground">Visual evidence and closure outcome for the selected non-compliance.</p></div>
        <CardAction className="col-start-1 row-start-2 w-full justify-self-stretch sm:col-start-2 sm:row-span-1 sm:row-start-1 sm:w-auto sm:justify-self-end">
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
            <DashboardFilter value={action.id} onChange={onSelect} label="Select finding" options={actions.map((item) => item.id)} />
            <Button type="button" size="sm" variant="outline" className="bg-background shadow-none" onClick={handlePrint}><Printer className="size-4" /> Print / Save PDF</Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <DetailCell label="Zone" value={action.area} /><DetailCell label="Observed date" value={formatDashboardDate(action.createdAt)} /><DetailCell label="Responsible person" value={action.responsiblePersonName ?? action.assignedTo} /><DetailCell label="Status" value={action.status} />
          <div className="bg-card p-4 sm:col-span-2"><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Problem description</p><p className="mt-1.5 text-sm font-medium">{action.originalFinding ?? action.description}</p></div>
          <div className="bg-card p-4 sm:col-span-2"><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Action taken</p><p className="mt-1.5 text-sm font-medium">{action.actionTakenDescription ?? action.resolutionObservation ?? "Not recorded"}</p></div>
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <BeforeAfterPanel label="Before photo" evidence={before} tone="before" onPreview={onPreview} />
          <BeforeAfterPanel label="After photo" evidence={after} tone="after" onPreview={onPreview} />
        </div>
        {action.status === "Completed" && <div className="flex justify-end"><Button type="button" variant="outline" onClick={() => onReport(action)}>Open improvement report<ExternalLink className="size-4" /></Button></div>}
      </CardContent>
      <BeforeAfterPrintReport actions={actions} />
    </Card>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) { return <div className="bg-card p-4"><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1.5 text-sm font-semibold">{value}</p></div>; }

function BeforeAfterPanel({ label, evidence, tone, onPreview }: { label: string; evidence?: MyActionEvidence; tone: "before" | "after"; onPreview: (evidence: MyActionEvidence) => void }) {
  return <section className="min-w-0 overflow-hidden rounded-xl border bg-muted/15"><div className={`border-b px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider ${tone === "before" ? "bg-red-500/10 text-red-700 dark:text-red-400" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>{label}</div>{evidence?.url ? <button type="button" onClick={() => onPreview(evidence)} className="block aspect-[16/10] w-full overflow-hidden bg-muted"><img src={evidence.url} alt={evidence.name} className="size-full object-contain" /></button> : <div className="grid aspect-[16/10] place-items-center text-sm text-muted-foreground"><div className="text-center"><ImageIcon className="mx-auto mb-2 size-7" />No image attached</div></div>}</section>;
}

function DashboardKpi({ value, label, detail, tone = "neutral" }: { value: string | number; label: string; detail?: string; tone?: "neutral" | "danger" | "warning" | "success" | "info" }) {
  const tones = {
    neutral: "text-foreground",
    danger: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    success: "text-emerald-600 dark:text-emerald-400",
    info: "text-primary",
  };
  return <Card className="min-w-0 gap-0"><CardContent className="flex min-h-28 flex-col items-center justify-center p-4 text-center xl:min-h-0 xl:flex-1"><p className={`max-w-full break-words text-2xl font-bold tracking-tight ${tones[tone]}`}>{value}</p><p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>{detail && <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>}</CardContent></Card>;
}

function DashboardFilter({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: string[] }) { return <Select value={value} onValueChange={(next)=>onChange(next ?? "All")}><SelectTrigger className="h-11 w-full min-w-0 md:h-9 lg:min-w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">{label}</SelectItem>{options.map((option)=><SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>; }

function formatDashboardDate(value?: string) { if (!value) return "—"; const date = new Date(value.includes("T") ? value : `${value}T00:00:00`); return new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric"}).format(date); }

function csvCell(value: unknown) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }
function exportNonComplianceCsv(actions: MyAction[]) {
  const headings = ["NC / Action ID", "Audit ID", "Audit Date", "5S Category", "Finding / Observation", "Zone", "Priority", "Responsible Zone Member", "Proposed Action", "Final Action Plan", "Status", "Due Date", "Zone Leader", "Reviewed By", "Review Date", "Closed By", "Closure Date"];
  const rows = actions.map((action) => [
    action.id,
    action.auditId ?? action.sourceTitle,
    action.createdAt,
    action.category,
    action.originalFinding ?? action.description,
    action.area,
    action.priority,
    action.responsiblePersonName ?? action.assignedTo,
    action.proposedAction ?? action.description,
    action.actionPlan ?? action.proposedAction ?? action.description,
    getActionStatusLabel(action.status),
    action.dueDate,
    action.zoneLeaderName,
    action.reviewedByRole === "Zone Leader" ? action.reviewedBy : action.closedBy ?? action.zoneLeaderName,
    action.reviewedAt,
    action.closedBy ?? action.zoneLeaderName,
    action.closedAt ?? action.completedAt,
  ]);
  const csv = [headings, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = `5S-Non-Compliance-Summary-${new Date().toISOString().slice(0, 10)}.csv`; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function BeforeAfterPrintReport({ actions }: { actions: MyAction[] }) {
  return <section className="before-after-print-report hidden bg-white text-slate-950 print:block"><ReportHeader title="5S Before & After Report" metadata={<>Generated {formatDashboardDate(new Date().toISOString())}</>} className="px-0 pt-0" /><div className="mt-6 space-y-6">{actions.map((item) => { const before=item.issueEvidence?.find((e)=>e.type==="image"&&e.url); const after=item.evidence.find((e)=>e.type==="image"&&e.url); return <article key={item.id} className="before-after-print-pair break-inside-avoid rounded-lg border border-slate-300 p-4"><div className="flex justify-between gap-4"><div><p className="text-xs font-semibold text-blue-700">{item.auditId ?? item.sourceTitle} · {item.area} · {item.category}</p><h2 className="mt-1 text-lg font-bold">{item.title}</h2><p className="mt-1 text-sm text-slate-600">{item.originalFinding ?? item.description}</p></div><span className="text-sm font-semibold">{item.status}</span></div><div className="mt-4 grid grid-cols-2 gap-4">{[["Before",before],["After",after]].map(([label,evidence])=><div key={String(label)}><p className="mb-2 text-xs font-bold uppercase">{String(label)}</p>{typeof evidence === "object" && evidence?.url ? <img src={evidence.url} alt={evidence.name} className="aspect-[16/10] w-full rounded border object-contain" /> : <div className="grid aspect-[16/10] place-items-center rounded border bg-slate-50 text-sm text-slate-400">No image attached</div>}</div>)}</div><dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4"><div><dt className="text-slate-500">Responsible</dt><dd className="font-semibold">{item.responsiblePersonName ?? item.assignedTo ?? "—"}</dd></div><div><dt className="text-slate-500">Completed</dt><dd className="font-semibold">{formatDashboardDate(item.closedAt ?? item.completedAt)}</dd></div><div><dt className="text-slate-500">Zone Leader / reviewer</dt><dd className="font-semibold">{item.reviewedByRole === "Zone Leader" ? item.reviewedBy ?? item.zoneLeaderName ?? "—" : item.closedBy ?? item.zoneLeaderName ?? "—"}</dd></div><div><dt className="text-slate-500">Due date</dt><dd className="font-semibold">{formatDashboardDate(item.dueDate)}</dd></div></dl></article>; })}</div></section>;
}

function ActionStatusBadge({ status }: { status: MyActionStatus }) { const variant = status === "Completed" ? "success" : status === "Overdue" || status === "Rework Required" ? "danger" : status === "Awaiting Assignment" ? "muted" : "info"; return <Badge variant={variant}>{getActionStatusLabel(status)}</Badge>; }
