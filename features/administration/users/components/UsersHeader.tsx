"use client";

import AddUserDialog from "./AddUserDialog";

import { User } from "../types/user";

interface UsersHeaderProps {
  onUserAdded: (user: User) => void;
}

export default function UsersHeader({
  onUserAdded,
}: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Users
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Manage users, roles, plant assignments, and department
          access across the organization.
        </p>
      </div>

      <AddUserDialog onUserAdded={onUserAdded} />
    </div>
  );
}