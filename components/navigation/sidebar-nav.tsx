"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { isNavGroup, isNavItemActive, MAIN_NAV, type NavLeaf } from "@/lib/navigation"
import { useI18n } from "@/components/preferences/use-i18n"
import { navigationKey } from "@/lib/i18n"

interface SidebarNavProps {
  collapsed?: boolean
  onNavigate?: () => void
}

function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const navGroup = MAIN_NAV.find(isNavGroup)

  if (!navGroup) return null

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1", collapsed ? "px-2" : "px-3")}>
      {navGroup.children.map((item) => (
        <SidebarLink
          key={item.href}
          entry={item}
          active={isNavItemActive(pathname, item.href)}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}

function SidebarLink({ entry, active, collapsed, onNavigate }: { entry: NavLeaf; active: boolean; collapsed: boolean; onNavigate?: () => void }) {
  const Icon = entry.icon
  const { t } = useI18n()
  const label = t(navigationKey(entry.href))
  const link = (
    <Link
      href={entry.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-10 items-center rounded-lg border border-transparent text-[13.5px] font-medium outline-none",
        "transition-[background-color,border-color,color,box-shadow] duration-200 motion-reduce:transition-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsed ? "justify-center px-0" : "gap-3 px-3",
        active && "border-sidebar-border bg-card text-sidebar-foreground shadow-[0_1px_2px_rgb(16_24_40/0.05)] dark:bg-sidebar-accent"
      )}
    >
      {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-sidebar-primary" />}
      <span className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
      )}>
        <Icon className="size-4" />
      </span>
      {!collapsed && <span className="break-words leading-5">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export { SidebarNav }
