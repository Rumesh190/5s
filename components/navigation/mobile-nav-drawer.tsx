"use client"

import * as React from "react"
import Link from "next/link"
import { ClipboardCheck, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "@/components/navigation/sidebar-nav"

/** Slide-in navigation for viewports below `lg`, mirroring the desktop Sidebar. */
function MobileNavDrawer() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 lg:hidden"
            aria-label="Open navigation"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw,380px)] max-w-none border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
        <SheetHeader className="h-14 border-b border-sidebar-border px-4 py-0">
          <SheetTitle>
            <Link
              href="/5s"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] shadow-[0_4px_12px_var(--brand-accent-shadow)] ring-1 ring-white/20">
                <ClipboardCheck className="size-[18px]" />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[15px] font-semibold">5S</span>
                <span className="mt-0.5 block text-xs font-medium text-[#707682] dark:text-sidebar-foreground/60">Operations workspace</span>
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNavDrawer }
