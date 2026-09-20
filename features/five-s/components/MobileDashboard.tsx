"use client";

/**
 * MobileDashboard — purpose-built mobile presentation for the /5s Dashboard.
 *
 * Visible only at < md (768 px). Consumes the SAME canonical metrics,
 * actions, audits, and red-tag data as the desktop Dashboard. No
 * duplicate business state or calculations.
 *
 * Sections (in order):
 *   1. Greeting + Start 5S Audit
 *   2. Quick Actions (2 × 2 grid)
 *   3. Attention Required
 *   4. Audit Performance (compact, with period selector)
 *   5. 5S Performance by Zone (horizontal bars)
 *   6. Explore (NC Summary · Before & After)
 *   7. Recent Activity
 */

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileBarChart,
  Plus,
  Tag,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrentUser } from "@/lib/current-user";
import { useRedTags } from "@/features/five-s/red-tag/store";
import { getActionStatusLabel } from "@/lib/five-s/lifecycle-status";
import type { MyAction } from "@/features/five-s/types/my-actions";
import type { FiveSAudit } from "@/features/five-s/types/five-s";
import { cn } from "@/lib/utils";

/* =========================================================
   TYPES
   ========================================================= */

export type MobileDashboardPeriod = "week" | "month" | "year" | "custom";

/** Subset of the parent dashboard metrics consumed by the mobile view. */
export interface MobileDashboardMetrics {
  usingSampleData: boolean;
  totalAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  draftAudits: number;
  averageScore: number;
  openActions: number;
  overdueActions: number;
  attention: MyAction[];
  zonePerformance: Array<{ zone: string; score: number; leader: string }>;
}

interface MobileDashboardProps {
  /** Applied to the root element so the parent can control breakpoint visibility. */
  className?: string;
  metrics: MobileDashboardMetrics;
  /** All (unfiltered) actions — used for quick-action open count. */
  allActions: MyAction[];
  /** All (unfiltered) audits — used for recent activity. */
  allAudits: FiveSAudit[];
  period: MobileDashboardPeriod;
  onPeriodChange: (period: MobileDashboardPeriod) => void;
  onStartAudit: () => void;
  onViewNCSummary: () => void;
  onViewBeforeAfter: () => void;
  /** Success message forwarded from the parent (e.g. "Audit completed"). */
  successMessage?: string;
}

/* =========================================================
   HELPERS
   ========================================================= */

/** Time-aware greeting. Kept simple; no i18n required per spec. */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Human-relative timestamp for recent activity. */
export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/** Derive a flat list of recent activity from audits + actions (no fabricated data). */
export function deriveRecentActivity(
  audits: FiveSAudit[],
  actions: MyAction[],
  limit = 5
) {
  type Item = { id: string; type: "audit" | "action"; label: string; sublabel: string; date: string; href: string };
  const items: Item[] = [];

  for (const audit of audits) {
    const date = audit.completedAt ?? audit.startedAt;
    if (!date) continue;
    items.push({
      id: audit.id,
      type: "audit",
      label: audit.status === "Completed" ? "Audit completed" : "Audit in progress",
      sublabel: `${audit.area} · ${audit.title}`,
      date,
      href: "/5s/audits",
    });
  }

  for (const action of actions) {
    const date = action.completedAt ?? action.submittedForReviewAt ?? action.createdAt;
    if (!date) continue;
    const label =
      action.status === "Completed"
        ? "Action closed"
        : action.status === "Awaiting Review"
        ? "Action submitted for review"
        : action.status === "Rework Required"
        ? "Action returned for rework"
        : "Action created";
    items.push({
      id: action.id,
      type: "action",
      label,
      sublabel: `${action.area} · ${action.title}`,
      date,
      href: `/5s/actions/${encodeURIComponent(action.id)}`,
    });
  }

  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

/* =========================================================
   MOBILE DASHBOARD
   ========================================================= */

export default function MobileDashboard({
  className,
  metrics,
  allActions,
  allAudits,
  period,
  onPeriodChange,
  onStartAudit,
  onViewNCSummary,
  onViewBeforeAfter,
  successMessage,
}: MobileDashboardProps) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const redTags = useRedTags();

  /* --- Quick-action counts (canonical, live stores) --- */
  const openActionsCount = allActions.filter((a) => a.status !== "Completed").length;
  const openRedTagsCount = redTags.filter((t) => t.status !== "Closed").length;

  /* --- Recent activity derived from real records --- */
  const recentActivity = useMemo(
    () => deriveRecentActivity(allAudits, allActions),
    [allAudits, allActions]
  );

  /* --- Completion percentage for audit donut --- */
  const completionPct =
    metrics.totalAudits > 0
      ? Math.round((metrics.completedAudits / metrics.totalAudits) * 100)
      : 0;

  /* 2πr where r=14 → circumference ≈ 87.96 */
  const CIRC = 87.96;

  return (
    <div className={cn("flex flex-col gap-5", className)}>

      {/* ── Success message ─────────────────────────────────── */}
      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          {successMessage}
        </div>
      )}

      {/* ── 1. Greeting + Start Audit ─────────────────────── */}
      <section
        aria-label="Workspace greeting and primary action"
        className="rounded-2xl border border-border/60 bg-card px-4 py-5 shadow-sm"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          5S Workspace
        </p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-foreground">
          {getGreeting()}, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Keep your workplace safe, clean and organized.
        </p>
        <Button
          type="button"
          onClick={onStartAudit}
          className="mt-4 h-12 w-full text-[15px] font-semibold"
          aria-label="Start a new 5S audit"
        >
          <Plus className="size-5" aria-hidden="true" />
          Start 5S Audit
        </Button>
      </section>

      {/* ── 2. Quick Actions ─────────────────────────────────── */}
      <section aria-label="Quick actions">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <MobileQuickActionCard
            label="My Actions"
            sublabel={openActionsCount > 0 ? `${openActionsCount} open` : "No open actions"}
            icon={<ClipboardCheck className="size-5" aria-hidden="true" />}
            href="/5s/actions"
            urgent={metrics.overdueActions > 0}
          />
          <MobileQuickActionCard
            label="Red Tags"
            sublabel={openRedTagsCount > 0 ? `${openRedTagsCount} open` : "No open tags"}
            icon={<Tag className="size-5" aria-hidden="true" />}
            href="/5s/red"
            urgent={false}
          />
          <MobileQuickActionCard
            label="Audits"
            sublabel="View all audits"
            icon={<FileBarChart className="size-5" aria-hidden="true" />}
            href="/5s/audits"
            urgent={false}
          />
          <MobileQuickActionCard
            label="Reports"
            sublabel="View reports"
            icon={<TrendingUp className="size-5" aria-hidden="true" />}
            href="/5s/reports"
            urgent={false}
          />
        </div>
      </section>

      {/* ── 3. Attention Required ──────────────────────────── */}
      <section aria-label="Attention required">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Attention Required
        </h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
          {metrics.attention.length > 0 ? (
            <ul className="divide-y" role="list">
              {metrics.attention.slice(0, 5).map((action) => {
                const today = new Date().toISOString().slice(0, 10);
                const isOverdue =
                  action.status === "Overdue" ||
                  (action.status !== "Completed" && action.dueDate < today);
                return (
                  <li key={action.id}>
                    <button
                      type="button"
                      className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      onClick={() =>
                        router.push(`/5s/actions/${encodeURIComponent(action.id)}`)
                      }
                      aria-label={`${action.title}, ${getActionStatusLabel(action.status)}, ${action.area}`}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          isOverdue
                            ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                        )}
                        aria-hidden="true"
                      >
                        {isOverdue ? (
                          <AlertTriangle className="size-4" />
                        ) : (
                          <Clock className="size-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {action.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {action.area}
                          {isOverdue && " · Overdue"}
                          {!isOverdue && ` · Due ${action.dueDate}`}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex items-center gap-3 px-4 py-5">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                aria-hidden="true"
              >
                <CheckCircle2 className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  You&apos;re all caught up
                </p>
                <p className="text-xs text-muted-foreground">
                  No urgent items require your attention.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Audit Performance ─────────────────────────────── */}
      <section aria-label="Audit performance">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Audit Performance
          </h2>
          <Select
            value={period}
            onValueChange={(v) =>
              onPeriodChange((v ?? "month") as MobileDashboardPeriod)
            }
          >
            <SelectTrigger
              className="h-8 w-auto min-w-32"
              size="sm"
              aria-label="Select audit performance period"
            >
              <SelectValue>
                {(v: string | null) =>
                  v === "week"
                    ? "This Week"
                    : v === "month"
                    ? "This Month"
                    : v === "year"
                    ? "This Year"
                    : "Custom"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border/60 bg-card px-4 py-5 shadow-sm">
          <div className="flex items-center gap-5">
            {/* Compact donut — SVG, no external dependency */}
            <div className="relative flex size-[88px] shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 36 36"
                className="size-[88px] -rotate-90"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3.5"
                  strokeDasharray={`${(completionPct / 100) * CIRC} ${CIRC}`}
                  strokeLinecap="round"
                />
              </svg>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                aria-label={`Completion rate: ${completionPct}%`}
              >
                <span className="text-[19px] font-bold leading-none text-foreground">
                  {completionPct}%
                </span>
                <span className="mt-0.5 text-[9px] font-medium leading-none text-muted-foreground">
                  Done
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <AuditStatRow label="Total" value={metrics.totalAudits} />
              <AuditStatRow
                label="Completed"
                value={metrics.completedAudits}
                tone="success"
              />
              <AuditStatRow
                label="In Progress"
                value={metrics.inProgressAudits}
                tone="info"
              />
              <AuditStatRow
                label="Avg. Score"
                value={`${metrics.averageScore}%`}
                tone={
                  metrics.averageScore < 60
                    ? "danger"
                    : metrics.averageScore < 80
                    ? "warning"
                    : "success"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. 5S Performance by Zone ─────────────────────── */}
      {metrics.zonePerformance.length > 0 && (
        <section aria-label="5S performance by zone">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            5S Performance by Zone
          </h2>
          <div className="rounded-xl border border-border/60 bg-card px-4 py-4 shadow-sm">
            <ul className="space-y-3" role="list">
              {metrics.zonePerformance.map(({ zone, score }) => (
                <li key={zone} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-xs font-semibold text-foreground">
                    {zone}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div
                      className="flex-1 overflow-hidden rounded-full bg-muted"
                      style={{ height: 6 }}
                      role="progressbar"
                      aria-valuenow={score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${zone}: ${score}%`}
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs font-semibold text-foreground">
                      {score}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 6. Explore ─────────────────────────────────────── */}
      <section aria-label="Explore additional dashboard views">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Explore
        </h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
          <button
            type="button"
            className="flex min-h-14 w-full items-center justify-between border-b px-4 py-3 text-left hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            onClick={onViewNCSummary}
            aria-label="Open Non-Compliance Summary"
          >
            <span className="text-sm font-medium">Non-Compliance Summary</span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex min-h-14 w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            onClick={onViewBeforeAfter}
            aria-label="Open Before and After evidence view"
          >
            <span className="text-sm font-medium">Before &amp; After</span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ── 7. Recent Activity ───────────────────────────────── */}
      {recentActivity.length > 0 && (
        <section aria-label="Recent activity">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Recent Activity
          </h2>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <ul className="divide-y" role="list">
              {recentActivity.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <button
                    type="button"
                    className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    onClick={() => router.push(item.href)}
                    aria-label={`${item.label}: ${item.sublabel}`}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-white",
                        item.type === "audit"
                          ? "bg-primary/80"
                          : "bg-amber-500/80"
                      )}
                      aria-hidden="true"
                    >
                      {item.type === "audit" ? (
                        <FileBarChart className="size-3.5" />
                      ) : (
                        <ClipboardCheck className="size-3.5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {item.sublabel}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatRelativeTime(item.date)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   SUB-COMPONENTS
   ========================================================= */

function MobileQuickActionCard({
  label,
  sublabel,
  icon,
  href,
  urgent,
}: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  href: string;
  urgent: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-[84px] flex-col justify-between rounded-xl border border-border/60 bg-card p-4 shadow-sm",
        "transition hover:border-primary/30 hover:bg-muted/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        urgent && "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/10"
      )}
      aria-label={`${label}: ${sublabel}`}
    >
      <span
        className={cn("text-primary", urgent && "text-amber-600 dark:text-amber-400")}
      >
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{sublabel}</span>
      </span>
    </Link>
  );
}

function AuditStatRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "success" | "warning" | "danger" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "danger"
      ? "text-red-600 dark:text-red-400"
      : tone === "warning"
      ? "text-amber-600 dark:text-amber-400"
      : tone === "info"
      ? "text-primary"
      : "text-foreground";

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-semibold", toneClass)}>{value}</span>
    </div>
  );
}
