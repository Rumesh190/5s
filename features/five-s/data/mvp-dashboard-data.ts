/** Deterministic presentation data used until dashboard analytics are API-backed. */
export const MVP_DASHBOARD_DATA = {
  summary: {
    totalAudits: 48,
    completedAudits: 39,
    draftAudits: 5,
    inProgressAudits: 4,
    averageScore: 82,
    openActions: 14,
    overdueActions: 4,
    completedActions: 31,
    nonCompliances: 27,
  },
  auditTrend: [
    { label: "Mar", value: 72, audits: 6 },
    { label: "Apr", value: 76, audits: 7 },
    { label: "May", value: 79, audits: 8 },
    { label: "Jun", value: 81, audits: 8 },
    { label: "Jul", value: 84, audits: 9 },
    { label: "Aug", value: 87, audits: 10 },
  ],
  zonePerformance: [
    { zone: "Zone A", score: 88, leader: "Siva Kumar" },
    { zone: "Zone D", score: 85, leader: "Suresh" },
    { zone: "Zone B", score: 81, leader: "Rumesh" },
    { zone: "Zone C", score: 76, leader: "Manoj Guru" },
  ],
  nonComplianceByZone: [
    { zone: "Zone A", Open: 4, Closed: 9 },
    { zone: "Zone B", Open: 6, Closed: 8 },
    { zone: "Zone C", Open: 8, Closed: 6 },
    { zone: "Zone D", Open: 5, Closed: 8 },
  ],
  improvementTrend: [
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "May", value: 5 },
    { label: "Jun", value: 5 },
    { label: "Jul", value: 6 },
    { label: "Aug", value: 8 },
  ],
} as const;
