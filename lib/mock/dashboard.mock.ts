import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardList,
  FilePlus2,
  FileSearch,
  ListChecks,
  TrendingUp,
} from "lucide-react"

import type { DashboardData } from "@/types/dashboard"

/**
 * Static mock data for the Dashboard module. No backend exists yet — values
 * mirror the examples in docs/01_Features/12_Reports_Dashboard.md so the
 * numbers are realistic and internally consistent. Swap for a real
 * `dashboard-service.ts` once the API contract in
 * docs/02_Engineering/21_API_Contracts.md is implemented.
 */
export const DASHBOARD_MOCK: DashboardData = {
  kpis: [
    {
      id: "open-audits",
      title: "Open Audits",
      value: "24",
      trend: "+4 from last week",
      direction: "up",
      accent: "blue",
      icon: ClipboardList,
    },
    {
      id: "completed-audits",
      title: "Completed Audits",
      value: "182",
      trend: "+18 this month",
      direction: "up",
      accent: "green",
      icon: CheckCircle2,
    },
    {
      id: "overdue-audits",
      title: "Overdue Audits",
      value: "8",
      trend: "-2 from last week",
      direction: "down",
      accent: "red",
      icon: AlertTriangle,
    },
    {
      id: "avg-investigation-time",
      title: "Average Investigation Time",
      value: "2.8 Days",
      trend: "Improved by 0.4 days",
      direction: "up",
      accent: "amber",
      icon: Clock,
    },
    {
      id: "critical-issues",
      title: "Critical Issues",
      value: "5",
      trend: "No change",
      direction: "flat",
      accent: "red",
      icon: AlertOctagon,
    },
    {
      id: "closure-rate",
      title: "Audit Closure Rate",
      value: "94%",
      trend: "+3% vs last month",
      direction: "up",
      accent: "green",
      icon: TrendingUp,
    },
  ],

  auditTrend: [
    { month: "Jan", created: 28, closed: 22 },
    { month: "Feb", created: 32, closed: 27 },
    { month: "Mar", created: 30, closed: 29 },
    { month: "Apr", created: 35, closed: 31 },
    { month: "May", created: 38, closed: 34 },
    { month: "Jun", created: 34, closed: 36 },
    { month: "Jul", created: 41, closed: 37 },
    { month: "Aug", created: 24, closed: 33 },
  ],

  rootCauseDistribution: [
    { cause: "Improper Training", count: 32 },
    { cause: "Machine Failure", count: 27 },
    { cause: "Material Defect", count: 24 },
    { cause: "Human Error", count: 21 },
    { cause: "Incorrect Process", count: 16 },
    { cause: "Calibration Issue", count: 12 },
    { cause: "Poor Maintenance", count: 9 },
    { cause: "Supplier Issue", count: 6 },
  ],

  plantPerformance: [
    { id: "chennai", name: "Chennai Plant", completionRate: 98, openAudits: 4, overdueAudits: 0, status: "on-track" },
    { id: "hosur", name: "Hosur Plant", completionRate: 91, openAudits: 6, overdueAudits: 1, status: "on-track" },
    { id: "bengaluru", name: "Bengaluru Plant", completionRate: 84, openAudits: 9, overdueAudits: 2, status: "at-risk" },
    { id: "hyderabad", name: "Hyderabad Plant", completionRate: 76, openAudits: 11, overdueAudits: 4, status: "attention" },
    { id: "coimbatore", name: "Coimbatore Plant", completionRate: 95, openAudits: 3, overdueAudits: 0, status: "on-track" },
    { id: "mysuru", name: "Mysuru Plant", completionRate: 88, openAudits: 7, overdueAudits: 1, status: "on-track" },
    { id: "sriperumbudur", name: "Sriperumbudur Plant", completionRate: 80, openAudits: 8, overdueAudits: 3, status: "at-risk" },
  ],

  recentAudits: [
    { id: "AUD-1042", title: "Weld Seam Inspection — Line 3", department: "Welding", status: "In Progress", updatedAt: "2h ago" },
    { id: "AUD-1041", title: "Calibration Check — Gauge Station 4", department: "Quality", status: "Closed", updatedAt: "5h ago" },
    { id: "AUD-1038", title: "Incoming Material QC — Batch 2291", department: "Warehouse", status: "Pending Review", updatedAt: "1d ago" },
    { id: "AUD-1031", title: "Torque Verification — Assembly Cell 5", department: "Assembly", status: "Open", updatedAt: "1d ago" },
    { id: "AUD-1027", title: "Paint Thickness Audit — Line 1", department: "Paint Shop", status: "In Progress", updatedAt: "2d ago" },
    { id: "AUD-1019", title: "Preventive Maintenance Review", department: "Maintenance", status: "Pending Review", updatedAt: "3d ago" },
  ],

  criticalIssues: [
    { id: "INV-208", severity: "Critical", title: "Dimensional deviation — bracket assembly", owner: "A. Rao", daysOpen: 4 },
    { id: "INV-205", severity: "Major", title: "Coating defect — housing unit", owner: "P. Singh", daysOpen: 7 },
    { id: "INV-201", severity: "Major", title: "Fastener torque non-conformance", owner: "A. Rao", daysOpen: 9 },
    { id: "INV-195", severity: "Minor", title: "Label mismatch — packaging", owner: "M. Alvarez", daysOpen: 15 },
  ],

  quickActions: [
    {
      id: "create-audit",
      label: "Create New Audit",
      description: "Start a new quality investigation",
      href: "/audits/create",
      icon: FilePlus2,
      primary: true,
    },
    {
      id: "view-audits",
      label: "View All Audits",
      description: "Search, filter, and manage audits",
      href: "/audits",
      icon: ClipboardList,
    },
    {
      id: "view-investigations",
      label: "View Investigations",
      description: "Continue 5 Why root-cause analysis",
      href: "/investigations",
      icon: FileSearch,
    },
    {
      id: "view-reports",
      label: "View Reports",
      description: "Plant and department performance",
      href: "/reports",
      icon: ListChecks,
    },
  ],
}
