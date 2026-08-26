"use client";

import { useMemo, useState } from "react";

import RolesHeader from "./components/RolesHeader";
import RolesFilters from "./components/RolesFilters";
import RolesTable from "./components/RolesTable";
import { roles as initialRoles, Role } from "./data/roles";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  function handleRoleAdded(role: Role) {
    setRoles((currentRoles) => [
      role,
      ...currentRoles,
    ]);
  }

  function handleClearFilters() {
    setSearch("");
    setStatus("all");
  }

  const filteredRoles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return roles.filter((role) => {
      const matchesSearch =
        !searchValue ||
        role.name
          .toLowerCase()
          .includes(searchValue) ||
        role.description
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "all" ||
        role.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [roles, search, status]);

  return (
    <main className="flex flex-col gap-8 p-8">
      <RolesHeader
        onRoleAdded={handleRoleAdded}
      />

      <RolesFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      <RolesTable roles={filteredRoles} />
    </main>
  );
}