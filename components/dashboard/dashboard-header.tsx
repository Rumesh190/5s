import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  title?: string
  description?: string
}

/** Dashboard-specific page header: title, subtitle, and the primary "New Audit" CTA. */
function DashboardHeader({
  title = "Dashboard",
  description = "Real-time overview of audit activity, tasks, and KPIs.",
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[32px] leading-tight font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button
        render={<Link href="/audits/create" />}
        nativeButton={false}
        className="bg-blue-600 text-white hover:bg-blue-600/90"
      >
        <Plus className="size-4" />
        New Audit
      </Button>
    </div>
  )
}

export { DashboardHeader }
