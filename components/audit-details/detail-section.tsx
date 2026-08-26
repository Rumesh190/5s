import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DetailSectionProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

/** Shared Card chrome for every read-only section on the Audit Details page. */
function DetailSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: DetailSectionProps) {
  return (
    <Card className={cn("transition-shadow duration-200 hover:shadow-md", className)}>
      <CardHeader className={cn(actions && "flex-row items-start justify-between space-y-0")}>
        <div className="flex flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions}
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-4", contentClassName)}>{children}</CardContent>
    </Card>
  )
}

export { DetailSection }
