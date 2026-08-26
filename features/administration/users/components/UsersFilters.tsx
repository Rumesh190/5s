"use client";

import { RotateCcw, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersFiltersProps {
  search: string;
  role: string;
  plant: string;
  status: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onPlantChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function UsersFilters({
  search,
  role,
  plant,
  status,
  onSearchChange,
  onRoleChange,
  onPlantChange,
  onStatusChange,
  onClearFilters,
}: UsersFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" ||
    role !== "all" ||
    plant !== "all" ||
    status !== "all";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          className="pl-10"
        />
      </div>

      {/* Role */}
      <Select
        value={role}
        onValueChange={(value) => {
          onRoleChange(value ?? "all");
        }}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Roles
          </SelectItem>

          <SelectItem value="Administrator">
            Administrator
          </SelectItem>

          <SelectItem value="Quality Manager">
            Quality Manager
          </SelectItem>

          <SelectItem value="Auditor">
            Auditor
          </SelectItem>

          <SelectItem value="Investigator">
            Investigator
          </SelectItem>

          <SelectItem value="Viewer">
            Viewer
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Plant */}
      <Select
        value={plant}
        onValueChange={(value) => {
          onPlantChange(value ?? "all");
        }}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Plant" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Plants
          </SelectItem>

          <SelectItem value="Chennai">
            Chennai
          </SelectItem>

          <SelectItem value="Hosur">
            Hosur
          </SelectItem>

          <SelectItem value="Bengaluru">
            Bengaluru
          </SelectItem>

          <SelectItem value="Mysuru">
            Mysuru
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={status}
        onValueChange={(value) => {
          onStatusChange(value ?? "all");
        }}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Statuses
          </SelectItem>

          <SelectItem value="Active">
            Active
          </SelectItem>

          <SelectItem value="Inactive">
            Inactive
          </SelectItem>

          <SelectItem value="Invited">
            Invited
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={onClearFilters}
          className="w-full lg:w-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}