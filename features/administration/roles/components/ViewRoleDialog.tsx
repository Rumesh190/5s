"use client"

import { Eye } from "lucide-react"

import { Permission, Role } from "../data/roles"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ViewRoleDialogProps {
  role: Role
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
}

const PERMISSIONS: {
  value: Permission
  label: string
}[] = [
  {
    value: "view",
    label: "View",
  },
  {
    value: "create",
    label: "Create",
  },
  {
    value: "edit",
    label: "Edit",
  },
  {
    value: "delete",
    label: "Delete",
  },
  {
    value: "approve",
    label: "Approve",
  },
  {
    value: "export",
    label: "Export",
  },
]

function hasPermission(
  role: Role,
  module: string,
  permission: Permission
) {
  return (
    role.permissions
      .find((item) => item.module === module)
      ?.permissions.includes(permission) ?? false
  )
}

export default function ViewRoleDialog({
  role,
  open,
  onOpenChange,
  showTrigger = true,
}: ViewRoleDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {showTrigger && (
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`View ${role.name}`}
            >
              <Eye />
            </Button>
          }
        />
      )}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>
            {role.name}
          </DialogTitle>

          <DialogDescription>
            View role details and configured module
            permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Role information */}
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Role ID
              </p>

              <p className="mt-1 font-mono text-sm">
                {role.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Users
              </p>

              <p className="mt-1 text-sm font-medium">
                {role.usersCount}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Status
              </p>

              <div className="mt-1">
                <Badge
                  variant={
                    role.status === "Active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {role.status}
                </Badge>
              </div>
            </div>

            <div className="sm:col-span-3">
              <p className="text-xs text-muted-foreground">
                Description
              </p>

              <p className="mt-1 text-sm">
                {role.description ||
                  "No description provided."}
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div className="grid gap-3">
            <div>
              <h3 className="text-sm font-medium">
                Module Permissions
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Permissions currently assigned to this
                role.
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Module
                    </th>

                    {PERMISSIONS.map(
                      (permission) => (
                        <th
                          key={permission.value}
                          className="px-3 py-3 text-center text-xs font-medium text-muted-foreground"
                        >
                          {permission.label}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {role.permissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        No module permissions configured.
                      </td>
                    </tr>
                  ) : (
                    role.permissions.map(
                      (modulePermission) => (
                        <tr
                          key={modulePermission.module}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {modulePermission.module}
                          </td>

                          {PERMISSIONS.map(
                            (permission) => {
                              const enabled =
                                hasPermission(
                                  role,
                                  modulePermission.module,
                                  permission.value
                                )

                              return (
                                <td
                                  key={permission.value}
                                  className="px-3 py-3 text-center"
                                >
                                  {enabled ? (
                                    <span
                                      className="text-sm font-semibold text-primary"
                                      aria-label={`${permission.label} enabled`}
                                    >
                                      ✓
                                    </span>
                                  ) : (
                                    <span
                                      className="text-sm text-muted-foreground/40"
                                      aria-label={`${permission.label} disabled`}
                                    >
                                      —
                                    </span>
                                  )}
                                </td>
                              )
                            }
                          )}
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange?.(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}