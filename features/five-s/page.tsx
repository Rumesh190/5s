"use client";

import { useState } from "react";

import FiveSAuditList from "./components/FiveSAuditList";
import FiveSAuditCreate from "./components/FiveSAuditCreate";
import FiveSAuditExecution from "./components/FiveSAuditExecution";

import {
  createFiveSAudit,
  deleteFiveSAudit,
  updateFiveSAudit,
  useFiveSAuditStore,
} from "@/lib/five-s/audit-store";

import type {
  FiveSAudit,
  FiveSCategory,
  FiveSQuestion,
  FiveSSection,
} from "./types/five-s";
import { referenceFields } from "@/lib/five-s/reference-guides";

/* =========================================================
   5S CHECKLIST
   =========================================================
   Total questions: 39

   Sort          = 7
   Set in Order  = 9
   Shine         = 8
   Standardize   = 7
   Sustain       = 8

   Total         = 39

   Score:
   2 points per question
   Maximum score = 78
   ========================================================= */

const FIVE_S_QUESTIONS: Record<
  FiveSCategory,
  string[]
> = {
  /* ---------------------------------------------------------
     SORT — 7
     --------------------------------------------------------- */

  Sort: [
    "Are unnecessary tools, materials, and items removed from the work area?",

    "Are obsolete or unused items clearly identified and segregated?",

    "Are only required materials stored at the workstation?",

    "Are damaged, defective, or redundant items identified and removed?",

    "Are excess raw materials and work-in-progress controlled to required quantities?",

    "Are red-tagged or unwanted items reviewed and disposed of within the defined timeframe?",

    "Is there a clear process for deciding whether an item is required or unnecessary?",
  ],

  /* ---------------------------------------------------------
     SET IN ORDER — 9
     --------------------------------------------------------- */

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

  /* ---------------------------------------------------------
     SHINE — 8
     --------------------------------------------------------- */

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

  /* ---------------------------------------------------------
     STANDARDIZE — 7
     --------------------------------------------------------- */

  Standardize: [
    "Are standard 5S procedures available and followed?",

    "Are visual standards available for the work area?",

    "Are cleaning and inspection responsibilities clearly defined?",

    "Are standard locations, markings, labels, and color codes consistently maintained?",

    "Are 5S standards displayed or easily accessible to employees?",

    "Are standard cleaning, inspection, and workplace organization schedules followed?",

    "Are deviations from the defined 5S standards identified and corrected?",
  ],

  /* ---------------------------------------------------------
     SUSTAIN — 8
     --------------------------------------------------------- */

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

/* =========================================================
   CATEGORY DESCRIPTIONS
   ========================================================= */

const FIVE_S_DESCRIPTIONS: Record<
  FiveSCategory,
  string
> = {
  Sort:
    "Remove unnecessary items from the workplace and keep only what is required.",

  "Set in Order":
    "Arrange required items so they are easy to identify, access, and return.",

  Shine:
    "Keep the workplace, equipment, and surrounding areas clean and maintained.",

  Standardize:
    "Establish consistent standards for workplace organization and cleanliness.",

  Sustain:
    "Maintain 5S practices through discipline, monitoring, and continuous improvement.",
};

/* =========================================================
   CREATE QUESTIONS
   ========================================================= */

function createQuestions(
  category: FiveSCategory
): FiveSQuestion[] {
  return FIVE_S_QUESTIONS[category].map(
    (question, index) => ({
      id: `Q-${category
        .toUpperCase()
        .replace(/\s+/g, "-")}-${String(
        index + 1
      ).padStart(3, "0")}`,

      category,

      question,

      description:
        `Assess the workplace against the defined ${category} requirement.`,

      maxScore: 2,

      score: null,

      status: "Not Started",

      observation: "",

      evidence: [],

      actionRequired: false,
    })
  );
}

/* =========================================================
   CREATE EMPTY 5S SECTIONS
   ========================================================= */

function createEmptyFiveSSections(): FiveSSection[] {
  const sectionDefinitions: Array<{
    category: FiveSCategory;
    description: string;
    questions: string[];
  }> = [
    {
      category: "Sort",
      description:
        "Remove unnecessary items from the workplace and keep only what is required.",
      questions: [
        "Are unnecessary materials/items removed from the workplace?",
        "Are obsolete tools/equipment identified and removed?",
        "Are excess raw materials identified and controlled?",
        "Are rejected/scrap materials segregated?",
        "Are red-tagged items properly identified?",
        "Are unused documents/forms removed?",
        "Are personal items restricted to designated locations?",
      ],
    },

    {
      category: "Set in Order",
      description:
        "Arrange required items so they are easy to identify, access, and return.",
      questions: [
        "Does every frequently used item have a designated location?",
        "Are locations clearly identified?",
        "Are tools arranged for easy retrieval?",
        "Are storage locations visually marked?",
        "Are material quantities/limits identified?",
        "Are walkways clearly marked?",
        "Are emergency equipment locations identified?",
        "Are WIP locations clearly defined?",
        "Are fixtures/jigs stored systematically?",
      ],
    },

    {
      category: "Shine",
      description:
        "Keep the workplace, equipment, and surrounding areas clean and maintained.",
      questions: [
        "Is the workplace clean?",
        "Are machines/equipment free from excessive dirt/oil?",
        "Are cleaning responsibilities defined?",
        "Are cleaning schedules available?",
        "Are leaks/spills addressed immediately?",
        "Are cleaning tools properly stored?",
        "Does cleaning include inspection for abnormalities?",
        "Are waste bins properly maintained?",
      ],
    },

    {
      category: "Standardize",
      description:
        "Establish consistent standards for workplace organization and cleanliness.",
      questions: [
        "Are 5S standards displayed at the workplace?",
        "Are cleaning standards defined?",
        "Are responsibilities clearly assigned?",
        "Are standard photographs available?",
        "Are visual management standards followed?",
        "Are abnormal conditions clearly identified?",
        "Are standards periodically reviewed?",
      ],
    },

    {
      category: "Sustain",
      description:
        "Maintain 5S practices through discipline, monitoring, and continuous improvement.",
      questions: [
        "Are employees following defined 5S standards?",
        "Are previous audit findings closed?",
        "Are repeat findings controlled?",
        "Are periodic 5S audits conducted?",
        "Are employees trained in 5S?",
        "Are improvement ideas encouraged?",
        "Is 5S performance communicated to employees?",
        "Are 5S responsibilities actively maintained?",
      ],
    },
  ];

  const createdAt = Date.now();

  return sectionDefinitions.map(
    (section, sectionIndex) => {
      const questions: FiveSQuestion[] =
        section.questions.map(
          (questionText, questionIndex) => ({
            id: `Q-${createdAt}-${sectionIndex}-${questionIndex + 1}`,
            category: section.category,
            question: questionText,
            description:
              "Assess the workplace against the defined 5S requirement.",
            maxScore: 2,
            score: null,
            status: "Not Started",
            observation: "",
            evidence: [],
            actionRequired: false,
            ...referenceFields(section.category, questionIndex),
          })
        );

      return {
        category: section.category,
        description: section.description,
        questions,
        score: 0,
        maxScore: questions.reduce(
          (total, question) =>
            total + question.maxScore,
          0
        ),
      };
    }
  );
}
/* =========================================================
   PAGE
   ========================================================= */

export default function FiveSPage() {
  const audits =
    useFiveSAuditStore();

  const [
    selectedAudit,
    setSelectedAudit,
  ] = useState<FiveSAudit | null>(
    null
  );

  const [
    isCreatingAudit,
    setIsCreatingAudit,
  ] = useState(false);

  /* =======================================================
     START AUDIT
     ======================================================= */

  function handleStartAudit() {
    setSelectedAudit(null);

    setIsCreatingAudit(true);
  }

  /* =======================================================
     CREATE AUDIT
     ======================================================= */

  function handleCreateAudit(input: {
    title: string;
    plant: string;
    department: string;
    area: string;
    auditor: string;
    dueDate: string;
  }) {
    const sections =
      createEmptyFiveSSections();

    const audit =
      createFiveSAudit({
        title: input.title,

        plant: input.plant,

        department:
          input.department,

        area: input.area,

        auditor: input.auditor,

        dueDate: input.dueDate,

        sections,
      });

    setIsCreatingAudit(false);

    setSelectedAudit(audit);
  }

  /* =======================================================
     VIEW AUDIT
     ======================================================= */

  function handleViewAudit(
    audit: FiveSAudit
  ) {
    setIsCreatingAudit(false);

    setSelectedAudit(audit);
  }

  /* =======================================================
     UPDATE AUDIT
     ======================================================= */

  function handleAuditUpdate(
    updatedAudit: FiveSAudit
  ) {
    updateFiveSAudit(
      updatedAudit.id,
      updatedAudit
    );

    setSelectedAudit(
      updatedAudit
    );
  }

  /* =======================================================
     DELETE AUDIT
     ======================================================= */

  function handleDeleteAudit(
    audit: FiveSAudit
  ) {
    deleteFiveSAudit(
      audit.id
    );

    if (
      selectedAudit?.id ===
      audit.id
    ) {
      setSelectedAudit(null);
    }

    setIsCreatingAudit(false);
  }

  /* =======================================================
     COMPLETE AUDIT
     ======================================================= */

  function handleCompleteAudit(
    completedAudit: FiveSAudit
  ) {
    updateFiveSAudit(
      completedAudit.id,
      completedAudit
    );

    setSelectedAudit(null);

    setIsCreatingAudit(false);
  }

  /* =======================================================
     BACK
     ======================================================= */

  function handleBackToDashboard() {
    setSelectedAudit(null);

    setIsCreatingAudit(false);
  }

  /* =======================================================
     CREATE SCREEN
     ======================================================= */

  if (isCreatingAudit) {
    return (
      <FiveSAuditCreate
        onBack={
          handleBackToDashboard
        }
        onStart={
          handleCreateAudit
        }
      />
    );
  }

  /* =======================================================
     AUDIT EXECUTION
     ======================================================= */

  if (selectedAudit) {
    return (
      <div className="grid gap-6">
        <FiveSAuditExecution
          audit={selectedAudit}
          onBack={
            handleBackToDashboard
          }
          onComplete={
            handleCompleteAudit
          }
        />
      </div>
    );
  }

  /* =======================================================
     5S AUDIT LIST
     ======================================================= */

  return (
    <div className="flex flex-1 flex-col px-6 py-6 lg:px-8">
      <FiveSAuditList
        audits={audits}
        onStartAudit={
          handleStartAudit
        }
        onViewAudit={
          handleViewAudit
        }
        onDeleteAudit={
          handleDeleteAudit
        }
      />
    </div>
  );
}
