"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
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

interface UserSelectProps {
  id?: string
  auditors: AuditorRecord[]
  value: string
  onChange: (auditorId: string) => void
  placeholder?: string
}

/** Searchable single-user selector ("Assigned Investigator"), built from the
 *  existing Command + Popover primitives per "reuse existing components". */
function UserSelect({ id, auditors, value, onChange, placeholder = "Search auditors..." }: UserSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selected = auditors.find((auditor) => auditor.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          />
        }
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? `${selected.name} — ${selected.role}` : placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search by name..." />
          <CommandList>
            <CommandEmpty>No auditor found.</CommandEmpty>
            <CommandGroup>
              {auditors.map((auditor) => (
                <CommandItem
                  key={auditor.id}
                  value={auditor.name}
                  onSelect={() => {
                    onChange(auditor.id === value ? "" : auditor.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("size-4", auditor.id === value ? "opacity-100" : "opacity-0")} />
                  <span className="flex flex-col">
                    <span>{auditor.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {auditor.role} · {auditor.plant}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { UserSelect }
