import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { CreateAuditSection } from "@/lib/create-audit/schema"

interface FormSectionProps {
  id: CreateAuditSection
  title: string
  description?: string
  children: ReactNode
  contentClassName?: string
}

/** Shared Card chrome for every form section — `scroll-mt-20` keeps the
 *  section nav's anchor links from landing behind the fixed Header. */
function FormSection({ id, title, description, children, contentClassName }: FormSectionProps) {
  return (
    <Card id={id} className="scroll-mt-20">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("grid gap-4 sm:grid-cols-2", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

export { FormSection }
