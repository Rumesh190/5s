export const AUDIT_SCORE_LABELS: Record<0 | 1 | 2, string> = {
  0: "Non-Compliant",
  1: "Partially Compliant",
  2: "Fully Compliant",
};

export function getAuditScoreLabel(score: number) {
  return AUDIT_SCORE_LABELS[score as 0 | 1 | 2] ?? "Not answered";
}
