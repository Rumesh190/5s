"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/navigation/notification-bell";
import { UserMenu } from "@/components/navigation/user-menu";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

/**
 * Persistent, collapsible desktop navigation rail.
 * Hidden below `lg`.
 */
function Sidebar({
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <TooltipProvider>
      <aside
        className={cn(
          "app-left-nav fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[8px_0_28px_-24px_rgb(16_24_40/0.3)] transition-[width] duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none lg:flex",
          collapsed ? "w-16" : "w-[248px]"
        )}
      >
        <div
          className={cn(
            "flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3",
            collapsed && "justify-center gap-0.5 px-1"
          )}
        >
          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger render={<Link href="/5s" className="flex size-8 items-center justify-center rounded-[10px] bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] shadow-[0_4px_12px_var(--brand-accent-shadow)] ring-1 ring-white/20" aria-label="5S home" />}>
                  <ClipboardCheck className="size-[17px]" />
                </TooltipTrigger>
                <TooltipContent side="right">5S workspace</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" className="size-6 text-[#707682] hover:bg-sidebar-accent dark:text-sidebar-foreground/65" onClick={onToggleCollapsed} aria-label="Expand sidebar" />}>
                  <PanelLeftOpen className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Link href="/5s" className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] shadow-[0_4px_12px_var(--brand-accent-shadow)] ring-1 ring-white/20">
                  <ClipboardCheck className="size-[18px]" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-heading text-[15px] font-semibold">5S</span>
                  <span className="mt-0.5 block truncate text-xs font-medium text-[#707682] dark:text-sidebar-foreground/60">
                    Operations workspace
                  </span>
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-[#707682] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:text-sidebar-foreground/65"
                onClick={onToggleCollapsed}
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="size-[17px]" />
              </Button>
            </>
          )}
        </div>

        <ScrollArea className="min-h-0 flex-1 py-3">
          <SidebarNav
            collapsed={collapsed}
          />
        </ScrollArea>

        <div className={cn("shrink-0 border-t border-sidebar-border p-3", collapsed && "px-2")}>
          <div className={cn("flex items-center", collapsed ? "flex-col gap-1" : "justify-between gap-1")}>
            <ThemeToggle />
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export { Sidebar };
