"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_CHART_COLORS, CHART_COLORS } from "@/lib/dashboard/chart-palette";

export interface TrendPoint { label: string; value: number; audits?: number }
export interface ZoneScorePoint { zone: string; score: number; leader: string }
export interface ActionStatusPoint { zone: string; Open: number; Closed: number }

const tooltipStyle = { border: "1px solid var(--border)", borderRadius: "10px", background: "var(--popover)", color: "var(--popover-foreground)", boxShadow: "0 8px 24px -16px rgb(15 23 42 / 0.35)", fontSize: "12px" };

function ChartCard({ title, description, insight, children }: { title: string; description: string; insight?: React.ReactNode; children: React.ReactNode }) {
  return <Card className="min-w-0 overflow-hidden"><CardHeader className="border-b border-border/55 pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pt-5"><div className="min-w-0"><CardTitle className="text-base">{title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{description}</p></div>{insight}</CardHeader><CardContent className="h-[250px] min-w-0 px-2 pb-4 pt-5 sm:h-[285px] sm:px-4">{children}</CardContent></Card>;
}

export function AuditScoreTrend({ data, change }: { data: TrendPoint[]; change: number }) {
  return <ChartCard title="Average Audit Score by Period" description="Average audit performance across the selected period." insight={<span className={`rounded-md px-2 py-1 text-xs font-semibold ${change >= 0 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-500/10 text-red-700 dark:text-red-400"}`}>{change >= 0 ? "↑" : "↓"} {Math.abs(change)}%</span>}>
    {data.length > 1 ? <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 8, right: 18, left: -14, bottom: 4 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><YAxis domain={[0,100]} tickFormatter={(v)=>`${v}%`} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} formatter={(v)=>[`${v}%`,"Average score"]} /><Line name="Average score" type="monotone" dataKey="value" stroke={CHART_COLORS.information} strokeWidth={2.5} dot={{ r:3, fill:"var(--card)", stroke:CHART_COLORS.information, strokeWidth:2 }} activeDot={{r:5, fill:CHART_COLORS.information}} /></LineChart></ResponsiveContainer> : data.length === 1 ? <div className="grid h-full place-items-center"><div className="text-center"><p className="text-4xl font-bold tracking-tight" style={{color:CHART_COLORS.information}}>{data[0].value}%</p><p className="mt-2 text-sm font-medium">{data[0].label}</p><p className="mt-1 text-xs text-muted-foreground">More audit periods are needed to establish a trend.</p></div></div> : <Empty text="No audits during this period" />}
  </ChartCard>;
}

export function ZonePerformanceChart({ data }: { data: ZoneScorePoint[] }) {
  return <ChartCard title="Average Audit Score by Zone" description="Average audit performance across workplace zones.">{data.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top:8,right:18,left:-14,bottom:4 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="zone" tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><YAxis domain={[0,100]} tickFormatter={(v)=>`${v}%`} tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><Tooltip contentStyle={tooltipStyle} formatter={(v)=>[`${v}%`,"Average score"]} labelFormatter={(label,payload)=>`${label}${payload?.[0]?.payload?.leader ? ` · ${payload[0].payload.leader}` : ""}`} /><Bar name="Average score" dataKey="score" radius={[5,5,0,0]} maxBarSize={42}>{data.map((point,index)=><Cell key={point.zone} fill={CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer> : <Empty text="No zone scores available" />}</ChartCard>;
}

export function CorrectiveActionsChart({ data }: { data: ActionStatusPoint[] }) {
  return <ChartCard title="Non-Compliances by Zone and Status" description="Open corrective workload compared with closed actions.">{data.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{top:8,right:12,left:-20,bottom:4}}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="zone" tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><Tooltip contentStyle={tooltipStyle} cursor={{fill:"var(--muted)"}} /><Legend iconType="circle" iconSize={7} wrapperStyle={{fontSize:"11px"}} /><Bar dataKey="Closed" stackId="status" fill={CHART_COLORS.positive} /><Bar dataKey="Open" stackId="status" fill={CHART_COLORS.attention} radius={[4,4,0,0]} /></BarChart></ResponsiveContainer> : <Empty text="No non-compliances during this period" />}</ChartCard>;
}

export function ImprovementsTrend({ data }: { data: TrendPoint[] }) {
  return <ChartCard title="Total Improvements by Period" description="Corrective actions successfully completed over time.">{data.length ? <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{top:8,right:18,left:-22,bottom:4}}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{fill:"var(--muted-foreground)",fontSize:11}} /><Tooltip contentStyle={tooltipStyle} formatter={(v)=>[v,"Completed improvements"]} /><Line name="Completed improvements" type="monotone" dataKey="value" stroke={CHART_COLORS.supporting} strokeWidth={2.5} dot={{r:3,fill:"var(--card)",stroke:CHART_COLORS.supporting,strokeWidth:2}} activeDot={{r:5,fill:CHART_COLORS.supporting}} /></LineChart></ResponsiveContainer> : <Empty text="No completed improvements during this period" />}</ChartCard>;
}

function Empty({ text }: { text: string }) { return <div className="grid h-full place-items-center"><p className="text-sm text-muted-foreground">{text}</p></div>; }
