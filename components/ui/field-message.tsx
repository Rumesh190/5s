import * as React from "react"

import { cn } from "@/lib/utils"

interface FieldMessageProps
  extends React.ComponentProps<"p"> {
  error?: boolean
}

function FieldMessage({
  className,
  error = false,
  children,
  ...props
}: FieldMessageProps) {
  if (!children) {
    return null
  }

  return (
    <p
      data-slot="field-message"
      data-error={error}
      className={cn(
        "text-xs leading-5",
        error
          ? "text-destructive"
          : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {error && (
        <span
          aria-hidden="true"
          className="mr-1"
        >
          •
        </span>
      )}

      {children}
    </p>
  )
}

export { FieldMessage }