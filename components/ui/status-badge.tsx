import * as React from "react"

import { Badge } from "@/components/ui/badge"

type StatusVariant =
  | "default"
  | "secondary"
  | "outline"
  | "muted"
  | "success"
  | "warning"
  | "danger"
  | "info"

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  className?: string
}

const statusVariants: Record<
  string,
  StatusVariant
> = {
  open: "info",
  "in progress": "info",
  pending: "warning",
  "pending verification": "warning",
  verified: "success",
  approved: "success",
  closed: "success",
  active: "success",
  inactive: "muted",
  rejected: "danger",
  failed: "danger",
  cancelled: "danger",
  draft: "muted",
}

function StatusBadge({
  status,
  variant,
  className,
}: StatusBadgeProps) {
  const normalizedStatus = status
    .trim()
    .toLowerCase()

  const resolvedVariant =
    variant ??
    statusVariants[normalizedStatus] ??
    "secondary"

  return (
    <Badge
      variant={resolvedVariant}
      className={className}
    >
      {status}
    </Badge>
  )
}

export { StatusBadge }