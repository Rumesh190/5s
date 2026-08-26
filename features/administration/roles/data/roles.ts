
export type Permission =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "export";

export type ModulePermission = {
  module: string;
  permissions: Permission[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  status: "Active" | "Inactive";
  permissions: ModulePermission[];
};

export const roles: Role[] = [
  {
    id: "ROLE-001",
    name: "Administrator",
    description:
      "Full access to all modules, configuration, users, and system settings.",
    usersCount: 3,
    status: "Active",
    permissions: [
      {
        module: "Dashboard",
        permissions: ["view"],
      },
      {
        module: "Audits",
        permissions: [
          "view",
          "create",
          "edit",
          "delete",
          "approve",
          "export",
        ],
      },
      {
        module: "Investigation",
        permissions: [
          "view",
          "create",
          "edit",
          "delete",
          "approve",
          "export",
        ],
      },
      {
        module: "Reports",
        permissions: ["view", "export"],
      },
      {
        module: "Administration",
        permissions: [
          "view",
          "create",
          "edit",
          "delete",
        ],
      },
    ],
  },

  {
    id: "ROLE-002",
    name: "Quality Manager",
    description:
      "Manages audits, investigations, corrective actions, and quality reporting.",
    usersCount: 5,
    status: "Active",
    permissions: [
      {
        module: "Dashboard",
        permissions: ["view"],
      },
      {
        module: "Audits",
        permissions: [
          "view",
          "create",
          "edit",
          "approve",
          "export",
        ],
      },
      {
        module: "Investigation",
        permissions: [
          "view",
          "create",
          "edit",
          "approve",
          "export",
        ],
      },
      {
        module: "Reports",
        permissions: ["view", "export"],
      },
    ],
  },

  {
    id: "ROLE-003",
    name: "Auditor",
    description:
      "Creates and performs audits and records audit findings.",
    usersCount: 8,
    status: "Active",
    permissions: [
      {
        module: "Dashboard",
        permissions: ["view"],
      },
      {
        module: "Audits",
        permissions: [
          "view",
          "create",
          "edit",
        ],
      },
      {
        module: "Investigation",
        permissions: ["view", "create", "edit"],
      },
      {
        module: "Reports",
        permissions: ["view", "export"],
      },
    ],
  },

  {
    id: "ROLE-004",
    name: "Investigator",
    description:
      "Investigates audit findings and manages corrective actions.",
    usersCount: 6,
    status: "Active",
    permissions: [
      {
        module: "Dashboard",
        permissions: ["view"],
      },
      {
        module: "Audits",
        permissions: ["view"],
      },
      {
        module: "Investigation",
        permissions: [
          "view",
          "create",
          "edit",
          "approve",
        ],
      },
      {
        module: "Reports",
        permissions: ["view", "export"],
      },
    ],
  },

  {
    id: "ROLE-005",
    name: "Viewer",
    description:
      "Read-only access to dashboards, audits, investigations, and reports.",
    usersCount: 12,
    status: "Active",
    permissions: [
      {
        module: "Dashboard",
        permissions: ["view"],
      },
      {
        module: "Audits",
        permissions: ["view"],
      },
      {
        module: "Investigation",
        permissions: ["view"],
      },
      {
        module: "Reports",
        permissions: ["view"],
      },
    ],
  },
];

export const permissionLabels: Record<
  Permission,
  string
> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
  export: "Export",
};