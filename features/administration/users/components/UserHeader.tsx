"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AddUserDialog from "./AddUserDialog";

export default function UsersHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Users
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Manage users, roles, plant assignments, and department access
          across the organization.
        </p>
      </div>

      <AddUserDialog
        trigger={
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />
    </div>
  );
}