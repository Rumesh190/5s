"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import {
  ModulePermission,
  Permission,
  Role,
} from "../data/roles";

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

interface EditRoleDialogProps {
  role: Role;
  onRoleUpdated: (role: Role) => void;
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

function clonePermissions(
  permissions: ModulePermission[]
): ModulePermission[] {
  return permissions.map((item) => ({
    module: item.module,
    permissions: [...item.permissions],
  }));
}

export default function EditRoleDialog({
  role,
  onRoleUpdated,
}: EditRoleDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(
    role.description
  );

  const [permissions, setPermissions] =
    useState<ModulePermission[]>(
      clonePermissions(role.permissions)
    );

  useEffect(() => {
    if (open) {
      setName(role.name);
      setDescription(role.description);
      setPermissions(
        clonePermissions(role.permissions)
      );
    }
  }, [open, role]);

  function resetForm() {
    setName(role.name);
    setDescription(role.description);
    setPermissions(
      clonePermissions(role.permissions)
    );
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
        existingModule.permissions.includes(
          permission
        );

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

    const updatedRole: Role = {
      ...role,
      name: name.trim(),
      description: description.trim(),
      permissions: clonePermissions(
        permissions
      ),
    };

    onRoleUpdated(updatedRole);

    setOpen(false);
  }

  function handleOpenChange(
    nextOpen: boolean
  ) {
    if (!nextOpen) {
      resetForm();
    }

    setOpen(nextOpen);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${role.name}`}
          >
            <Pencil className="size-4" />
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Edit Role
            </DialogTitle>

            <DialogDescription>
              Update the role details and configure its
              module-level permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Role Name */}
            <div className="grid gap-2">
              <Label htmlFor={`edit-role-name-${role.id}`}>
                Role Name
              </Label>

              <Input
                id={`edit-role-name-${role.id}`}
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter role name"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label
                htmlFor={`edit-role-description-${role.id}`}
              >
                Description
              </Label>

              <Textarea
                id={`edit-role-description-${role.id}`}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe this role..."
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
                  Select the actions this role can
                  perform in each module.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <div className="grid min-w-[680px] grid-cols-[1fr_repeat(6,70px)] border-b bg-muted/40">
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
                    className="grid min-w-[680px] grid-cols-[1fr_repeat(6,70px)] border-b last:border-b-0"
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
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}