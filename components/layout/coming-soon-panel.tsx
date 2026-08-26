import { Construction, type LucideIcon } from "lucide-react"

interface ComingSoonPanelProps {
  icon?: LucideIcon
  title: string
  description: string
}

/**
 * Placeholder content for screens whose shell/route exists but whose feature
 * UI hasn't been built yet. Keeps every unbuilt screen visually consistent
 * (icon, title, description) instead of each page inventing its own filler.
 */
function ComingSoonPanel({
  icon: Icon = Construction,
  title,
  description,
}: ComingSoonPanelProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export { ComingSoonPanel }
