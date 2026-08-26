"use client"

import * as React from "react"
import { Eye } from "lucide-react"

import { User } from "../types/user"

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

interface ViewUserDialogProps {
  user: User
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
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

export default function ViewUserDialog({
  user,
  open,
  onOpenChange,
  showTrigger = true,
}: ViewUserDialogProps) {
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
              aria-label={`View ${user.name}`}
            >
              <Eye />
            </Button>
          }
        />
      )}

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>

          <DialogDescription>
            View the user's account and organizational details.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y rounded-lg border bg-card">
          {/* Name */}
          <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Full Name
            </span>

            <span className="text-sm font-medium">
              {user.name}
            </span>
          </div>

          {/* Email */}
          <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Email
            </span>

            <span className="break-all text-sm font-medium">
              {user.email}
            </span>
          </div>

          {/* Role */}
          <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Role
            </span>

            <span className="text-sm font-medium">
              {user.role}
            </span>
          </div>

          {/* Plant */}
          <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Plant
            </span>

            <span className="text-sm font-medium">
              {user.plant}
            </span>
          </div>

          {/* Department */}
          <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Department
            </span>

            <span className="text-sm font-medium">
              {user.department}
            </span>
          </div>

          {/* Status */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Status
            </span>

            <div>
              <Badge variant={getStatusVariant(user.status)}>
                {user.status}
              </Badge>
            </div>
          </div>

          {/* User ID */}
          <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              User ID
            </span>

            <span className="font-mono text-xs text-muted-foreground">
              {user.id}
            </span>
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