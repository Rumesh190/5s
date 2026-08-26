import { Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdministrationHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      {/* Left Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Administration
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Manage users, roles, permissions, plants, departments and system
          configuration for your manufacturing quality platform.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import Users
        </Button>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  );
}