"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User, UserRole } from "../types/user";

interface EditUserDialogProps {
  user: User;
  onUserUpdated: (user: User) => void;
}

export default function EditUserDialog({
  user,
  onUserUpdated,
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [plant, setPlant] = useState(user.plant);
  const [department, setDepartment] = useState(user.department);
  const [status, setStatus] = useState<User["status"]>(
    user.status
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPlant(user.plant);
      setDepartment(user.department);
      setStatus(user.status);
    });
    return () => { cancelled = true; };
  }, [open, user]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !role ||
      !plant ||
      !department.trim()
    ) {
      return;
    }

    const updatedUser: User = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      role,
      plant,
      department: department.trim(),
      status,
    };

    onUserUpdated(updatedUser);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${user.name}`}
          >
            <Pencil />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>

            <DialogDescription>
              Update the user&apos;s profile, role, plant, department,
              and account status.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor={`edit-user-name-${user.id}`}>
                Full Name
              </Label>

              <Input
                id={`edit-user-name-${user.id}`}
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor={`edit-user-email-${user.id}`}>
                Email Address
              </Label>

              <Input
                id={`edit-user-email-${user.id}`}
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label>Role</Label>

              <Select
                value={role}
                onValueChange={(value) => {
                  if (value !== null) {
                    setRole(value as UserRole);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Administrator">
                    Administrator
                  </SelectItem>

                  <SelectItem value="Quality Manager">
                    Quality Manager
                  </SelectItem>

                  <SelectItem value="Auditor">
                    Auditor
                  </SelectItem>

                  <SelectItem value="Investigator">
                    Investigator
                  </SelectItem>

                  <SelectItem value="Viewer">
                    Viewer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plant */}
            <div className="grid gap-2">
              <Label>Plant</Label>

              <Select
                value={plant}
                onValueChange={(value) => {
                  setPlant(value ?? "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plant" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Chennai">
                    Chennai
                  </SelectItem>

                  <SelectItem value="Hosur">
                    Hosur
                  </SelectItem>

                  <SelectItem value="Bengaluru">
                    Bengaluru
                  </SelectItem>

                  <SelectItem value="Mysuru">
                    Mysuru
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="grid gap-2">
              <Label
                htmlFor={`edit-user-department-${user.id}`}
              >
                Department
              </Label>

              <Input
                id={`edit-user-department-${user.id}`}
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                required
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>Status</Label>

              <Select
                value={status}
                onValueChange={(value) => {
                  if (value !== null) {
                    setStatus(value as User["status"]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Active">
                    Active
                  </SelectItem>

                  <SelectItem value="Inactive">
                    Inactive
                  </SelectItem>

                  <SelectItem value="Invited">
                    Invited
                  </SelectItem>
                </SelectContent>
              </Select>
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
