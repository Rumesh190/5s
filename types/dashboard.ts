import type { LucideIcon } from "lucide-react"

/** Semantic accent used consistently across KPI cards, status dots, and charts. */
export type DashboardAccent = "blue" | "green" | "red" | "amber"

export interface KpiDatum {
  id: string
  title: string
  value: string
  trend: string
  /** Whether the trend reads as favorable, unfavorable, or neutral — drives the trend arrow/color. */
  direction: "up" | "down" | "flat"
  accent: DashboardAccent
  icon: LucideIcon
}

export interface AuditTrendPoint {
  month: string
  created: number
  closed: number
}

export interface RootCauseDatum {
  cause: string
  count: number
}

export type PlantStatus = "on-track" | "at-risk" | "attention"

export interface PlantPerformance {
  id: string
  name: string
  completionRate: number
  openAudits: number
  overdueAudits: number
  status: PlantStatus
}

export type AuditStatus = "Draft" | "Open" | "In Progress" | "Pending Review" | "Closed"

export interface RecentAudit {
  id: string
  title: string
  department: string
  status: AuditStatus
  updatedAt: string
}

export type IssueSeverity = "Critical" | "Major" | "Minor"

export interface CriticalIssue {
  id: string
  severity: IssueSeverity
  title: string
  owner: string
  daysOpen: number
}

export interface QuickAction {
  id: string
  label: string
  description: string
  href: string
  icon: LucideIcon
  primary?: boolean
}

export interface DashboardData {
  kpis: KpiDatum[]
  auditTrend: AuditTrendPoint[]
  rootCauseDistribution: RootCauseDatum[]
  plantPerformance: PlantPerformance[]
  recentAudits: RecentAudit[]
  criticalIssues: CriticalIssue[]
  quickActions: QuickAction[]
}
