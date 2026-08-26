import * as React from "react"

import { cn } from "@/lib/utils"

interface PageContainerProps
  extends React.ComponentProps<"div"> {
  /** Page title */
  title?: string

  /** Supporting copy displayed below the title */
  description?: string

  /** Page-level actions */
  actions?: React.ReactNode
}

/**
 * Shared application page shell.
 *
 * Provides:
 * - Consistent content width
 * - Responsive page padding
 * - Page title hierarchy
 * - Supporting description
 * - Page-level actions
 */
function PageContainer({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: PageContainerProps) {
  const hasHeader =
    Boolean(title || description || actions)

  return (
    <div
      data-slot="page-container"
      className={cn(
        "motion-page-enter flex w-full flex-1 flex-col gap-5 lg:gap-6",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <header
          data-slot="page-header"
          className={cn(
            "flex flex-col gap-3 border-b border-border/60 pb-4",
            "sm:flex-row sm:items-start sm:justify-between"
          )}
        >
          {/* Title block */}
          {(title || description) && (
            <div
              data-slot="page-header-content"
              className="min-w-0 space-y-1.5"
            >
              {title && (
                <h1
                  data-slot="page-title"
                  className={cn(
                    "font-heading text-2xl font-semibold leading-tight",
                    "tracking-[-0.025em] text-foreground",
                    "sm:text-[28px] sm:leading-8"
                  )}
                >
                  {title}
                </h1>
              )}

              {description && (
                <p
                  data-slot="page-description"
                  className={cn(
                    "max-w-2xl text-sm leading-6",
                    "text-muted-foreground"
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Page actions */}
          {actions && (
            <div
              data-slot="page-actions"
              className={cn(
                "flex min-w-0 flex-wrap items-center gap-2",
                "sm:pt-0.5"
              )}
            >
              {actions}
            </div>
          )}
        </header>
      )}

      {/* Page content */}
      <div
        data-slot="page-content"
        className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6"
      >
        {children}
      </div>
    </div>
  )
}

export { PageContainer }
