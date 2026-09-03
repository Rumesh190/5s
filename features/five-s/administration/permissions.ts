import type { AdminRole, AdminUser, PermissionCode } from "./types";
import { PERMISSION_GROUPS } from "./types";

const all=Object.values(PERMISSION_GROUPS).flat() as PermissionCode[];
export const ROLE_PRESETS:Record<AdminRole,PermissionCode[]>={
  Admin:all,
  Auditor:["dashboard.view","audits.view","audits.create","audits.execute","audits.complete","actions.view","actions.create","actions.review","actions.close","reports.view","reports.export","ci.view","red_tag.view"],
  "Zone Leader":["dashboard.view","audits.view","actions.view","actions.assign","reports.view","ci.view","ci.review","red_tag.view","red_tag.manage","red_tag.print"],
  "Zone Member":["dashboard.view","audits.view","actions.view","actions.work","ci.view","ci.create","ci.implement","ci.complete","red_tag.view","red_tag.create"],
  Viewer:["dashboard.view","audits.view","actions.view","reports.view","ci.view","red_tag.view"],
};
export function permissionsForRoles(roles:AdminRole[]){return [...new Set(roles.flatMap(role=>ROLE_PRESETS[role]))] as PermissionCode[]}
export function hasPermission(user:Pick<AdminUser,"permissions">|undefined,permission:PermissionCode){return Boolean(user?.permissions.includes(permission))}
