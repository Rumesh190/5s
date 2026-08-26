"use client";

import { useMemo, useState } from "react";

import UsersHeader from "./components/UsersHeader";
import UsersFilters from "./components/UsersFilters";
import UsersTable from "./components/UsersTable";
import { users as initialUsers } from "./data/users";
import { User } from "./types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [plant, setPlant] = useState("all");
  const [status, setStatus] = useState("all");

  // Add User
  function handleUserAdded(user: User) {
    setUsers((currentUsers) => [
      user,
      ...currentUsers,
    ]);
  }

  // Edit User
  function handleUserUpdated(updatedUser: User) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user
      )
    );
  }

  // Activate / Deactivate User
  function handleStatusChanged(updatedUser: User) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user
      )
    );
  }

  // Filtering
  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        role === "all" ||
        user.role === role;

      const matchesPlant =
        plant === "all" ||
        user.plant === plant;

      const matchesStatus =
        status === "all" ||
        user.status === status;

      return (
        matchesSearch &&
        matchesRole &&
        matchesPlant &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    role,
    plant,
    status,
  ]);

  function handleClearFilters() {
    setSearch("");
    setRole("all");
    setPlant("all");
    setStatus("all");
  }

  return (
    <main className="flex flex-col gap-8 p-8">
      <UsersHeader
        onUserAdded={handleUserAdded}
      />

      <UsersFilters
        search={search}
        role={role}
        plant={plant}
        status={status}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onPlantChange={setPlant}
        onStatusChange={setStatus}
        onClearFilters={handleClearFilters}
      />

      <UsersTable
        users={filteredUsers}
        onUserUpdated={handleUserUpdated}
        onStatusChanged={handleStatusChanged}
      />
    </main>
  );
}