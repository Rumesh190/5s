import { RefreshCw, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

interface InvestigationListHeaderProps {
  totalCount: number
  search: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  refreshing: boolean
}

function InvestigationListHeader({
  totalCount,
  search,
  onSearchChange,
  onRefresh,
  refreshing,
}: InvestigationListHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[32px] leading-tight font-semibold tracking-tight text-foreground">
          Investigations
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "investigation" : "investigations"} across all plants
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <InputGroup className="sm:max-w-sm">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search by ID, title, or linked audit..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search investigations"
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

export { InvestigationListHeader }
