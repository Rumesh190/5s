import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FiveSPageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  leading?: ReactNode;
  actions?: ReactNode;
  toolbar?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function FiveSPageHeader({
  eyebrow = "5S",
  title,
  description,
  leading,
  actions,
  toolbar,
  children,
  className,
}: FiveSPageHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border/65 pb-4",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-2.5">
          {leading && <div className="shrink-0">{leading}</div>}
          <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {eyebrow}
            </p>
          )}

          <h1 className={cn("font-heading text-2xl font-semibold leading-tight tracking-[-0.025em] text-foreground", eyebrow && "mt-1")}>
            {title}
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
            {description}
          </p>
          </div>
        </div>

        {actions && (
          <div className="flex min-w-0 flex-wrap items-center gap-2 md:shrink-0 md:pt-0.5">
            {actions}
          </div>
        )}
      </div>

      {(toolbar || children) && (
        <div className="mt-4 flex min-w-0 flex-col gap-2 border-t border-border/55 pt-3 md:flex-row md:flex-wrap md:items-center">
          {toolbar ?? children}
        </div>
      )}
    </header>
  );
}
