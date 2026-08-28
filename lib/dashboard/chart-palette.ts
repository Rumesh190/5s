export const CHART_COLORS = {
  positive: "var(--chart-positive)",
  warning: "var(--chart-warning)",
  critical: "var(--chart-critical)",
  information: "var(--chart-information)",
  secondary: "var(--chart-secondary)",
  supporting: "var(--chart-supporting)",
  attention: "var(--chart-attention)",
} as const;

export const CATEGORY_CHART_COLORS = [
  CHART_COLORS.information,
  CHART_COLORS.supporting,
  CHART_COLORS.positive,
  CHART_COLORS.warning,
  CHART_COLORS.secondary,
  CHART_COLORS.attention,
  CHART_COLORS.critical,
] as const;
