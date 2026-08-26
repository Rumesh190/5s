"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { ACCENT_STYLES } from "@/lib/dashboard/accent"
import { ChartCard } from "@/components/dashboard/chart-card"
import type { AuditTrendPoint } from "@/types/dashboard"

interface AuditTrendChartProps {
  data: AuditTrendPoint[]
}

const AXIS_TICK_STYLE = { fill: "var(--muted-foreground)", fontSize: 12 }

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid var(--border)",
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
}

function AuditTrendChart({ data }: AuditTrendChartProps) {
  return (
    <ChartCard title="Audit Trend" description="Audits created vs. closed, by month">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} />
            <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} width={32} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="created"
              name="Created"
              stroke={ACCENT_STYLES.blue.hex}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="closed"
              name="Closed"
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export { AuditTrendChart }
