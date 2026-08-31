"use client"

import * as React from "react"

import ViewUserDialog from "./ViewUserDialog"
import { User } from "../types/user"
import EditUserDialog from "./EditUserDialog"
import ToggleUserStatusDialog from "./ToggleUserStatusDialog"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface UsersTableProps {
  users: User[]
  onUserUpdated: (user: User) => void
  onStatusChanged: (user: User) => void
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "outline" {
  switch (status) {
    case "Active":
      return "default"

    case "Inactive":
      return "secondary"

    case "Invited":
      return "outline"

    default:
      return "secondary"
  }
}

export default function UsersTable({
  users,
  onUserUpdated,
  onStatusChanged,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] =
    React.useState<User | null>(null)

  const handleRowClick = (user: User) => {
    setSelectedUser(user)
  }

  const handleViewDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedUser(null)
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
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Plant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-muted-foreground">
                    Department
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    tabIndex={0}
                    role="button"
                    onClick={() => handleRowClick(user)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault()
                        handleRowClick(user)
                      }
                    }}
                    className="cursor-pointer border-b border-border/50 transition-colors duration-100 last:border-0 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {user.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 text-sm">
                      {user.role}
                    </td>

                    {/* Plant */}
                    <td className="px-6 py-4 text-sm">
                      {user.plant}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 text-sm">
                      {user.department}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <Badge
                        variant={getStatusVariant(user.status)}
                      >
                        {user.status}
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
                        <ViewUserDialog
                          user={user}
                        />

                        <EditUserDialog
                          user={user}
                          onUserUpdated={onUserUpdated}
                        />

                        {user.status !== "Invited" && (
                          <ToggleUserStatusDialog
                            user={user}
                            onStatusChanged={onStatusChanged}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      No users found matching the selected
                      filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <ViewUserDialog
          user={selectedUser}
          open={true}
          onOpenChange={handleViewDialogChange}
          showTrigger={false}
        />
      )}
    </>
  )
}
