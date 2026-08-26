"use client";

import { Power } from "lucide-react";

import { User } from "../types/user";

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

interface ToggleUserStatusDialogProps {
  user: User;
  onStatusChanged: (user: User) => void;
}

export default function ToggleUserStatusDialog({
  user,
  onStatusChanged,
}: ToggleUserStatusDialogProps) {
  const isActive = user.status === "Active";
  const nextStatus = isActive ? "Inactive" : "Active";

  function handleConfirm() {
    onStatusChanged({
      ...user,
      status: nextStatus,
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
            aria-label={
              isActive
                ? `Deactivate ${user.name}`
                : `Activate ${user.name}`
            }
          >
            <Power className="h-4 w-4" />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? "Deactivate User"
              : "Activate User"}
          </DialogTitle>

          <DialogDescription>
            {isActive
              ? `Are you sure you want to deactivate ${user.name}? They will no longer be considered an active user.`
              : `Are you sure you want to activate ${user.name}? They will be restored as an active user.`}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="font-medium">{user.name}</p>

          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>

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
                variant={isActive ? "destructive" : "default"}
                onClick={handleConfirm}
              >
                {isActive
                  ? "Deactivate User"
                  : "Activate User"}
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}