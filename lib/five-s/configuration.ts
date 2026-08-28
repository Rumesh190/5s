export interface FiveSZoneMember { id: string; name: string; role: string }
export interface FiveSZoneConfiguration { name: string; code: string; leader: string; leaderId: string; department: string; members: FiveSZoneMember[] }

export const FIVE_S_ZONE_CONFIGURATION: FiveSZoneConfiguration[] = [
  { name: "Zone A", code: "ZA", leader: "Lakshman", leaderId: "USR-LAKSHMAN", department: "Production", members: [
    { id: "USR-RITIKA", name: "Ritika", role: "Zone Member" }, { id: "USR-JAMES", name: "James", role: "Zone Member" }, { id: "USR-VASANTH", name: "Vasanth", role: "Zone Member" }, { id: "USR-GURUMURTHI", name: "Gurumurthi", role: "Zone Member" }, { id: "USR-VENKATESAN", name: "Venkatesan", role: "Zone Member" },
  ] },
  { name: "Zone B", code: "ZB", leader: "Rumesh", leaderId: "USR-RUMESH", department: "Production", members: [
    { id: "USR-SIVA-KUMAR", name: "Siva Kumar", role: "Zone Member" }, { id: "USR-SUBURAMIANI", name: "Suburamiani", role: "Zone Member" }, { id: "USR-RAJ-KUMAR", name: "Raj Kumar", role: "Zone Member" }, { id: "USR-RAMAN", name: "Raman", role: "Zone Member" }, { id: "USR-ZEROME", name: "Zerome", role: "Zone Member" },
  ] },
  { name: "Zone C", code: "ZC", leader: "Manoj Guru", leaderId: "USR-MANOJ-GURU", department: "Production", members: [
    { id: "USR-MADAVAN", name: "Madavan", role: "Zone Member" }, { id: "USR-NASAR", name: "Nasar", role: "Zone Member" }, { id: "USR-PANDIYAN", name: "Pandiyan", role: "Zone Member" }, { id: "USR-MAHIYAS", name: "Mahiyas", role: "Zone Member" }, { id: "USR-AKILA", name: "Akila", role: "Zone Member" },
  ] },
  { name: "Zone D", code: "ZD", leader: "Anand", leaderId: "USR-ANAND", department: "Production", members: [
    { id: "USR-MEENA", name: "Meena", role: "Zone Member" }, { id: "USR-SURIYA", name: "Suriya", role: "Zone Member" }, { id: "USR-RAHUL", name: "Rahul", role: "Zone Member" }, { id: "USR-VIJAY", name: "Vijay", role: "Zone Member" }, { id: "USR-MOHAMMED", name: "Mohammed", role: "Zone Member" },
  ] },
];
export const FIVE_S_ACTION_CATEGORIES = [
  "Organization & Layout",
  "Cleanliness & Hygiene",
  "Standardization Lapses",
  "Equipment Maintenance",
  "Resource Management",
  "Training & Knowledge Gaps",
  "Environmental Sustainability",
  "Customer Satisfaction",
] as const;

export const FIVE_S_CORRECTIVE_ACTION_CATEGORIES = [
  "Add / Revise Process",
  "Checkpoints / Review",
  "Communication",
  "Correction of Documentation",
  "Create / Revise Procedure",
  "Design / Equipment Modification",
  "Education / Training",
  "Other",
  "Provide / Change Resources",
] as const;
export type FiveSActionPriority = "Low" | "Medium" | "High" | "Critical";
const PRIORITY_DUE_DATE_OFFSETS: Record<FiveSActionPriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
export function toLocalInputDate(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}` }
export function getPriorityDueDate(priority: FiveSActionPriority, today = new Date()): string { const dueDate = new Date(today.getFullYear(),today.getMonth(),today.getDate()); dueDate.setDate(dueDate.getDate()+PRIORITY_DUE_DATE_OFFSETS[priority]); return toLocalInputDate(dueDate) }
export function getFiveSZoneConfiguration(zoneName: string) { return FIVE_S_ZONE_CONFIGURATION.find((zone)=>zone.name===zoneName) }
export function getMembersForZone(zoneName: string): FiveSZoneMember[] { return getFiveSZoneConfiguration(zoneName)?.members ?? [] }
export function canAuditZone(user: { primaryZone: string }, zoneName: string) { return Boolean(zoneName && user.primaryZone !== zoneName) }
