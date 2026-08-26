"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full resize-y rounded-md",
        "border border-input",
        "bg-background",
        "px-3 py-2.5",
        "text-sm leading-5 text-foreground",
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

        "selection:bg-primary/20",
        "selection:text-foreground",

        className
      )}
      {...props}
    />
  )
}

export { Textarea }