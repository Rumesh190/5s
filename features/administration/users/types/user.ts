export type UserStatus = "Active" | "Inactive" | "Invited";

export type UserRole =
  | "Administrator"
  | "Quality Manager"
  | "Auditor"
  | "Investigator"
  | "Viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plant: string;
  department: string;
  status: UserStatus;
}