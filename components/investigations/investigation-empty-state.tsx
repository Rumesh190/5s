import { FileSearch, FilterX } from "lucide-react"

import { Button } from "@/components/ui/button"

interface InvestigationEmptyStateProps {
  /** True when filters/search are hiding all rows; false when there are no investigations at all. */
  filtered: boolean
  onClearFilters?: () => void
}

function InvestigationEmptyState({ filtered, onClearFilters }: InvestigationEmptyStateProps) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FilterX className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">
            No investigations match the selected filters.
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try adjusting or clearing your filters to see more results.
          </p>
        </div>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileSearch className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">No investigations found.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Investigations are started from a finding on an Audit&apos;s Findings tab.
        </p>
      </div>
    </div>
  )
}

export { InvestigationEmptyState }
