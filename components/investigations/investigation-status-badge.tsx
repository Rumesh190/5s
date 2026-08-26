import { cn } from "@/lib/utils"
import { INVESTIGATION_STATUS_STYLES } from "@/lib/investigations/style"
import type { InvestigationStatus } from "@/types/investigation"

function InvestigationStatusBadge({ status }: { status: InvestigationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        INVESTIGATION_STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  )
}

export { InvestigationStatusBadge }
