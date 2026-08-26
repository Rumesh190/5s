"use client"

import * as React from "react"

import ViewRoleDialog from "./ViewRoleDialog"
import EditRoleDialog from "./EditRoleDialog"
import ToggleRoleStatusDialog from "./ToggleRoleStatusDialog"
import { Role } from "../data/roles"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface RolesTableProps {
  roles: Role[]
  onRoleUpdated: (role: Role) => void
  onStatusChanged: (role: Role) => void
}

function getPermissionCount(role: Role) {
  return role.permissions.reduce(
    (total, module) =>
      total + module.permissions.length,
    0
  )
}

function getModuleCount(role: Role) {
  return role.permissions.length
}

export default function RolesTable({
  roles,
  onRoleUpdated,
  onStatusChanged,
}: RolesTableProps) {
  const [selectedRole, setSelectedRole] =
    React.useState<Role | null>(null)

  const handleRowClick = (role: Role) => {
    setSelectedRole(role)
  }

  const handleViewDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedRole(null)
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Users
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Permissions
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-medium tracking-wide text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    tabIndex={0}
                    role="button"
                    onClick={() => handleRowClick(role)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault()
                        handleRowClick(role)
                      }
                    }}
                    className="cursor-pointer border-b border-border/50 transition-colors duration-100 last:border-0 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40"
                  >
                    {/* Role */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {role.name}
                        </p>

                        <p className="font-mono text-xs text-muted-foreground">
                          {role.id}
                        </p>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="max-w-[360px] px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </td>

                    {/* Users */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">
                        {role.usersCount}
                      </span>
                    </td>

                    {/* Permissions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {getPermissionCount(role)} permissions
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {getModuleCount(role)} modules
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          role.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {role.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td
                      className="px-6 py-4"
                      onClick={(event) => {
                        event.stopPropagation()
                      }}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <ViewRoleDialog
                          role={role}
                        />

                        <EditRoleDialog
                          role={role}
                          onRoleUpdated={onRoleUpdated}
                        />

                        <ToggleRoleStatusDialog
                          role={role}
                          onStatusChanged={onStatusChanged}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {roles.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      No roles found matching the selected
                      filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedRole && (
        <ViewRoleDialog
          role={selectedRole}
          open={true}
          onOpenChange={handleViewDialogChange}
          showTrigger={false}
        />
      )}
    </>
  )
}