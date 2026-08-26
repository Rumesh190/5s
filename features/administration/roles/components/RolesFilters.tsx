"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RolesFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function RolesFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: RolesFiltersProps) {
  const hasFilters =
    search.trim() !== "" || status !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search roles..."
          className="pl-9"
        />
      </div>

      {/* Status */}
      <Select
        value={status}
        onValueChange={(value) => {
  if (value !== null) {
    onStatusChange(value)
  }
}}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All statuses
          </SelectItem>

          <SelectItem value="Active">
            Active
          </SelectItem>

          <SelectItem value="Inactive">
            Inactive
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Clear */}
      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onClearFilters}
          className="shrink-0"
        >
          <X className="mr-2 size-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}