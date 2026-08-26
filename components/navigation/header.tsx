import Link from "next/link"
import { ClipboardCheck } from "lucide-react"
import { MobileNavDrawer } from "@/components/navigation/mobile-nav-drawer"
import { NotificationBell } from "@/components/navigation/notification-bell"
import { UserMenu } from "@/components/navigation/user-menu"

/** Compact mobile/tablet header; desktop uses the product navigation bar. */
function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-sm supports-backdrop-filter:bg-background/80 sm:px-5 lg:hidden">
      <Link href="/5s" className="flex min-w-0 items-center gap-2 rounded-lg" aria-label="5S Dashboard"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)]"><ClipboardCheck className="size-[18px]" /></span><span className="font-heading text-sm font-semibold">5S</span></Link>

      <div className="ml-auto flex items-center gap-1.5">
        <NotificationBell />

        <UserMenu />

        <MobileNavDrawer />
      </div>
    </header>
  )
}

export { Header }
