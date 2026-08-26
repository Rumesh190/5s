import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/** Shared frame for every chart on the Dashboard — keeps title/description
 * placement and card chrome identical across the Audit Trend and Root Cause
 * Distribution charts. */
function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={cn("transition-shadow duration-200 hover:shadow-md", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  )
}

export { ChartCard }
