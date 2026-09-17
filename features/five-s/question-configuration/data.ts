import { FIVE_S_CATEGORIES } from "@/features/five-s/data/five-s-data";
import type { FiveSCategory } from "@/features/five-s/types/five-s";
import { referenceFields } from "@/lib/five-s/reference-guides";
import type { QuestionDefinition } from "./types";

export const DEFAULT_FIVE_S_QUESTION_TEXT: Record<FiveSCategory, string[]> = {
  Sort: [
    "Are unnecessary tools, materials, and items removed from the work area?",
    "Are obsolete or unused items clearly identified and segregated?",
    "Are only required materials stored at the workstation?",
    "Are damaged, defective, or redundant items identified and removed?",
    "Are excess raw materials and work-in-progress controlled to required quantities?",
    "Are red-tagged or unwanted items reviewed and disposed of within the defined timeframe?",
    "Is there a clear process for deciding whether an item is required or unnecessary?",
  ],
  "Set in Order": [
    "Are tools and materials stored in clearly identified locations?",
    "Are storage locations visually marked and easy to identify?",
    "Can frequently used items be accessed without unnecessary movement?",
    "Are tools and materials arranged according to frequency of use?",
    "Are floor markings, location markings, and labels clearly visible?",
    "Are shadow boards, racks, cabinets, or storage systems properly organized?",
    "Does every required item have a defined and designated storage location?",
    "Are items returned to their designated locations after use?",
    "Are aisles, walkways, emergency routes, and access areas clearly identified and kept unobstructed?",
  ],
  Shine: [
    "Is the work area clean and free from visible dirt and waste?",
    "Are machines and equipment maintained in a clean condition?",
    "Are abnormal conditions identified during cleaning activities?",
    "Are floors, work surfaces, and surrounding areas cleaned regularly?",
    "Are oil, coolant, grease, dust, and other contamination controlled?",
    "Are cleaning tools and materials themselves clean, organized, and properly stored?",
    "Are leaks, damage, loose parts, or other abnormalities reported and addressed?",
    "Are cleaning and inspection activities performed according to the defined schedule?",
  ],
  Standardize: [
    "Are standard 5S procedures available and followed?",
    "Are visual standards available for the work area?",
    "Are cleaning and inspection responsibilities clearly defined?",
    "Are standard locations, markings, labels, and color codes consistently maintained?",
    "Are 5S standards displayed or easily accessible to employees?",
    "Are standard cleaning, inspection, and workplace organization schedules followed?",
    "Are deviations from the defined 5S standards identified and corrected?",
  ],
  Sustain: [
    "Are 5S practices consistently followed by employees?",
    "Are regular 5S audits conducted according to the defined schedule?",
    "Are previous audit findings reviewed and closed within the required timeframe?",
    "Are employees aware of their 5S responsibilities?",
    "Are recurring 5S problems identified and addressed?",
    "Are 5S improvements communicated to the relevant employees?",
    "Is management or area ownership involved in maintaining 5S standards?",
    "Is continuous improvement encouraged based on 5S audit findings?",
  ],
};

const ID_PREFIX: Record<FiveSCategory, string> = {
  Sort: "SORT",
  "Set in Order": "ORDER",
  Shine: "SHINE",
  Standardize: "STD",
  Sustain: "SUS",
};

const DEFAULT_TIMESTAMP = "2026-09-17T00:00:00.000Z";

export const DEFAULT_QUESTION_DEFINITIONS: QuestionDefinition[] = FIVE_S_CATEGORIES.flatMap((sectionId) =>
  DEFAULT_FIVE_S_QUESTION_TEXT[sectionId].map((questionText, index) => {
    const reference = referenceFields(sectionId, index).reference;
    if (!reference) throw new Error(`Reference guide missing for ${sectionId} question ${index + 1}.`);
    return {
      id: `Q-${ID_PREFIX[sectionId]}-${String(index + 1).padStart(3, "0")}`,
      sectionId,
      questionText,
      required: true,
      referenceGuide: reference,
      displayOrder: index + 1,
      active: true,
      createdAt: DEFAULT_TIMESTAMP,
      updatedAt: DEFAULT_TIMESTAMP,
    };
  }),
);
