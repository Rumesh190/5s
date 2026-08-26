import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

/**
 * Standalone 5S search entry point. Search behavior will be connected to the
 * product's audit and action data in a later phase.
 */
function SearchBar({ tone = "default" }: { tone?: "default" | "product" }) {
  return (
    <InputGroup className={cn("hidden w-72 shrink-0 sm:flex lg:w-80", tone === "product" && "h-9 w-64 rounded-[10px] border-slate-200 bg-slate-50 text-slate-950 shadow-none lg:w-72 max-2xl:hidden focus-within:border-[var(--brand-accent)]/55 focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--brand-accent)]/10 dark:border-white/10 dark:bg-white/[0.055] dark:text-slate-100 dark:focus-within:border-[var(--brand-accent-light)]/50 dark:focus-within:bg-white/[0.075] dark:focus-within:ring-[var(--brand-accent-light)]/10")}>
      <InputGroupAddon className={tone === "product" ? "text-slate-500 dark:text-slate-400" : undefined}>
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder="Search 5S..."
        aria-label="Search"
        className={tone === "product" ? "text-slate-950 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500" : undefined}
      />
    </InputGroup>
  )
}

export { SearchBar }
