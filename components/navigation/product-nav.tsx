"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardCheck, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { isNavGroup, isNavItemActive, MAIN_NAV } from "@/lib/navigation"
import { NotificationBell } from "@/components/navigation/notification-bell"
import { UserMenu } from "@/components/navigation/user-menu"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/preferences/use-i18n"
import { navigationKey } from "@/lib/i18n"

const HIDE_DISTANCE = 36
const SHOW_DISTANCE = 18
const TOP_SAFE_ZONE = 24

function ProductNav() {
  const pathname = usePathname()
  const navRef = React.useRef<HTMLElement | null>(null)
  const lastScrollY = React.useRef(0)
  const intentDistance = React.useRef(0)
  const direction = React.useRef<"up" | "down" | null>(null)
  const ticking = React.useRef(false)
  const [hidden, setHidden] = React.useState(false)
  const { t } = useI18n()

  const navGroup = MAIN_NAV.find(isNavGroup)
  const items = navGroup?.children ?? []
  const primaryItems = items.slice(0, 4)
  const secondaryItems = items.slice(4)

  React.useEffect(() => {
    lastScrollY.current = window.scrollY

    function hasOpenInteraction() {
      const nav = navRef.current
      if (!nav) return false

      const activeElement = document.activeElement
      const searchHasFocus =
        activeElement instanceof HTMLInputElement &&
        nav.contains(activeElement)

      return Boolean(
        searchHasFocus ||
        nav.querySelector('[aria-expanded="true"]')
      )
    }

    function updateNavigation() {
      ticking.current = false
      const nextY = Math.max(window.scrollY, 0)
      const delta = nextY - lastScrollY.current
      lastScrollY.current = nextY

      if (nextY <= TOP_SAFE_ZONE || hasOpenInteraction()) {
        intentDistance.current = 0
        direction.current = null
        setHidden(false)
        return
      }

      if (Math.abs(delta) < 2) return

      const nextDirection = delta > 0 ? "down" : "up"
      if (direction.current !== nextDirection) {
        direction.current = nextDirection
        intentDistance.current = 0
      }

      intentDistance.current += Math.abs(delta)

      if (nextDirection === "down" && intentDistance.current >= HIDE_DISTANCE) {
        setHidden(true)
        intentDistance.current = 0
      }

      if (nextDirection === "up" && intentDistance.current >= SHOW_DISTANCE) {
        setHidden(false)
        intentDistance.current = 0
      }
    }

    function handleScroll() {
      if (ticking.current) return
      ticking.current = true
      window.requestAnimationFrame(updateNavigation)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      ref={navRef}
      className={cn(
        "app-top-nav fixed inset-x-0 top-0 z-50 hidden h-16 border-b border-slate-200/90 bg-white text-slate-900",
        "shadow-[0_2px_10px_rgb(15_23_42/0.05)] dark:border-white/[0.08] dark:bg-[#20242c] dark:text-slate-100 dark:shadow-[0_2px_12px_rgb(0_0_0/0.22)]",
        "transition-transform duration-[240ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none lg:block",
        hidden && "-translate-y-full"
      )}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[1920px] items-center px-6 xl:px-8">
        <Link href="/5s" className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/60">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] shadow-[0_3px_10px_var(--brand-accent-shadow)]">
            <ClipboardCheck className="size-[18px]" />
          </span>
          <span className="font-heading text-[15px] font-semibold tracking-[-0.01em] text-slate-950 dark:text-white">5S</span>
        </Link>

        <nav aria-label="Primary" className="absolute left-1/2 flex h-full min-w-0 -translate-x-1/2 items-center gap-0.5 xl:gap-1">
          {items.map((item) => {
            const active = isNavItemActive(pathname, item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onDoubleClick={(event) => {
                  if (active && item.href === "/5s/audits") {
                    event.preventDefault()
                    window.location.assign(item.href)
                  }
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative h-9 items-center gap-2 rounded-md px-2.5 text-[13.5px] font-medium xl:px-3",
                  primaryItems.includes(item) ? "flex" : "hidden xl:flex",
                  "text-slate-600 transition-[background-color,color] duration-200 hover:bg-slate-100/80 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-100",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/60",
                  active && "bg-[var(--brand-nav-soft)] text-[var(--brand-accent)] dark:text-[var(--brand-accent-light)]"
                )}
              >
                <Icon className={cn("size-4", active ? "text-[var(--brand-accent)] dark:text-[var(--brand-accent-light)]" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300")} />
                <span className="whitespace-nowrap">{t(navigationKey(item.href))}</span>
                {active && <span className="absolute inset-x-3 -bottom-[14px] h-0.5 rounded-full bg-[var(--brand-accent)] dark:bg-[var(--brand-accent-light)]" />}
              </Link>
            )
          })}
          {secondaryItems.length > 0 && <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-1.5 text-slate-600 dark:text-slate-400 xl:hidden" />}>
              <MoreHorizontal className="size-4" /> {t("navigation.more")}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              {secondaryItems.map((item) => { const Icon = item.icon; const active = isNavItemActive(pathname, item.href); return <DropdownMenuItem key={item.href} render={<Link href={item.href} className={cn("flex min-w-0 items-center gap-2 px-2 py-2", active && "text-[var(--brand-accent)]")} />}><Icon className="size-4 shrink-0" /><span className="break-words">{t(navigationKey(item.href))}</span></DropdownMenuItem> })}
            </DropdownMenuContent>
          </DropdownMenu>}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 [&_button]:text-slate-600 [&_button]:hover:bg-slate-100 [&_button]:hover:text-slate-950 dark:[&_button]:text-slate-400 dark:[&_button]:hover:bg-white/[0.07] dark:[&_button]:hover:text-white [&_[data-slot=avatar-fallback]]:bg-slate-100 [&_[data-slot=avatar-fallback]]:text-slate-700 dark:[&_[data-slot=avatar-fallback]]:bg-white/[0.08] dark:[&_[data-slot=avatar-fallback]]:text-slate-200">
          <ThemeToggle />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

export { ProductNav }
