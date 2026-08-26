"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

import {
  ModulePermission,
  Permission,
  Role,
} from "../data/roles";

interface AddRoleDialogProps {
  onRoleAdded: (role: Role) => void;
}

const MODULES = [
  "Dashboard",
  "Audits",
  "Investigation",
  "Reports",
  "Administration",
] as const;

const PERMISSIONS: {
  value: Permission;
  label: string;
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
];

export default function AddRoleDialog({
  onRoleAdded,
}: AddRoleDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [permissions, setPermissions] =
    useState<ModulePermission[]>([]);

  function resetForm() {
    setName("");
    setDescription("");
    setPermissions([]);
  }

  function togglePermission(
    module: string,
    permission: Permission
  ) {
    setPermissions((current) => {
      const existingModule = current.find(
        (item) => item.module === module
      );

      if (!existingModule) {
        return [
          ...current,
          {
            module,
            permissions: [permission],
          },
        ];
      }

      const hasPermission =
        existingModule.permissions.includes(permission);

      const updatedPermissions = hasPermission
        ? existingModule.permissions.filter(
            (item) => item !== permission
          )
        : [
            ...existingModule.permissions,
            permission,
          ];

      if (updatedPermissions.length === 0) {
        return current.filter(
          (item) => item.module !== module
        );
      }

      return current.map((item) =>
        item.module === module
          ? {
              ...item,
              permissions: updatedPermissions,
            }
          : item
      );
    });
  }

  function hasPermission(
    module: string,
    permission: Permission
  ) {
    return (
      permissions
        .find((item) => item.module === module)
        ?.permissions.includes(permission) ?? false
    );
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    const newRole: Role = {
      id: `ROLE-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      usersCount: 0,
      status: "Active",
      permissions,
    };

    onRoleAdded(newRole);

    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button">
            <Plus className="mr-2 size-4" />
            Add Role
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add Role
            </DialogTitle>

            <DialogDescription>
              Create a role and configure the permissions
              available to users assigned to it.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Role Name */}
            <div className="grid gap-2">
              <Label htmlFor="role-name">
                Role Name
              </Label>

              <Input
                id="role-name"
                placeholder="e.g. Production Manager"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="role-description">
                Description
              </Label>

              <Textarea
                id="role-description"
                placeholder="Describe what this role is responsible for..."
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={3}
              />
            </div>

            {/* Permissions */}
            <div className="grid gap-3">
              <div>
                <Label>
                  Module Permissions
                </Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select the actions this role can perform
                  in each module.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <div className="grid grid-cols-[1fr_repeat(6,70px)] border-b bg-muted/40">
                  <div className="px-4 py-3 text-sm font-medium">
                    Module
                  </div>

                  {PERMISSIONS.map(
                    (permission) => (
                      <div
                        key={permission.value}
                        className="px-2 py-3 text-center text-xs font-medium text-muted-foreground"
                      >
                        {permission.label}
                      </div>
                    )
                  )}
                </div>

                {MODULES.map((module) => (
                  <div
                    key={module}
                    className="grid grid-cols-[1fr_repeat(6,70px)] border-b last:border-b-0"
                  >
                    <div className="flex items-center px-4 py-3 text-sm font-medium">
                      {module}
                    </div>

                    {PERMISSIONS.map(
                      (permission) => (
                        <div
                          key={permission.value}
                          className="flex items-center justify-center px-2 py-3"
                        >
                          <input
                            type="checkbox"
                            checked={hasPermission(
                              module,
                              permission.value
                            )}
                            onChange={() =>
                              togglePermission(
                                module,
                                permission.value
                              )
                            }
                            className="size-4 rounded border-input accent-primary"
                            aria-label={`${module} ${permission.label}`}
                          />
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}