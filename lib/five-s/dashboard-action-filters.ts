import type { MyAction } from "@/features/five-s/types/my-actions";
import { FIVE_S_ZONE_CONFIGURATION } from "@/lib/five-s/configuration";
import { getActionStatusLabel } from "@/lib/five-s/lifecycle-status";

export interface DashboardZoneMember {
  id: string;
  name: string;
}

export function getDashboardZoneMembers(actions: MyAction[], zoneFilter: string): DashboardZoneMember[] {
  const canonical = FIVE_S_ZONE_CONFIGURATION
    .filter((zone) => zoneFilter === "All" || zone.name === zoneFilter)
    .flatMap((zone) => zone.members.map((member) => ({ id: member.id, name: member.name })));
  const byId = new Map(canonical.map((member) => [member.id, member]));

  actions
    .filter((action) => zoneFilter === "All" || action.area === zoneFilter)
    .forEach((action) => {
      const name = action.responsiblePersonName ?? action.assignedTo;
      if (!name) return;
      const canonicalMember = canonical.find((member) => member.name === name);
      const id = action.responsiblePersonId ?? canonicalMember?.id ?? `name:${name}`;
      if (!byId.has(id)) byId.set(id, { id, name });
    });

  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function filterActionsByZoneMember(
  actions: MyAction[],
  memberId: string,
  members: DashboardZoneMember[]
) {
  if (memberId === "All") return actions;
  const selectedMember = members.find((member) => member.id === memberId);
  return actions.filter((action) => {
    if (action.responsiblePersonId) return action.responsiblePersonId === memberId;
    return Boolean(selectedMember && (action.responsiblePersonName === selectedMember.name || action.assignedTo === selectedMember.name));
  });
}

export function hasBeforeAfterEvidence(action: MyAction) {
  return Boolean(
    action.issueEvidence?.some((item) => item.type === "image" && item.url) ||
    action.evidence.some((item) => item.type === "image" && item.url)
  );
}

export function searchNCActions(actions: MyAction[], query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return actions;
  return actions.filter((action) =>
    `${action.id} ${action.auditId ?? action.sourceTitle} ${action.category ?? ""} ${action.area} ${action.responsiblePersonName ?? action.assignedTo} ${action.priority} ${getActionStatusLabel(action.status)}`
      .toLowerCase()
      .includes(search)
  );
}

export function selectActionsByIds(actions: MyAction[], selectedIds: string[]) {
  const selected = new Set(selectedIds);
  return actions.filter((action) => selected.has(action.id));
}
