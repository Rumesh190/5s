"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { AuditorRecord } from "@/lib/create-audit/master-data.mock"

interface UserMultiSelectProps {
  auditors: AuditorRecord[]
  value: string[]
  onChange: (ids: string[]) => void
  placeholder?: string
}

/** Multi-select for "Additional Team Members" — same Command + Popover pattern as UserSelect. */
function UserMultiSelect({
  auditors,
  value,
  onChange,
  placeholder = "Add team members",
}: UserMultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selected = value
    .map((id) => auditors.find((auditor) => auditor.id === id))
    .filter((auditor): auditor is AuditorRecord => Boolean(auditor))

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((existing) => existing !== id) : [...value, id])
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            />
          }
        >
          <span className="text-muted-foreground">{placeholder}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search by name..." />
            <CommandList>
              <CommandEmpty>No auditor found.</CommandEmpty>
              <CommandGroup>
                {auditors.map((auditor) => {
                  const checked = value.includes(auditor.id)
                  return (
                    <CommandItem
                      key={auditor.id}
                      value={auditor.name}
                      onSelect={() => toggle(auditor.id)}
                    >
                      <Check className={cn("size-4", checked ? "opacity-100" : "opacity-0")} />
                      <span className="flex flex-col">
                        <span>{auditor.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {auditor.role} · {auditor.plant}
                        </span>
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((auditor) => (
            <Badge key={auditor.id} variant="secondary" className="gap-1 pr-1">
              {auditor.name}
              <button
                type="button"
                onClick={() => toggle(auditor.id)}
                aria-label={`Remove ${auditor.name}`}
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export { UserMultiSelect }
