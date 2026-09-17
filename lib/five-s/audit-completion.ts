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
