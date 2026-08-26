"use client";

import { Power } from "lucide-react";

import { Role } from "../data/roles";

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

interface ToggleRoleStatusDialogProps {
  role: Role;
  onStatusChanged: (role: Role) => void;
}

export default function ToggleRoleStatusDialog({
  role,
  onStatusChanged,
}: ToggleRoleStatusDialogProps) {
  const isActive = role.status === "Active";

  function handleConfirm() {
    onStatusChanged({
      ...role,
      status: isActive ? "Inactive" : "Active",
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`${isActive ? "Deactivate" : "Activate"} ${role.name}`}
          >
            <Power className="size-4" />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? "Deactivate Role"
              : "Activate Role"}
          </DialogTitle>

          <DialogDescription>
            {isActive
              ? `Are you sure you want to deactivate "${role.name}"? Users assigned to this role will no longer be able to use this role.`
              : `Are you sure you want to activate "${role.name}"? This role will become available for assignment again.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            }
          />

          <DialogTrigger
            render={
              <Button
                type="button"
                variant={
                  isActive
                    ? "destructive"
                    : "default"
                }
                onClick={handleConfirm}
              >
                {isActive
                  ? "Deactivate"
                  : "Activate"}
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}