import { cn } from "@/lib/utils"
import { AUDIT_STATUS_STYLES } from "@/lib/audits/style"
import type { AuditStatus } from "@/types/audit"

function AuditStatusBadge({ status }: { status: AuditStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        AUDIT_STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  )
}

export { AuditStatusBadge }
