import Link from "next/link"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuickAction } from "@/types/dashboard"

interface QuickActionsProps {
  actions: QuickAction[]
}

function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/50",
              action.primary &&
                "border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:hover:bg-blue-500/20"
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                action.primary ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              <action.icon className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-medium text-foreground">{action.label}</span>
              <span className="truncate text-xs text-muted-foreground">{action.description}</span>
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export { QuickActions }
