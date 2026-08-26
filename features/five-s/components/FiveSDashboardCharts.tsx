"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TrendPoint { label: string; value: number; audits?: number }
export interface ZoneScorePoint { zone: string; score: number; leader: string }
export interface ActionStatusPoint { zone: string; Open: number; Closed: number }

const tooltipStyle = { border: "1px solid var(--border)", borderRadius: "10px", background: "var(--popover)", color: "var(--popover-foreground)", boxShadow: "0 8px 24px -16px rgb(15 23 42 / 0.35)", fontSize: "12px" };

function ChartCard({ title, description, insight, children }: { title: string; description: string; insight?: React.ReactNode; children: React.ReactNode }) {
  return <Card className="min-w-0 overflow-hidden"><CardHeader className="border-b border-border/55 pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pt-5"><div className="min-w-0"><CardTitle className="text-base">{title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{description}</p></div>{insight}</CardHeader><CardContent className="h-[250px] min-w-0 px-2 pb-4 pt-5 sm:h-[285px] sm:px-4">{children}</CardContent></Card>;
}

export function AuditScoreTrend({ data, change }: { data: TrendPoint[]; change: number }) {
  return <ChartCard title="Audit Score Trend" description="Average score across completed and active audits." insight={<span className={`rounded-md px-2 py-1 text-xs font-semibold ${change >= 0 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-500/10 text-red-700 dark:text-red-400"}`}>{change >= 0 ? "↑" : "↓"} {Math.abs(change)}%</span>}>
    {data.length > 1 ? <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 8, right: 18, left: -14, bottom: 4 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><YAxis domain={[0,100]} tickFormatter={(v)=>`${v}%`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} formatter={(v)=>[`${v}%`,"Average score"]} /><Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5} dot={{ r:3, fill:"var(--card)", strokeWidth:2 }} activeDot={{r:5}} /></LineChart></ResponsiveContainer> : data.length === 1 ? <div className="grid h-full place-items-center"><div className="text-center"><p className="text-4xl font-bold tracking-tight text-primary">{data[0].value}%</p><p className="mt-2 text-sm font-medium">{data[0].label}</p><p className="mt-1 text-xs text-muted-foreground">More audit periods are needed to establish a trend.</p></div></div> : <Empty text="No audits during this period" />}
  </ChartCard>;
}

export function ZonePerformanceChart({ data }: { data: ZoneScorePoint[] }) {
  return <ChartCard title="Performance by Zone" description="Average audit score with accountable zone leaders.">{data.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top:8,right:26,left:12,bottom:4 }}><CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis type="number" domain={[0,100]} tickFormatter={(v)=>`${v}%`} tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><YAxis type="category" dataKey="zone" width={62} tickLine={false} axisLine={false} tick={{fill:"var(--foreground)",fontSize:12}} /><Tooltip contentStyle={tooltipStyle} formatter={(v)=>[`${v}%`,"Average score"]} labelFormatter={(label,payload)=>`${label}${payload?.[0]?.payload?.leader ? ` · ${payload[0].payload.leader}` : ""}`} /><Bar dataKey="score" fill="var(--primary)" radius={[0,5,5,0]} maxBarSize={25} /></BarChart></ResponsiveContainer> : <Empty text="No zone scores available" />}</ChartCard>;
}

export function CorrectiveActionsChart({ data }: { data: ActionStatusPoint[] }) {
  return <ChartCard title="Non-Compliances by Zone" description="Open corrective workload compared with closed actions.">{data.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{top:8,right:12,left:-20,bottom:4}}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="zone" tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="Open" stackId="status" fill="var(--warning)" /><Bar dataKey="Closed" stackId="status" fill="var(--success)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer> : <Empty text="No non-compliances during this period" />}</ChartCard>;
}

export function ImprovementsTrend({ data }: { data: TrendPoint[] }) {
  return <ChartCard title="Improvements Completed" description="Corrective actions successfully completed over time.">{data.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{top:8,right:18,left:-22,bottom:4}}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><Tooltip contentStyle={tooltipStyle} formatter={(v)=>[v,"Completed improvements"]} /><Bar dataKey="value" fill="var(--primary)" radius={[5,5,0,0]} maxBarSize={34} /></BarChart></ResponsiveContainer> : <Empty text="No completed improvements during this period" />}</ChartCard>;
}

function Empty({ text }: { text: string }) { return <div className="grid h-full place-items-center"><p className="text-sm text-muted-foreground">{text}</p></div>; }
