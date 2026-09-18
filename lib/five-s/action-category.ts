import type { MyAction } from "@/features/five-s/types/my-actions";

type ActionCategoryFields = Pick<MyAction, "actionCategory" | "customActionCategory">;

export function getActionCategoryDisplay(
  action: ActionCategoryFields,
  fallback = "—"
) {
  if (action.actionCategory === "Other") {
    return action.customActionCategory?.trim() || "Other";
  }

  return action.actionCategory?.trim() || fallback;
}

export function getCustomActionCategory(
  actionCategory: string,
  customActionCategory: string
) {
  return actionCategory === "Other"
    ? customActionCategory.trim() || undefined
    : undefined;
}

export function isActionCategoryValid(
  actionCategory: string,
  customActionCategory: string
) {
  return Boolean(
    actionCategory &&
      (actionCategory !== "Other" || customActionCategory.trim())
  );
}
