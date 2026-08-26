"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ACCENT_STYLES } from "@/lib/dashboard/accent"
import { ChartCard } from "@/components/dashboard/chart-card"
import type { RootCauseDatum } from "@/types/dashboard"

interface RootCauseChartProps {
  data: RootCauseDatum[]
}

const AXIS_TICK_STYLE = { fill: "var(--muted-foreground)", fontSize: 12 }

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid var(--border)",
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
}

function RootCauseChart({ data }: RootCauseChartProps) {
  return (
    <ChartCard
      title="Root Cause Distribution"
      description="Most common causes from completed Five Why investigations"
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={AXIS_TICK_STYLE} />
            <YAxis
              type="category"
              dataKey="cause"
              tickLine={false}
              axisLine={false}
              width={116}
              tick={AXIS_TICK_STYLE}
            />
            <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={TOOLTIP_STYLE} />
            <Bar
              dataKey="count"
              name="Occurrences"
              fill={ACCENT_STYLES.blue.hex}
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export { RootCauseChart }
