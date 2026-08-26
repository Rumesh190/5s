import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { ACCENT_STYLES } from "@/lib/dashboard/accent"
import { Card, CardContent } from "@/components/ui/card"
import type { KpiDatum } from "@/types/dashboard"

const DIRECTION_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const

interface KpiCardProps {
  kpi: KpiDatum
}

function KpiCard({ kpi }: KpiCardProps) {
  const accent = ACCENT_STYLES[kpi.accent]
  const TrendIcon = DIRECTION_ICON[kpi.direction]
  const Icon = kpi.icon

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex min-h-[114px] flex-col">
          {/* Header */}
          <div className="flex min-h-8 items-start justify-between gap-3">
            <p className="max-w-[150px] text-xs font-medium leading-4 tracking-wide text-muted-foreground">
              {kpi.title}
            </p>

            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                accent.icon
              )}
            >
              <Icon className="size-4" />
            </span>
          </div>

          {/* Value + Trend */}
          <div className="mt-auto pt-3">
            <p className="text-[28px] font-semibold leading-none tracking-tight text-foreground">
              {kpi.value}
            </p>

            <div
              className={cn(
                "mt-3 flex items-center gap-1 text-xs font-medium",
                accent.text
              )}
            >
              <TrendIcon className="size-3.5 shrink-0" />
              <span className="truncate">{kpi.trend}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { KpiCard }