import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button",
    "inline-flex shrink-0 items-center justify-center",
    "whitespace-nowrap",
    "rounded-md",
    "text-sm font-medium",
    "outline-none",
    "transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out motion-reduce:transition-none",
    "active:scale-[0.985] disabled:active:scale-100",
    "focus-visible:ring-2",
    "focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "shadow-sm",
          "hover:bg-primary/90",
          "active:bg-primary/85",
        ],

        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-sm",
          "hover:bg-secondary/80",
          "active:bg-secondary/70",
        ],

        outline: [
          "border border-border",
          "bg-background text-foreground",
          "shadow-sm",
          "hover:bg-muted",
          "hover:text-foreground",
          "active:bg-muted/80",
        ],

        ghost: [
          "text-muted-foreground",
          "hover:bg-muted",
          "hover:text-foreground",
          "active:bg-muted/80",
        ],

        destructive: [
          "bg-destructive text-white",
          "shadow-sm",
          "hover:bg-destructive/90",
          "active:bg-destructive/85",
          "focus-visible:ring-destructive/30",
          "dark:bg-destructive/90",
          "dark:hover:bg-destructive",
        ],

        link: [
          "text-primary underline-offset-4",
          "hover:underline",
        ],
      },

      size: {
        default: [
          "h-9",
          "gap-2",
          "px-4",
          "has-[>svg]:px-3",
        ],

        sm: [
          "h-8",
          "gap-1.5",
          "px-3",
          "text-[13px]",
          "has-[>svg]:px-2.5",
        ],

        lg: [
          "h-10",
          "gap-2",
          "px-5",
          "has-[>svg]:px-4",
        ],

        icon: [
          "size-9",
          "p-0",
          "has-[>svg]:px-0",
        ],

        "icon-sm": [
          "size-8",
          "p-0",
          "has-[>svg]:px-0",
        ],

        "icon-lg": [
          "size-10",
          "p-0",
          "has-[>svg]:px-0",
        ],
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  )
}

export {
  Button,
  buttonVariants,
}
