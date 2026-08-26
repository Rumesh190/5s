"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md",
        "border border-input",
        "bg-background",
        "px-3 py-1.5",
        "text-sm text-foreground",
        "shadow-xs",
        "transition-colors duration-150",
        "outline-none",

        "placeholder:text-muted-foreground",

        "hover:border-foreground/20",

        "focus-visible:border-ring",
        "focus-visible:ring-2",
        "focus-visible:ring-ring/20",

        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        "disabled:bg-muted",

        "aria-invalid:border-destructive",
        "aria-invalid:ring-2",
        "aria-invalid:ring-destructive/20",

        "dark:hover:border-foreground/25",

        "file:inline-flex",
        "file:h-7",
        "file:border-0",
        "file:bg-transparent",
        "file:text-sm",
        "file:font-medium",
        "file:text-foreground",

        "selection:bg-primary/20",
        "selection:text-foreground",

        className
      )}
      {...props}
    />
  )
}

export { Input }