/** Formats a `daysAgo` count (see AuditRecord) as human-readable relative text. */
export function formatDaysAgo(daysAgo: number): string {
  if (daysAgo <= 0) return "Today"
  if (daysAgo === 1) return "Yesterday"
  return `${daysAgo} days ago`
}
