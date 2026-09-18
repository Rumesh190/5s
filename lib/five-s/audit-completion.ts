export function isAuditQuestionComplete(
  question: { id: string },
  state?: {
    score: number | null;
    observation: string;
    actionId?: string;
    evidence: unknown[];
  },
) {
  if (!state || state.score === null) return false;
  if (state.score === 0 || state.score === 1) {
    return Boolean(state.observation.trim() && state.actionId && state.evidence.length > 0);
  }
  return true;
}

export function didRequiredAnswersBecomeComplete(
  questionIds: string[],
  previous: Record<string, boolean> | null,
  current: Record<string, boolean>,
): boolean {
  if (!previous || questionIds.length === 0) return false;
  const wasComplete = questionIds.every((questionId) => previous[questionId]);
  const isComplete = questionIds.every((questionId) => current[questionId]);
  return !wasComplete && isComplete;
}

export function getPendingRequiredQuestionIds(
  questions: Array<{ id: string; required?: boolean }>,
  completion: Record<string, boolean>,
) {
  return questions
    .filter((question) => question.required !== false && !completion[question.id])
    .map((question) => question.id);
}
