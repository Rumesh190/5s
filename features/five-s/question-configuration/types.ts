import type { FiveSCategory, FiveSQuestionReference } from "@/features/five-s/types/five-s";

export interface QuestionDefinition {
  id: string;
  sectionId: FiveSCategory;
  questionText: string;
  required: boolean;
  referenceGuide: FiveSQuestionReference;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionDefinitionInput {
  questionText: string;
  required: boolean;
  referenceGuide: FiveSQuestionReference;
}
