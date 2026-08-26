/**
 * Mock master data for the Create Audit form. No backend exists yet — this
 * stands in for GET /api/v1/master/{regions,plants,departments} (see
 * docs/02_Engineering/21_API_Contracts.md) until that's implemented.
 */

export interface PlantRecord {
  id: string
  name: string
  region: string
  city: string
}

export interface AuditorRecord {
  id: string
  name: string
  role: string
  plant: string
}

export const REGIONS = ["South India", "North India", "East India", "West India"] as const

export const PLANTS: PlantRecord[] = [
  { id: "chennai", name: "Chennai Plant", region: "South India", city: "Chennai" },
  { id: "coimbatore", name: "Coimbatore Plant", region: "South India", city: "Coimbatore" },
  { id: "hosur", name: "Hosur Plant", region: "South India", city: "Hosur" },
  { id: "sriperumbudur", name: "Sriperumbudur Plant", region: "South India", city: "Sriperumbudur" },
  { id: "bengaluru", name: "Bengaluru Plant", region: "South India", city: "Bengaluru" },
  { id: "mysuru", name: "Mysuru Plant", region: "South India", city: "Mysuru" },
  { id: "hyderabad", name: "Hyderabad Plant", region: "South India", city: "Hyderabad" },
  { id: "gurugram", name: "Gurugram Plant", region: "North India", city: "Gurugram" },
  { id: "kolkata", name: "Kolkata Plant", region: "East India", city: "Kolkata" },
  { id: "pune", name: "Pune Plant", region: "West India", city: "Pune" },
]

export const DEPARTMENTS = [
  "Assembly",
  "Quality",
  "Welding",
  "Paint Shop",
  "Warehouse",
  "Maintenance",
] as const

export const PRODUCTION_LINES = [
  "Line 1",
  "Line 2",
  "Line 3",
  "Line 4",
  "Assembly Cell A",
  "Assembly Cell B",
  "Weld Cell 1",
  "Weld Cell 2",
] as const

export const AUDIT_TYPES = [
  "Process Audit",
  "Product Audit",
  "Safety Audit",
  "Supplier Audit",
  "Quality Audit",
] as const

export const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const

export const AUDITORS: AuditorRecord[] = [
  { id: "arun-kumar", name: "Arun Kumar", role: "Quality Engineer", plant: "Chennai Plant" },
  { id: "priya-singh", name: "Priya Singh", role: "Quality Engineer", plant: "Chennai Plant" },
  { id: "meera-alvarez", name: "Meera Alvarez", role: "Quality Engineer", plant: "Sriperumbudur Plant" },
  { id: "karthik-rao", name: "Karthik Rao", role: "Quality Engineer", plant: "Mysuru Plant" },
  { id: "sara-iyer", name: "Sara Iyer", role: "Production Supervisor", plant: "Hosur Plant" },
  { id: "vivek-nair", name: "Vivek Nair", role: "Production Supervisor", plant: "Hyderabad Plant" },
  { id: "ananya-rao", name: "Ananya Rao", role: "Quality Engineer", plant: "Coimbatore Plant" },
  { id: "rahul-mehta", name: "Rahul Mehta", role: "Production Supervisor", plant: "Bengaluru Plant" },
]

// Placeholder session user — same as components/navigation/user-menu.tsx —
// until the Authentication feature wires up a real session.
export const CURRENT_USER = AUDITORS[0]

export function plantsForRegion(region: string): PlantRecord[] {
  return PLANTS.filter((plant) => plant.region === region)
}

export function cityForPlant(plantName: string): string | undefined {
  return PLANTS.find((plant) => plant.name === plantName)?.city
}
