"use client";

import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User, UserRole } from "../types/user";

interface AddUserDialogProps {
  onUserAdded?: (user: User) => void;
  trigger?: React.ReactElement;
}

export default function AddUserDialog({
  onUserAdded,
  trigger,
}: AddUserDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [plant, setPlant] = useState("");
  const [department, setDepartment] = useState("");

  function resetForm() {
    setName("");
    setEmail("");
    setRole("");
    setPlant("");
    setDepartment("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !email || !role || !plant || !department) {
      return;
    }

    const newUser: User = {
      id: `USR-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      plant,
      department: department.trim(),
      status: "Active",
    };

    onUserAdded?.(newUser);

    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button type="button">
              Add User
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>

            <DialogDescription>
              Create a new user and assign their role, plant,
              and department access.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="user-name">
                Full Name
              </Label>

              <Input
                id="user-name"
                placeholder="Enter full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-email">
                Email Address
              </Label>

              <Input
                id="user-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

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

            <div className="grid gap-2">
              <Label>Plant</Label>

              <Select
                value={plant}
                onValueChange={(value) => {
      setPlant(value ?? "")
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

            <div className="grid gap-2">
              <Label htmlFor="user-department">
                Department
              </Label>

              <Input
                id="user-department"
                placeholder="Enter department"
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                required
              />
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

            <Button
              type="submit"
              disabled={
                !name ||
                !email ||
                !role ||
                !plant ||
                !department
              }
            >
              Add User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}