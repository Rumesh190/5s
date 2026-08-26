"use client";

import AddRoleDialog from "./AddRoleDialog";

import { Role } from "../data/roles";

interface RolesHeaderProps {
  onRoleAdded: (role: Role) => void;
}

export default function RolesHeader({
  onRoleAdded,
}: RolesHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Roles & Permissions
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Define roles and manage module-level permissions
          across the organization.
        </p>
      </div>

      <AddRoleDialog onRoleAdded={onRoleAdded} />
    </div>
  );
}