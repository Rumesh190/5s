import Link from "next/link"
import { Plus, RefreshCw, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

interface AuditListHeaderProps {
  totalCount: number
  search: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  refreshing: boolean
}

/** Combines the spec's Header (title, count, Create Audit) and Toolbar (search, refresh) sections. */
function AuditListHeader({
  totalCount,
  search,
  onSearchChange,
  onRefresh,
  refreshing,
}: AuditListHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[32px] leading-tight font-semibold tracking-tight text-foreground">
            Audits
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "audit" : "audits"} across all plants
          </p>
        </div>
        <Button
          render={<Link href="/audits/create" />}
          nativeButton={false}
          className="bg-blue-600 text-white hover:bg-blue-600/90"
        >
          <Plus className="size-4" />
          Create Audit
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <InputGroup className="sm:max-w-sm">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search by ID, title, or department..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search audits"
          />
        </InputGroup>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
          <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>
    </div>
  )
}

export { AuditListHeader }
