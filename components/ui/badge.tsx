import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "w-fit shrink-0 whitespace-nowrap",
    "rounded-md",
    "border",
    "px-2 py-0.5",
    "text-xs font-medium leading-4",
    "transition-[background-color,border-color,color,opacity] duration-150 motion-reduce:transition-none",
    "[&>svg]:size-3",
    "[&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-transparent",
          "bg-primary/10",
          "text-primary",
        ],

        secondary: [
          "border-transparent",
          "bg-secondary",
          "text-secondary-foreground",
        ],

        outline: [
          "border-border",
          "bg-background",
          "text-foreground",
        ],

        muted: [
          "border-transparent",
          "bg-muted",
          "text-muted-foreground",
        ],

        success: [
          "border-emerald-500/20",
          "bg-emerald-500/10",
          "text-emerald-700",
          "dark:text-emerald-400",
        ],

        warning: [
          "border-amber-500/20",
          "bg-amber-500/10",
          "text-amber-700",
          "dark:text-amber-400",
        ],

        danger: [
          "border-red-500/20",
          "bg-red-500/10",
          "text-red-700",
          "dark:text-red-400",
        ],

        info: [
          "border-sky-500/20",
          "bg-sky-500/10",
          "text-sky-700",
          "dark:text-sky-400",
        ],
      },

      size: {
        default: "min-h-6",
        sm: "min-h-5 px-1.5 text-[11px]",
        lg: "min-h-7 px-2.5",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(
        badgeVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

export {
  Badge,
  badgeVariants,
}
