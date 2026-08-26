import * as React from "react"

import { cn } from "@/lib/utils"

function Table({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-hidden overflow-x-auto",
        "rounded-xl",
        "bg-card",
        className
      )}
    >
      <table
        data-slot="table"
        className="w-full caption-bottom text-sm"
        {...props}
      />
    </div>
  )
}

function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "border-b border-border/60",
        "[&_tr]:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    />
  )
}

function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border/60",
        "bg-muted/20",
        "font-medium",
        className
      )}
      {...props}
    />
  )
}

function TableRow({
  className,
  onClick,
  ...props
}: React.ComponentProps<"tr">) {
  const clickable = Boolean(onClick)

  return (
    <tr
      data-slot="table-row"
      data-clickable={clickable}
      className={cn(
        "border-b border-border/50",
        "transition-colors duration-100",
        "hover:bg-muted/40",
        "data-[state=selected]:bg-muted/60",

        clickable && [
          "cursor-pointer",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-inset",
          "focus-visible:ring-ring/40",
        ],

        className
      )}
      onClick={onClick}
      {...props}
    />
  )
}

function TableHead({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-11 px-4",
        "text-left align-middle",
        "text-xs font-medium",
        "tracking-wide",
        "text-muted-foreground",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        "[&>[role=checkbox]]:translate-y-[1px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3.5",
        "align-middle",
        "text-sm text-foreground",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        "[&>[role=checkbox]]:translate-y-[1px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-4",
        "text-left text-xs",
        "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}