import { cn } from "@/lib/utils"
import { PLANT_STATUS_STYLES } from "@/lib/dashboard/accent"
import { Card, CardContent } from "@/components/ui/card"
import type { PlantPerformance } from "@/types/dashboard"

interface PlantCardProps {
  plant: PlantPerformance
}

function PlantCard({ plant }: PlantCardProps) {
  const status = PLANT_STATUS_STYLES[plant.status]

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex min-h-[150px] flex-col">
          {/* Plant header */}
          <div className="flex min-h-8 items-start justify-between gap-4">
            <p className="text-sm font-semibold leading-5 text-foreground">
              {plant.name}
            </p>

            <span
              className={cn(
                "flex shrink-0 items-center gap-1.5 text-xs font-medium",
                status.text
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status.dot
                )}
                aria-hidden="true"
              />

              {status.label}
            </span>
          </div>

          {/* Completion rate */}
          <div className="mt-5 flex items-end justify-between gap-3">
            <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">
              {plant.completionRate}%
            </p>

            <p className="pb-0.5 text-xs text-muted-foreground">
              Completion rate
            </p>
          </div>

          {/* Progress */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                width: `${plant.completionRate}%`,
              }}
            />
          </div>

          {/* Audit summary */}
          <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
            <span>{plant.openAudits} open audits</span>

            <span>{plant.overdueAudits} overdue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PlantCard }