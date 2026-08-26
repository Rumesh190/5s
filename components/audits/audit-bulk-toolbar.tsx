import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AuditBulkToolbarProps {
  count: number
  onClear: () => void
}

/** UI-only bulk actions bar — no backend, so these actions are presentational per the sprint scope. */
function AuditBulkToolbar({ count, onClear }: AuditBulkToolbarProps) {
  if (count === 0) return null

  return (
    <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-500/30 dark:bg-blue-500/10">
      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
        {count} {count === 1 ? "audit" : "audits"} selected
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Assign
        </Button>
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="size-4" />
          Clear selection
        </Button>
      </div>
    </div>
  )
}

export { AuditBulkToolbar }
