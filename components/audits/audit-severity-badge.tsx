import { cn } from "@/lib/utils"
import { AUDIT_SEVERITY_STYLES } from "@/lib/audits/style"
import type { AuditSeverity } from "@/types/audit"

function AuditSeverityBadge({ severity }: { severity: AuditSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        AUDIT_SEVERITY_STYLES[severity]
      )}
    >
      {severity}
    </span>
  )
}

export { AuditSeverityBadge }
