import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportsFilters() {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {/* Date Range */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="7">Last 7 Days</SelectItem>
          <SelectItem value="30">Last 30 Days</SelectItem>
          <SelectItem value="90">Last 90 Days</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>

      {/* Plant */}

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Plant" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Plants</SelectItem>
          <SelectItem value="chennai">Chennai</SelectItem>
          <SelectItem value="hosur">Hosur</SelectItem>
          <SelectItem value="bangalore">Bengaluru</SelectItem>
          <SelectItem value="mysuru">Mysuru</SelectItem>
        </SelectContent>
      </Select>

      {/* Department */}

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="quality">Quality</SelectItem>
          <SelectItem value="assembly">Assembly</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="warehouse">Warehouse</SelectItem>
        </SelectContent>
      </Select>

      {/* Search */}

      <div className="relative flex-1 min-w-[280px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search reports..."
          className="pl-10"
        />
      </div>
    </div>
  );
}