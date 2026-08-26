"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  FileBarChart,
  Maximize2,
  Minus,
  Plus,
  Save,
  Upload,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FiveSPageHeader from "./FiveSPageHeader";

import { createAction, getActionById, updateAction } from "@/lib/actions/action-store";
import { updateFiveSAudit } from "@/lib/five-s/audit-store";
import { useCurrentUser } from "@/lib/current-user";
import {
  FIVE_S_ACTION_CATEGORIES,
  getFiveSZoneConfiguration,
  getPriorityDueDate,
  toLocalInputDate,
  type FiveSActionPriority,
} from "@/lib/five-s/configuration";

import type {
  FiveSAudit,
  FiveSCategory,
  FiveSEvidence,
  FiveSQuestion,
  FiveSQuestionStatus,
  FiveSSection,
} from "../types/five-s";

interface FiveSAuditExecutionProps {
  audit: FiveSAudit;
  onBack?: () => void;
  onComplete?: (audit: FiveSAudit) => void;
}

interface QuestionState {
  status: FiveSQuestionStatus;
  score: number | null;
  observation: string;

  actionRequired: boolean;
  actionId?: string;

  actionTitle: string;
  actionDescription: string;
  actionCategory: string;

  assignedTo: string;
  responsiblePersonId: string;

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

  dueDate: string;

  evidence: FiveSEvidence[];
}

const CATEGORY_ORDER: FiveSCategory[] = [
  "Sort",
  "Set in Order",
  "Shine",
  "Standardize",
  "Sustain",
];

const SCORE_OPTIONS = [0, 1, 2];

const SCORE_LABELS: Record<
  number,
  string
> = {
  0: "Non Compliance",
  1: "Partially Compliance",
  2: "Fully Compliance",
};

const SCORE_STYLES: Record<
  number,
  string
> = {
  0:
    "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
  1:
    "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  2:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
};

const SCORE_SELECTED_STYLES: Record<
  number,
  string
> = {
  0:
    "border-red-500 bg-red-50 text-red-700 shadow-[inset_0_0_0_1px_rgb(239_68_68/0.08)] dark:border-red-500/70 dark:bg-red-500/10 dark:text-red-300",
  1:
    "border-amber-500 bg-amber-50 text-amber-700 shadow-[inset_0_0_0_1px_rgb(245_158_11/0.08)] dark:border-amber-500/70 dark:bg-amber-500/10 dark:text-amber-300",
  2:
    "border-green-500 bg-green-50 text-green-700 shadow-[inset_0_0_0_1px_rgb(34_197_94/0.08)] dark:border-green-500/70 dark:bg-green-500/10 dark:text-green-300",
};

const SCORE_OPTION_STYLES: Record<number, string> = {
  0: "border-border/80 hover:border-red-300 hover:bg-red-50/40 dark:hover:border-red-500/35 dark:hover:bg-red-500/5",
  1: "border-border/80 hover:border-amber-300 hover:bg-amber-50/40 dark:hover:border-amber-500/35 dark:hover:bg-amber-500/5",
  2: "border-border/80 hover:border-green-300 hover:bg-green-50/40 dark:hover:border-green-500/35 dark:hover:bg-green-500/5",
};

const SCORE_INDICATOR_STYLES: Record<number, string> = {
  0: "border-red-300 bg-red-50 text-red-700 dark:border-red-500/35 dark:bg-red-500/10 dark:text-red-300",
  1: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/35 dark:bg-amber-500/10 dark:text-amber-300",
  2: "border-green-300 bg-green-50 text-green-700 dark:border-green-500/35 dark:bg-green-500/10 dark:text-green-300",
};

function formatEvidenceSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getEvidenceFileLabel(evidence: FiveSEvidence) {
  const extension = evidence.name.split(".").pop();

  if (extension && extension !== evidence.name) {
    return extension.toUpperCase();
  }

  return evidence.type === "image" ? "Image" : "Document";
}

function isPdfEvidence(evidence: FiveSEvidence) {
  return evidence.name.toLowerCase().endsWith(".pdf") ||
    evidence.dataUrl.startsWith("data:application/pdf");
}

function createInitialQuestionState(
  question: FiveSQuestion
): QuestionState {
  return {
    status: question.status,
    score: question.score,

    observation:
      question.observation ?? "",

    actionRequired:
      question.actionRequired,

    actionId:
      question.actionId,

    actionTitle: "",

    actionDescription:
      question.observation ?? "",
    actionCategory: "",

    assignedTo: "",
    responsiblePersonId: "",

    priority: "Medium",

    dueDate: getPriorityDueDate("Medium"),

    evidence:
      question.evidence ?? [],
  };
}

/**
 * Convert score into the existing FiveSQuestionStatus
 * expected by the existing data model.
 *
 * 0 / 1 => Fail
 * 2     => Pass
 * null  => Not Started
 */
function getStatusFromScore(
  score: number | null
): FiveSQuestionStatus {
  if (score === null) {
    return "Not Started";
  }

  if (score === 2) {
    return "Pass";
  }

  return "Fail";
}

function FiveSAuditExecution({
  audit,
  onBack,
  onComplete,
}: FiveSAuditExecutionProps) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const initialSections = useMemo<
    FiveSSection[]
  >(
    () =>
      audit.sections
        .map((section) => ({
          ...section,

          questions:
            section.questions.map(
              (question) => ({
                ...question,

                evidence:
                  question.evidence ?? [],
              })
            ),
        }))
        .sort(
          (a, b) =>
            CATEGORY_ORDER.indexOf(
              a.category
            ) -
            CATEGORY_ORDER.indexOf(
              b.category
            )
        ),
    [audit]
  );

  const [
    sections,
    setSections,
  ] =
    useState<FiveSSection[]>(
      initialSections
    );

  const [
    questionStates,
    setQuestionStates,
  ] =
    useState<
      Record<string, QuestionState>
    >(() => {
      const state: Record<
        string,
        QuestionState
      > = {};

      initialSections.forEach(
        (section) => {
          section.questions.forEach(
            (question) => {
              state[question.id] =
                createInitialQuestionState(
                  question
                );
            }
          );
        }
      );

      return state;
    });

  const [
    activeSectionIndex,
    setActiveSectionIndex,
  ] = useState(0);

  const [
    activeQuestionIndex,
    setActiveQuestionIndex,
  ] = useState(0);
  const [navigationDirection, setNavigationDirection] = useState<"forward" | "backward">("forward");

  const [
    showReview,
    setShowReview,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const [
    showActionDialog,
    setShowActionDialog,
  ] = useState(false);

  const [showCompleteConfirmation, setShowCompleteConfirmation] =
    useState(false);

  const [
    activeActionQuestion,
    setActiveActionQuestion,
  ] =
    useState<FiveSQuestion | null>(
      null
    );

  const [
    actionSaving,
    setActionSaving,
  ] = useState(false);

  const [
    previewEvidence,
    setPreviewEvidence,
  ] = useState<FiveSEvidence | null>(null);

  const [previewZoom, setPreviewZoom] =
    useState(1);

  const previewRef =
    useRef<HTMLDivElement | null>(null);



  const fileInputRefs =
    useRef<
      Record<
        string,
        HTMLInputElement | null
      >
    >({});

  const cameraInputRefs =
    useRef<
      Record<
        string,
        HTMLInputElement | null
      >
    >({});

  const questionScrollRef =
    useRef<HTMLDivElement | null>(null);

  const activeSection =
    sections[activeSectionIndex];

  const activeQuestion =
    activeSection?.questions[activeQuestionIndex];

  const isLastQuestion = Boolean(
    activeSection &&
    activeQuestionIndex === activeSection.questions.length - 1
  );

  const isLastSection =
    activeSectionIndex === sections.length - 1;

  const allQuestions = useMemo(
    () =>
      sections.flatMap(
        (section) =>
          section.questions
      ),
    [sections]
  );

  const answeredQuestions =
    allQuestions.filter(
      (question) =>
        questionStates[question.id]
          ?.score !== null
    ).length;

  const questionsRequiringActions =
    allQuestions.filter(
      (question) => {
        const state =
          questionStates[
            question.id
          ];

        return (
          state?.score === 0 ||
          state?.score === 1
        );
      }
    ).length;

  const questionsWithActions =
    allQuestions.filter(
      (question) =>
        questionStates[
          question.id
        ]?.actionId
    ).length;

  const completionPercentage =
    allQuestions.length > 0
      ? Math.round(
          (answeredQuestions /
            allQuestions.length) *
            100
        )
      : 0;

  const auditReadyForCompletion =
    allQuestions.length > 0 && answeredQuestions === allQuestions.length;

  const totalMaxScore =
    allQuestions.length * 2;

  const totalScore =
    allQuestions.reduce(
      (total, question) => {
        const state =
          questionStates[
            question.id
          ];

        return (
          total +
          (state?.score ?? 0)
        );
      },
      0
    );

  const scorePercentage =
    totalMaxScore > 0
      ? Math.round(
          (totalScore /
            totalMaxScore) *
            100
        )
      : 0;

  /**
   * ---------------------------------------------------------
   * SECTION LOCKING
   * ---------------------------------------------------------
   */

  function isQuestionComplete(
    question: FiveSQuestion
  ) {
    const state =
      questionStates[
        question.id
      ];

    if (!state || state.score === null) {
      return false;
    }

    if (
      (state.score === 0 ||
        state.score === 1) &&
      !state.observation.trim()
    ) {
      return false;
    }

    if (
      (state.score === 0 ||
        state.score === 1) &&
      !state.actionId
    ) {
      return false;
    }

    if (
      (state.score === 0 || state.score === 1) &&
      state.evidence.length === 0
    ) {
      return false;
    }

    return true;
  }

  function isSectionComplete(
    section: FiveSSection
  ) {
    return section.questions.every(
      (question) =>
        isQuestionComplete(
          question
        )
    );
  }

  function isSectionUnlocked(
    index: number
  ) {
    if (index === 0) {
      return true;
    }

    return isSectionComplete(
      sections[index - 1]
    );
  }

  /**
   * ---------------------------------------------------------
   * QUESTION UPDATE
   * ---------------------------------------------------------
   */

  function updateQuestionState(
    questionId: string,
    updates: Partial<QuestionState>
  ) {
    setQuestionStates(
      (current) => ({
        ...current,

        [questionId]: {
          ...current[
            questionId
          ],
          ...updates,
        },
      })
    );

    setSections(
      (currentSections) =>
        currentSections.map(
          (section) => ({
            ...section,

            questions:
              section.questions.map(
                (question) => {
                  if (
                    question.id !==
                    questionId
                  ) {
                    return question;
                  }

                  const nextScore =
                    updates.score !==
                    undefined
                      ? updates.score
                      : question.score;

                  return {
                    ...question,

                    score:
                      nextScore,

                    status:
                      updates.status ??
                      getStatusFromScore(
                        nextScore
                      ),

                    observation:
                      updates.observation !==
                      undefined
                        ? updates.observation
                        : question.observation,

                    actionRequired:
                      updates.actionRequired ??
                      question.actionRequired,

                    actionId:
                      updates.actionId ??
                      question.actionId,

                    evidence:
                      updates.evidence ??
                      question.evidence ??
                      [],
                  };
                }
              ),
          })
        )
    );
  }

  /**
   * ---------------------------------------------------------
   * SCORE
   * ---------------------------------------------------------
   */

  function handleScoreChange(
    question: FiveSQuestion,
    score: number
  ) {
    const safeScore =
      Math.max(
        0,
        Math.min(2, score)
      );

    const requiresAction =
      safeScore === 0 ||
      safeScore === 1;

    updateQuestionState(
      question.id,
      {
        score: safeScore,

        status:
          getStatusFromScore(
            safeScore
          ),

        actionRequired:
          requiresAction ||
          Boolean(
            questionStates[
              question.id
            ]?.actionId
          ),
      }
    );
  }

  /**
   * ---------------------------------------------------------
   * OBSERVATION
   * ---------------------------------------------------------
   */

  function handleObservationChange(
    questionId: string,
    observation: string
  ) {
    updateQuestionState(
      questionId,
      {
        observation,

        actionDescription:
          observation ||
          questionStates[
            questionId
          ]
            ?.actionDescription ||
          "",
      }
    );
  }

  /**
   * ---------------------------------------------------------
   * ACTION DIALOG
   * ---------------------------------------------------------
   */

  function openActionDialog(
    question: FiveSQuestion
  ) {
    const currentState = questionStates[question.id];
    const existingAction = currentState?.actionId ? getActionById(currentState.actionId) : undefined;
    if (existingAction) {
      updateQuestionState(question.id, {
        actionTitle: existingAction.title,
        actionDescription: existingAction.description,
        actionCategory: existingAction.actionCategory ?? "",
        priority: existingAction.priority,
        dueDate: existingAction.dueDate,
        evidence: (existingAction.issueEvidence ?? []).map((evidence) => ({ id: evidence.id, name: evidence.name, type: evidence.type, size: 0, dataUrl: evidence.url ?? "", uploadedAt: evidence.uploadedAt, uploadedBy: evidence.uploadedBy })),
      });
    }
    setActiveActionQuestion(
      question
    );

    setShowActionDialog(true);
  }

  function closeActionDialog() {
    if (actionSaving) {
      return;
    }

    setShowActionDialog(false);
    setActiveActionQuestion(
      null
    );
  }

  async function handleCreateAction() {
    if (
      !activeActionQuestion
    ) {
      return;
    }

    const question =
      activeActionQuestion;

    const state =
      questionStates[
        question.id
      ];

    if (!state) {
      return;
    }

    const today = toLocalInputDate(new Date());

    if (
      !state.actionTitle.trim() ||
      !state.actionCategory ||
      !state.dueDate ||
      state.dueDate < today ||
      ((state.score === 0 || state.score === 1) && state.evidence.length === 0)
    ) {
      return;
    }

    const section =
      sections.find((item) =>
        item.questions.some(
          (itemQuestion) =>
            itemQuestion.id ===
            question.id
        )
      );

    if (!section) {
      return;
    }

    setActionSaving(true);

    const title =
      state.actionTitle.trim() ||
      state.observation.trim() ||
      `Corrective action required for ${section.category}`;

    const description =
      state.actionDescription.trim() ||
      state.observation.trim() ||
      question.question;

    if (state.actionId) {
      const existingAction = getActionById(state.actionId);
      if (existingAction?.status !== "Awaiting Assignment") {
        setActionSaving(false);
        closeActionDialog();
        return;
      }
      updateAction(state.actionId, {
        title,
        description,
        actionCategory: state.actionCategory,
        priority: state.priority,
        dueDate: state.dueDate,
        originalFinding: state.observation,
        issueEvidence: state.evidence.map((evidence) => ({ id: evidence.id, actionId: state.actionId, evidenceType: "finding" as const, name: evidence.name, type: evidence.type, uploadedAt: evidence.uploadedAt, uploadedBy: evidence.uploadedBy, url: evidence.dataUrl })),
      });
      window.setTimeout(() => { setActionSaving(false); setShowActionDialog(false); setActiveActionQuestion(null); }, 220);
      return;
    }

    const action =
      createAction({
        auditId: audit.id,
        questionId: question.id,
        questionText: question.question,
        sectionId: section.category,
        zoneId: audit.area,

        title,
        description,

        source: "5S Audit",

        sourceTitle:
          audit.title,

        category:
          section.category,

        plant:
          audit.plant,

        department:
          audit.department,

        area:
          audit.area,

        assignedTo: "",
        actionCategory: state.actionCategory,
        zoneLeaderId: getFiveSZoneConfiguration(audit.area)?.leaderId,
        zoneLeaderName: getFiveSZoneConfiguration(audit.area)?.leader,
        createdByUserId: currentUser.id,
        createdByName: currentUser.name,

        auditor:
          audit.auditor,

        status: "Awaiting Assignment",

        priority:
          state.priority,

        dueDate:
          state.dueDate,

        issueEvidence: state.evidence.map(
          (evidence) => ({
            id: evidence.id,
            evidenceType: "finding" as const,
            name: evidence.name,
            type: evidence.type,
            uploadedAt: evidence.uploadedAt,
            uploadedBy: evidence.uploadedBy,
            url: evidence.dataUrl,
          })
        ),
      });

    updateQuestionState(
      question.id,
      {
        actionRequired: true,
        actionId: action.id,
      }
    );

    window.setTimeout(() => {
      setActionSaving(false);
      setShowActionDialog(false);
      setActiveActionQuestion(
        null
      );
    }, 250);
  }

  /**
   * ---------------------------------------------------------
   * EVIDENCE
   * ---------------------------------------------------------
   */

  async function createEvidenceFromFile(
    questionId: string,
    file: File
  ) {
    const reader =
      new FileReader();

    reader.onload = () => {
      const dataUrl =
        typeof reader.result ===
        "string"
          ? reader.result
          : "";

      if (!dataUrl) {
        return;
      }

      const evidence:
        FiveSEvidence = {
        id: `EV-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

        name: file.name,

        type:
          file.type.startsWith(
            "image/"
          )
            ? "image"
            : "document",

        size: file.size,

        dataUrl,

        uploadedAt:
          new Date()
            .toISOString(),

        uploadedBy:
          currentUser.name,
      };

      const current =
        questionStates[
          questionId
        ]?.evidence ?? [];

      const nextEvidence = [
        ...current,
        evidence,
      ];

      updateQuestionState(
        questionId,
        {
          evidence: nextEvidence,
        }
      );

      const actionId =
        questionStates[
          questionId
        ]?.actionId;

      if (actionId) {
        updateAction(
          actionId,
          {
            issueEvidence:
              nextEvidence.map(
                (item) => ({
                  id: item.id,
                  actionId,
                  evidenceType: "finding" as const,
                  name: item.name,
                  type: item.type,
                  uploadedAt:
                    item.uploadedAt,
                  uploadedBy:
                    item.uploadedBy,
                  url: item.dataUrl,
                })
              ),
          }
        );
      }
    };

    reader.readAsDataURL(file);
  }

  function handleEvidenceUpload(
    questionId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    void createEvidenceFromFile(
      questionId,
      file
    );

    event.target.value = "";
  }

  function removeEvidence(
    questionId: string,
    evidenceId: string
  ) {
    const current =
      questionStates[
        questionId
      ]?.evidence ?? [];

    const nextEvidence =
      current.filter(
        (item) =>
          item.id !==
          evidenceId
      );

    updateQuestionState(
      questionId,
      {
        evidence:
          nextEvidence,
      }
    );

    const actionId =
      questionStates[
        questionId
      ]?.actionId;

    if (actionId) {
      updateAction(
        actionId,
        {
          issueEvidence:
            nextEvidence.map(
              (item) => ({
                id: item.id,
                actionId,
                evidenceType: "finding" as const,
                name: item.name,
                type: item.type,
                uploadedAt:
                  item.uploadedAt,
                uploadedBy:
                  item.uploadedBy,
                url: item.dataUrl,
              })
            ),
        }
      );
    }
  }

  /**
   * ---------------------------------------------------------
   * SECTION SCORE
   * ---------------------------------------------------------
   */

  function calculateSectionScore(
    section: FiveSSection
  ) {
    return section.questions.reduce(
      (total, question) =>
        total +
        (questionStates[
          question.id
        ]?.score ?? 0),
      0
    );
  }

  function calculateSectionMaxScore(
    section: FiveSSection
  ) {
    return (
      section.questions.length *
      2
    );
  }

  /**
   * ---------------------------------------------------------
   * NEXT / PREVIOUS
   * ---------------------------------------------------------
   */

  function handleNextSection() {
    const currentSection =
      sections[
        activeSectionIndex
      ];

    if (!currentSection) {
      return;
    }

    if (
      !isSectionComplete(
        currentSection
      )
    ) {
      return;
    }

    if (
      activeSectionIndex <
      sections.length - 1
    ) {
      navigateToSection(activeSectionIndex + 1);
    } else {
      setShowReview(true);
    }
  }

  function resetQuestionScroll() {
    window.requestAnimationFrame(() => {
      questionScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function navigateToSection(sectionIndex: number) {
    setNavigationDirection(sectionIndex >= activeSectionIndex ? "forward" : "backward");
    setActiveSectionIndex(sectionIndex);
    setActiveQuestionIndex(0);
    resetQuestionScroll();
  }

  function handlePreviousQuestion() {
    setNavigationDirection("backward");
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((current) => current - 1);
      resetQuestionScroll();
      return;
    }

    if (activeSectionIndex > 0) {
      navigateToSection(activeSectionIndex - 1);
    }
  }

  function handleNextQuestion() {
    if (!activeSection) return;
    setNavigationDirection("forward");

    if (activeQuestionIndex < activeSection.questions.length - 1) {
      setActiveQuestionIndex((current) => current + 1);
      resetQuestionScroll();
      return;
    }

    handleNextSection();
  }

  /**
   * ---------------------------------------------------------
   * SAVE
   * ---------------------------------------------------------
   */

  function handleSaveDraft() {
    setSaving(true);
    setDraftSaved(false);

    window.setTimeout(() => {
      setSaving(false);
      setDraftSaved(true);
      window.setTimeout(() => setDraftSaved(false), 1400);
    }, 600);
  }

  /**
   * ---------------------------------------------------------
   * COMPLETE AUDIT
   * ---------------------------------------------------------
   */

  function buildCurrentAudit(
    updates: Partial<FiveSAudit> = {}
  ): FiveSAudit {
    return {
      ...audit,
      score:
        totalScore,
      maxScore:
        totalMaxScore,
      completionPercentage:
        completionPercentage,
      sections:
        sections.map(
          (section) => ({
            ...section,

            score:
              calculateSectionScore(
                section
              ),

            maxScore:
              calculateSectionMaxScore(
                section
              ),

            questions:
              section.questions.map(
                (question) => {
                  const state =
                    questionStates[
                      question.id
                    ];

                  return {
                    ...question,

                    status:
                      state?.status ??
                      question.status,

                    score:
                      state?.score ??
                      question.score,

                    observation:
                      state?.observation ??
                      question.observation,

                    actionRequired:
                      state?.actionRequired ??
                      question.actionRequired,

                    actionId:
                      state?.actionId ??
                      question.actionId,

                    evidence:
                      state?.evidence ??
                      question.evidence ??
                      [],
                  };
                }
              ),
          })
        ),
      ...updates,
    };
  }

  function handleGenerateReport() {
    if (!auditReadyForCompletion && audit.status !== "Completed") return;

    if (audit.status !== "Completed") {
      const reportAudit = buildCurrentAudit();
      updateFiveSAudit(audit.id, reportAudit);
    }
    router.push(`/5s/audits/${encodeURIComponent(audit.id)}/report?from=audit`);
  }

  function handleCompleteAudit() {
    if (!auditReadyForCompletion) return;

    const completedAudit = buildCurrentAudit({
      status: "Completed",
      completionPercentage: 100,
      completedAt: new Date().toISOString(),
    });

    updateFiveSAudit(audit.id, completedAudit);

    onComplete?.(
      completedAudit
    );

    setShowCompleteConfirmation(false);
    router.push("/5s/audits");
  }

  /**
   * ---------------------------------------------------------
   * REVIEW
   * ---------------------------------------------------------
   */

  if (showReview) {
    return (
      <div className="flex min-w-0 flex-col md:min-h-[calc(100dvh-7rem)]">
        <div className="sticky top-14 z-30 min-w-0 border-b bg-background/95 px-0 py-3 backdrop-blur md:top-0 md:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setShowReview(
                    false
                  )
                }
              >
                <ArrowLeft className="size-4" />
              </Button>

              <div className="min-w-0">
                <h1 className="text-xl font-semibold">
                  Review 5S Audit
                </h1>

                <p className="mt-1 text-xs text-muted-foreground">
                  Review all questions
                  before completing
                  the audit.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="print:hidden"
                onClick={handleGenerateReport}
              >
                <FileBarChart className="mr-2 size-4" />
                Generate Report
              </Button>

              <Button
                type="button"
                className="print:hidden"
                onClick={() => setShowCompleteConfirmation(true)}
              >
                <CheckCircle2 className="mr-2 size-4" />
                Complete Audit
              </Button>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 px-0 py-5 md:overflow-y-auto md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-5">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">
                    Completion
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {completionPercentage}%
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {answeredQuestions}{" "}
                    of{" "}
                    {allQuestions.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">
                    Score
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {scorePercentage}%
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {totalScore} /{" "}
                    {totalMaxScore}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">
                    Corrective Actions
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {
                      questionsWithActions
                    }
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {
                      questionsRequiringActions
                    }{" "}
                    required
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">
                    Stage
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    Review
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Ready for completion
                  </p>
                </CardContent>
              </Card>
            </div>

            {sections.map(
              (section) => (
                <Card
                  key={
                    section.category
                  }
                >
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {
                            section.category
                          }
                        </CardTitle>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            section.description
                          }
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {calculateSectionScore(
                            section
                          )}{" "}
                          /{" "}
                          {calculateSectionMaxScore(
                            section
                          )}
                        </Badge>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="print:hidden"
                          disabled={
                            !isSectionUnlocked(
                              sections.findIndex(
                                (item) =>
                                  item.category ===
                                  section.category
                              )
                            )
                          }
                          onClick={() => {
                            const sectionIndex =
                              sections.findIndex(
                                (item) =>
                                  item.category ===
                                  section.category
                              );

                            if (
                              sectionIndex >= 0 &&
                              isSectionUnlocked(
                                sectionIndex
                              )
                            ) {
                              navigateToSection(sectionIndex);

                              setShowReview(
                                false
                              );
                            }
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      {section.questions.map(
                        (
                          question
                        ) => {
                          const state =
                            questionStates[
                              question.id
                            ];

                          return (
                            <div
                              key={
                                question.id
                              }
                              className="rounded-lg border p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium">
                                  {
                                    question.question
                                  }
                                </p>

                                <div className="flex shrink-0 items-center gap-2">
                                  {state?.score !==
                                    null &&
                                    state?.score !==
                                      undefined && (
                                      <Badge
                                        className={
                                          SCORE_STYLES[
                                            state.score
                                          ]
                                        }
                                      >
                                        {
                                          state.score
                                        }{" "}
                                        ·{" "}
                                        {
                                          SCORE_LABELS[
                                            state.score
                                          ]
                                        }
                                      </Badge>
                                    )}

                                  {state?.actionId && (
                                    <Badge variant="success">
                                      Action
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {state?.observation && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {
                                    state.observation
                                  }
                                </p>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>

        {showActionDialog &&
          activeActionQuestion && (
            <ActionDialog
              question={
                activeActionQuestion
              }
              zone={audit.area}
              state={
                questionStates[
                  activeActionQuestion.id
                ]
              }
              onClose={
                closeActionDialog
              }
              onCreate={
                handleCreateAction
              }
              onUpdate={(updates) =>
                updateQuestionState(
                  activeActionQuestion.id,
                  updates
                )
              }
              onEvidenceUpload={(event) => handleEvidenceUpload(activeActionQuestion.id, event)}
              onEvidenceRemove={(evidenceId) => removeEvidence(activeActionQuestion.id, evidenceId)}
              onEvidencePreview={(evidence) => { setPreviewZoom(1); setPreviewEvidence(evidence); }}
              saving={actionSaving}
            />
          )}
        <CompleteAuditDialog
          open={showCompleteConfirmation}
          questionCount={allQuestions.length}
          onOpenChange={setShowCompleteConfirmation}
          onConfirm={handleCompleteAudit}
        />
      </div>
    );
  }

  /**
   * ---------------------------------------------------------
   * MAIN AUDIT VIEW
   * ---------------------------------------------------------
   */

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col md:h-[calc(100dvh-7rem)] md:min-h-0">
      {/* FIXED HEADER */}

      <div className="w-full min-w-0 max-w-full shrink-0 border-b bg-background px-0 pt-3 md:px-6 lg:px-8">
        <FiveSPageHeader
          eyebrow=""
          title={`5S Audit · ${audit.title}`}
          description={`${audit.plant} · ${audit.area} · ${audit.department} · Auditor: ${audit.auditor}`}
          className="border-b-0 pb-3"
          leading={onBack ? (
            <Button type="button" variant="ghost" size="icon" onClick={onBack} aria-label="Exit audit" className="-ml-2">
              <ArrowLeft className="size-4" />
            </Button>
          ) : undefined}
          actions={
            audit.status === "Completed" ? (
              <Button type="button" variant="outline" onClick={handleGenerateReport}>
                <FileBarChart className="mr-2 size-4" />
                View Report
              </Button>
            ) : auditReadyForCompletion ? (
              <>
                <Button type="button" variant="outline" onClick={handleGenerateReport}>
                  <FileBarChart className="mr-2 size-4" />
                  Generate Report
                </Button>
                <Button type="button" onClick={() => setShowCompleteConfirmation(true)}>
                  <CheckCircle2 className="mr-2 size-4" />
                  Complete Audit
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={saving}>
                  <Save className="mr-2 size-4" />
                  {saving ? "Saving..." : draftSaved ? "✓ Saved" : "Save Draft"}
                </Button>
                <Button type="button" onClick={() => setShowReview(true)}>
                  Review Audit
                </Button>
              </>
            )
          }
        />

          {/* SECTION NAVIGATION */}

          <div className="flex w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain border-t border-border/55 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map(
              (section, index) => {
                const sectionAnswered =
                  section.questions.filter(
                    (question) =>
                      questionStates[
                        question.id
                      ]?.score !==
                      null
                  ).length;

                const sectionComplete =
                  isSectionComplete(
                    section
                  );

                const sectionUnlocked =
                  isSectionUnlocked(
                    index
                  );

                const isActive =
                  index ===
                  activeSectionIndex;

                return (
                  <button
                    key={
                      section.category
                    }
                    type="button"
                    disabled={
                      !sectionUnlocked
                    }
                    onClick={() => {
                      if (
                        !sectionUnlocked
                      ) {
                        return;
                      }

                      navigateToSection(index);
                    }}
                    className={[
                      "relative flex h-14 min-w-[148px] flex-1 items-center gap-2.5 border-0 px-3 text-left transition-colors md:min-w-[170px]",

                      isActive
                        ? "bg-primary/[0.035] text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                        : sectionUnlocked
                          ? "text-foreground hover:bg-muted/35"
                          : "cursor-not-allowed text-muted-foreground opacity-45",
                    ].join(
                      " "
                    )}
                  >
                    <span className={[
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                      isActive ? "bg-primary text-primary-foreground" : sectionComplete ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-muted text-muted-foreground",
                    ].join(" ")}>
                      {sectionComplete ? <Check className="size-3" /> : index + 1}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-xs font-medium">
                      {section.category}
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      {sectionAnswered}/{section.questions.length}
                    </span>
                  </button>
                );
              }
            )}
          </div>
      </div>

      {/* SCROLLABLE QUESTION AREA */}

      <div ref={questionScrollRef} className="w-full min-w-0 max-w-full flex-1 px-0 py-4 md:min-h-0 md:overflow-y-auto md:px-6 lg:px-8">
        <div className="mx-auto w-full min-w-0 max-w-[1600px]">
          {activeSection && (
            <Card className="gap-0 overflow-hidden">
              {/* REDUCED SECTION HEADER */}

              <CardHeader className="border-b border-border/55 py-3">
                <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/[0.035] text-xs font-semibold text-primary">
                      {String(activeSectionIndex + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="text-base">
                        {
                          activeSection.category
                        }
                      </CardTitle>

                      <p className="whitespace-normal break-words text-[11px] leading-4 text-muted-foreground">
                        {
                          activeSection.description
                        }
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-12 text-left md:pl-0 md:text-right">
                    <p className="text-xs font-semibold">Question {activeQuestionIndex + 1} of {activeSection.questions.length}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {Math.round(((activeQuestionIndex + 1) / activeSection.questions.length) * 100)}% through section
                    </p>
                  </div>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${((activeQuestionIndex + 1) / activeSection.questions.length) * 100}%` }} />
                </div>
              </CardHeader>

              <CardContent className="min-w-0 p-4 md:p-5 lg:p-6">
                <div className="space-y-3">
                  {activeSection.questions.map(
                    (
                      question,
                      questionIndex
                    ) => {
                      const state =
                        questionStates[
                          question.id
                        ];

                      if (!state) {
                        return null;
                      }

                      if (questionIndex !== activeQuestionIndex) {
                        return null;
                      }

                      const requiresAction =
                        state.score ===
                          0 ||
                        state.score ===
                          1;

                      const questionUnlocked =
                        questionIndex === 0 ||
                        isQuestionComplete(
                          activeSection.questions[
                            questionIndex - 1
                          ]
                        );

                      return (
                        <div
                          key={
                            question.id
                          }
                          className={`min-w-0 ${navigationDirection === "forward" ? "motion-question-forward" : "motion-question-backward"}`}
                        >
                          {/* QUESTION */}

                          <div className="flex min-w-0 max-w-full gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {
                                questionIndex +
                                1
                              }
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 max-w-full">
                                  <p className="max-w-5xl whitespace-normal break-words text-lg font-semibold leading-[1.35] tracking-[-0.01em] [overflow-wrap:anywhere] md:leading-7">
                                    {
                                      question.question
                                    }
                                  </p>

                                  {question.description && (
                                    <p className="mt-1 max-w-full whitespace-normal break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                                      {
                                        question.description
                                      }
                                    </p>
                                  )}
                                </div>

                                {state.score !==
                                  null && (
                                  <Badge
                                    className={
                                      SCORE_STYLES[
                                        state.score
                                      ]
                                    }
                                  >
                                    {
                                      state.score
                                    }{" "}
                                    ·{" "}
                                    {
                                      SCORE_LABELS[
                                        state.score
                                      ]
                                    }
                                  </Badge>
                                )}
                              </div>

                              {/* SCORE */}

                              <div className="mt-4">
                                <p className="mb-2 text-xs font-medium">
                                  Score
                                </p>

                                <div className="grid min-w-0 gap-2 md:grid-cols-3">
                                  {SCORE_OPTIONS.map(
                                    (
                                      score
                                    ) => {
                                      const selected =
                                        state.score ===
                                        score;

                                      return (
                                        <button
                                          key={
                                            score
                                          }
                                          type="button"
                                          aria-pressed={selected}
                                          disabled={!questionUnlocked}
                                          onClick={() =>
                                            handleScoreChange(
                                              question,
                                              score
                                            )
                                          }
                                          className={[
                                            "group relative flex min-h-[76px] w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-[background-color,border-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100",

                                            selected
                                              ? SCORE_SELECTED_STYLES[
                                                  score
                                                ]
                                              : SCORE_OPTION_STYLES[
                                                  score
                                                ],

                                          ].join(
                                            " "
                                          )}
                                        >
                                          <span
                                            className={[
                                              "flex size-6 items-center justify-center rounded-full border text-xs font-bold",

                                              SCORE_INDICATOR_STYLES[
                                                score
                                              ],
                                            ].join(
                                              " "
                                            )}
                                          >
                                            {
                                              score
                                            }
                                          </span>

                                          <span className="text-xs font-medium">
                                            {
                                              SCORE_LABELS[
                                                score
                                              ]
                                            }
                                          </span>

                                          {selected && (
                                            <Check className="motion-success-in absolute right-3 top-3 size-3.5" aria-hidden="true" />
                                          )}
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              </div>

                              {/* OBSERVATION */}

                              <div className="mt-4">
                                <div className="flex items-center justify-between gap-3">
                                <label
                                  htmlFor={`observation-${question.id}`}
                                  className="text-xs font-medium"
                                >
                                  Observation <span className="font-normal text-muted-foreground">({requiresAction ? "Required" : "Optional"})</span>
                                  {requiresAction && (
                                    <span className="ml-1 text-destructive">
                                      *
                                    </span>
                                  )}
                                </label>
                                <span className="text-[11px] tabular-nums text-muted-foreground">
                                  {state.observation.length} / 1000
                                </span>
                                </div>

                                <Textarea
                                  id={`observation-${question.id}`}
                                  value={
                                    state.observation
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleObservationChange(
                                      question.id,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder="Record your observation..."
                                    className="mt-2 min-h-24 w-full min-w-0 max-w-full"
                                  disabled={!questionUnlocked}
                                />
                              </div>

                              {/* CORRECTIVE ACTION */}

                              <div className="mt-4 grid min-w-0 items-start gap-3">
                              <div className="grid min-h-24 min-w-0 max-w-full items-center gap-3 rounded-lg border border-border/75 bg-muted/20 p-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                                <div className="flex min-w-0 items-center gap-2">
                                  <AlertCircle
                                    className={[
                                      "size-4",

                                      requiresAction
                                        ? "text-destructive"
                                        : "text-muted-foreground",
                                    ].join(
                                      " "
                                    )}
                                  />

                                  <div className="min-w-0">
                                    <p className="text-xs font-medium">
                                      Action <span className="font-normal text-muted-foreground">({requiresAction ? "Required" : "Optional"})</span>
                                    </p>

                                    <p className="text-[11px] text-muted-foreground">
                                      {requiresAction
                                        ? "Required for score 0 or 1"
                                        : "Optional"}
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  type="button"
                                  size="sm"
                                  className="justify-self-center"
                                  disabled={!questionUnlocked}
                                  variant={requiresAction ? "default" : "outline"}
                                  onClick={() => openActionDialog(question)}
                                >
                                  <Plus className="mr-1.5 size-3.5" />
                                  {state.actionId ? "View Action" : "Add Action"}
                                </Button>

                                <div className="flex min-w-0 flex-wrap items-center gap-2 md:justify-self-end">
                                  {state.actionId && (
                                    <>
                                      <Badge variant="success">
                                        <CheckCircle2 className="mr-1 size-3" />
                                        Action Created
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="text-[11px]"
                                      >
                                        Responsible: {state.assignedTo}
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* EVIDENCE */}

                              <div className="hidden">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="size-4 text-muted-foreground" />

                                      <p className="text-xs font-medium">
                                        Evidence <span className="font-normal text-muted-foreground">(Optional)</span>
                                      </p>
                                    </div>

                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                      Attach photos or
                                      supporting
                                      documents to this
                                      question.
                                    </p>
                                  </div>

                                  <div className="flex gap-2">
                                    <input
                                      ref={(
                                        element
                                      ) => {
                                        fileInputRefs.current[
                                          question.id
                                        ] =
                                          element;
                                      }}
                                      type="file"
                                      accept="image/*,.pdf,.doc,.docx"
                                      className="hidden"
                                      onChange={(
                                        event
                                      ) =>
                                        handleEvidenceUpload(
                                          question.id,
                                          event
                                        )
                                      }
                                    />

                                    <input
                                      ref={(
                                        element
                                      ) => {
                                        cameraInputRefs.current[
                                          question.id
                                        ] =
                                          element;
                                      }}
                                      type="file"
                                      accept="image/*"
                                      capture="environment"
                                      className="hidden"
                                      onChange={(
                                        event
                                      ) =>
                                        handleEvidenceUpload(
                                          question.id,
                                          event
                                        )
                                      }
                                    />

                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="order-2 sm:order-1"
                                      disabled={!questionUnlocked}
                                      onClick={() =>
                                        fileInputRefs.current[
                                          question.id
                                        ]?.click()
                                      }
                                    >
                                      <Upload className="mr-1.5 size-3.5" />
                                      Upload
                                    </Button>

                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="order-1 sm:order-2"
                                      disabled={!questionUnlocked}
                                      onClick={() =>
                                        cameraInputRefs.current[
                                          question.id
                                        ]?.click()
                                      }
                                    >
                                      <Camera className="mr-1.5 size-3.5" />
                                      Camera
                                    </Button>
                                  </div>
                                </div>

                                {state.evidence.length > 0 && (
                                  <div className="mt-4 border-t border-border/60 pt-3">
                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                      Uploaded Evidence
                                    </p>

                                    <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    {state.evidence.map(
                                      (
                                        evidence
                                      ) => (
                                        <div
                                          key={
                                            evidence.id
                                          }
                                          className="motion-attachment-in group flex min-w-0 items-center gap-2.5 rounded-lg border border-border/75 bg-background p-2 transition-colors hover:border-border hover:bg-muted/30"
                                        >
                                          <button
                                            type="button"
                                            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            onClick={() => {
                                              setPreviewZoom(1);
                                              setPreviewEvidence(evidence);
                                            }}
                                            aria-label={`Preview ${evidence.name}`}
                                          >
                                            {evidence.type === "image" ? (
                                              // Evidence is a local data URL; framework image optimization is not applicable.
                                              // eslint-disable-next-line @next/next/no-img-element
                                              <img
                                                src={evidence.dataUrl}
                                                alt=""
                                                className="size-11 shrink-0 rounded-md border border-border/70 object-cover"
                                              />
                                            ) : (
                                              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/50 text-muted-foreground">
                                                <FileText className="size-5" />
                                              </span>
                                            )}

                                            <span className="min-w-0 flex-1">
                                              <span className="block truncate text-xs font-medium" title={evidence.name}>
                                                {evidence.name}
                                              </span>
                                              <span className="mt-0.5 block text-[10px] uppercase tracking-wide text-muted-foreground">
                                                {getEvidenceFileLabel(evidence)} · {formatEvidenceSize(evidence.size)}
                                              </span>
                                              <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                                                <Eye className="size-3" /> View
                                              </span>
                                            </span>
                                          </button>

                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                                            aria-label={`Remove ${evidence.name}`}
                                            title="Remove attachment"
                                            onClick={() =>
                                              removeEvidence(
                                                question.id,
                                                evidence.id
                                              )
                                            }
                                          >
                                            <Trash2 className="size-3.5" />
                                          </Button>
                                        </div>
                                      )
                                    )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>

              <CardFooter className="mobile-safe-bottom sticky bottom-0 z-20 grid w-full min-w-0 max-w-full grid-cols-2 gap-2 border-t border-border/65 bg-background/95 px-4 py-3 backdrop-blur md:static md:grid-cols-[auto_1fr_auto] md:items-center md:bg-muted/15 md:backdrop-blur-none lg:px-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeSectionIndex === 0 && activeQuestionIndex === 0}
                  onClick={handlePreviousQuestion}
                  className="row-start-2 w-full md:row-auto md:w-auto"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Previous
                </Button>

                <div className="col-span-2 row-start-1 text-center text-xs tabular-nums text-muted-foreground md:col-span-1 md:col-start-2">
                  {answeredQuestions} of {allQuestions.length} completed
                </div>

                <Button
                  type="button"
                  disabled={
                    isLastQuestion
                      ? !isSectionComplete(activeSection)
                      : !activeQuestion || !isQuestionComplete(activeQuestion)
                  }
                  onClick={handleNextQuestion}
                  className="row-start-2 w-full md:row-auto md:w-auto"
                >
                  {isLastQuestion
                    ? isLastSection
                      ? "Review Audit"
                      : "Next Section"
                    : "Next"}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* ACTION DIALOG */}

      {showActionDialog &&
        activeActionQuestion && (
          <ActionDialog
            question={
              activeActionQuestion
            }
            zone={audit.area}
            state={
              questionStates[
                activeActionQuestion.id
              ]
            }
            onClose={
              closeActionDialog
            }
            onCreate={
              handleCreateAction
            }
            onUpdate={(updates) =>
              updateQuestionState(
                activeActionQuestion.id,
                updates
              )
            }
            onEvidenceUpload={(event) => handleEvidenceUpload(activeActionQuestion.id, event)}
            onEvidenceRemove={(evidenceId) => removeEvidence(activeActionQuestion.id, evidenceId)}
            onEvidencePreview={(evidence) => { setPreviewZoom(1); setPreviewEvidence(evidence); }}
            saving={actionSaving}
          />
        )}

      <Dialog
        open={previewEvidence !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewEvidence(null);
            setPreviewZoom(1);
          }
        }}
      >
        <DialogContent
          className="h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden bg-background p-0 sm:h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:max-w-none"
          showCloseButton={false}
        >
          {previewEvidence && (
            <>
              <DialogHeader className="min-w-0 flex-row items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <DialogTitle className="truncate pr-2" title={previewEvidence.name}>
                    {previewEvidence.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-xs">
                    {getEvidenceFileLabel(previewEvidence)} · {formatEvidenceSize(previewEvidence.size)}
                  </DialogDescription>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => setPreviewEvidence(null)}
                  aria-label="Close attachment preview"
                >
                  <X className="size-4" />
                </Button>
              </DialogHeader>

              <div
                ref={previewRef}
                className="flex min-h-0 items-center justify-center overflow-auto bg-slate-950/95 p-4 sm:p-6"
              >
                {previewEvidence.type === "image" ? (
                  // Preserve the source file's natural aspect ratio in the viewer.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewEvidence.dataUrl}
                    alt={previewEvidence.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-150"
                    style={{ transform: `scale(${previewZoom})` }}
                  />
                ) : isPdfEvidence(previewEvidence) ? (
                  <iframe
                    src={previewEvidence.dataUrl}
                    title={`Preview ${previewEvidence.name}`}
                    className="h-full min-h-[60vh] w-full max-w-6xl rounded-md border-0 bg-white"
                  />
                ) : (
                  <div className="flex max-w-md flex-col items-center rounded-xl border border-white/10 bg-slate-900 px-8 py-10 text-center text-slate-100 shadow-sm">
                    <FileText className="size-10 text-slate-400" />
                    <p className="mt-4 max-w-full truncate text-sm font-medium" title={previewEvidence.name}>
                      {previewEvidence.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Preview unavailable for this file type.
                    </p>
                    <Button
                      render={<a href={previewEvidence.dataUrl} target="_blank" rel="noreferrer" />}
                      size="sm"
                      variant="secondary"
                      className="mt-5"
                    >
                        <ExternalLink className="mr-1.5 size-3.5" /> Open File
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 bg-muted/25 px-4 py-2.5 sm:px-5">
                <span className="min-w-0 truncate text-xs text-muted-foreground">
                  {formatEvidenceSize(previewEvidence.size)} · {getEvidenceFileLabel(previewEvidence)}
                </span>

                <div className="flex items-center gap-1">
                  {previewEvidence.type === "image" && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={previewZoom <= 0.5}
                        onClick={() => setPreviewZoom((zoom) => Math.max(0.5, zoom - 0.25))}
                        aria-label="Zoom out"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">
                        {Math.round(previewZoom * 100)}%
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={previewZoom >= 3}
                        onClick={() => setPreviewZoom((zoom) => Math.min(3, zoom + 0.25))}
                        aria-label="Zoom in"
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setPreviewZoom(1)}
                        aria-label="Reset zoom to fit"
                        title="Fit to screen"
                      >
                        <RotateCcw className="size-4" />
                      </Button>
                    </>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void previewRef.current?.requestFullscreen?.()}
                    aria-label="Enter full screen"
                    title="Full screen"
                  >
                    <Maximize2 className="size-4" />
                  </Button>

                  <Button
                    render={<a href={previewEvidence.dataUrl} target="_blank" rel="noreferrer" />}
                    variant="ghost"
                    size="sm"
                  >
                      <ExternalLink className="mr-1.5 size-3.5" /> Open original
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <CompleteAuditDialog
        open={showCompleteConfirmation}
        questionCount={allQuestions.length}
        onOpenChange={setShowCompleteConfirmation}
        onConfirm={handleCompleteAudit}
      />

    </div>
  );
}

function CompleteAuditDialog({
  open,
  questionCount,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  questionCount: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete this audit?</AlertDialogTitle>
          <AlertDialogDescription>
            All {questionCount} questions are complete. The audit will be marked as completed and you will return to the Audits listing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Complete Audit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * ---------------------------------------------------------
 * ACTION DIALOG
 * ---------------------------------------------------------
 */

interface ActionDialogProps {
  question: FiveSQuestion;
  zone: string;
  state: QuestionState;
  onClose: () => void;
  onCreate: () => void;
  onUpdate: (
    updates: Partial<QuestionState>
  ) => void;
  onEvidenceUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEvidenceRemove: (evidenceId: string) => void;
  onEvidencePreview: (evidence: FiveSEvidence) => void;
  saving: boolean;
}

function ActionDialog({
  question,
  zone,
  state,
  onClose,
  onCreate,
  onUpdate,
  onEvidenceUpload,
  onEvidenceRemove,
  onEvidencePreview,
  saving,
}: ActionDialogProps) {
  const evidenceInputRef = useRef<HTMLInputElement | null>(null);
  const evidenceCameraRef = useRef<HTMLInputElement | null>(null);
  const requiresAction =
    state.score === 0 ||
    state.score === 1;

  const today = toLocalInputDate(new Date());
  const selectedZone = getFiveSZoneConfiguration(zone);
  const existingAction = state.actionId ? getActionById(state.actionId) : undefined;
  const canEditCreatedAction = !state.actionId || existingAction?.status === "Awaiting Assignment";
  const dueDateInvalid = !state.dueDate || state.dueDate < today;

  const priorityHelper: Record<FiveSActionPriority, string> = {
    Critical: "Defaulted to today based on Critical priority",
    High: "Defaulted to tomorrow based on High priority",
    Medium: "Defaulted to 2 days from today",
    Low: "Defaulted to 3 days from today",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="motion-success-in w-full max-w-2xl overflow-hidden rounded-xl border bg-background shadow-2xl">
        {/* DIALOG HEADER */}

        <div className="flex items-start justify-between border-b px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <AlertCircle
                className={[
                  "size-4",

                  requiresAction
                    ? "text-destructive"
                    : "text-primary",
                ].join(" ")}
              />

              <h2 className="text-base font-semibold">
                Action
              </h2>
            </div>

            <p className="mt-2 text-sm font-medium leading-5">
              {question.question}
            </p>

            {state.score !==
              null && (
              <Badge
                className={`mt-2 ${
                  SCORE_STYLES[
                    state.score
                  ]
                }`}
              >
                Score{" "}
                {state.score} ·{" "}
                {
                  SCORE_LABELS[
                    state.score
                  ]
                }
              </Badge>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={saving}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* DIALOG BODY */}

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium">
                Action Title
              </label>

              <Input
                value={
                  state.actionTitle
                }
                onChange={(event) =>
                  onUpdate({
                    actionTitle:
                      event.target
                        .value,
                  })
                }
                placeholder="Enter corrective action..."
                className="mt-1.5"
                disabled={!canEditCreatedAction}
              />
            </div>

            <div>
              <label className="text-xs font-medium">
                Description
              </label>

              <Textarea
                value={
                  state.actionDescription
                }
                onChange={(event) =>
                  onUpdate({
                    actionDescription:
                      event.target
                        .value,
                  })
                }
                placeholder="Describe what needs to be done..."
                className="mt-1.5 min-h-24"
                disabled={!canEditCreatedAction}
              />
            </div>

            <div className={`rounded-lg border p-4 ${requiresAction && state.evidence.length === 0 ? "border-destructive/45 bg-destructive/[0.035]" : "bg-muted/10"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <p className="text-xs font-medium">Original Finding Evidence {requiresAction ? <span className="text-destructive">*</span> : <span className="font-normal text-muted-foreground">(Optional)</span>}</p>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Attach the Before evidence that shows why this corrective action is required.</p>
                </div>
                {canEditCreatedAction && <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  <input ref={evidenceInputRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={onEvidenceUpload} />
                  <input ref={evidenceCameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onEvidenceUpload} />
                  <Button type="button" size="sm" variant="outline" className="order-2 flex-1 sm:order-1 sm:flex-none" onClick={() => evidenceInputRef.current?.click()}><Upload className="mr-1.5 size-3.5" /> Upload</Button>
                  <Button type="button" size="sm" variant="outline" className="order-1 flex-1 sm:order-2 sm:flex-none" onClick={() => evidenceCameraRef.current?.click()}><Camera className="mr-1.5 size-3.5" /> Camera</Button>
                </div>}
              </div>
              {state.evidence.length > 0 ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{state.evidence.map((evidence) => <div key={evidence.id} className="flex min-w-0 items-center gap-2 rounded-lg border bg-background p-2"><button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => onEvidencePreview(evidence)}>{evidence.type === "image" ? <img src={evidence.dataUrl} alt="" className="size-11 shrink-0 rounded object-cover" /> : <span className="grid size-11 shrink-0 place-items-center rounded bg-muted"><FileText className="size-5" /></span>}<span className="min-w-0"><span className="block truncate text-xs font-medium">{evidence.name}</span><span className="text-[10px] text-muted-foreground">{getEvidenceFileLabel(evidence)} · {formatEvidenceSize(evidence.size)}</span></span></button>{canEditCreatedAction && <Button type="button" size="icon-sm" variant="ghost" onClick={() => onEvidenceRemove(evidence.id)} aria-label={`Remove ${evidence.name}`}><Trash2 className="size-3.5" /></Button>}</div>)}</div> : requiresAction && <p className="mt-3 text-[11px] font-medium text-destructive">At least one evidence attachment is required for Non Compliance or Partial Compliance.</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium">
                  Action Category
                </label>

                <Select
                  value={state.actionCategory}
                  onValueChange={(value) => {
                    onUpdate({ actionCategory: value ?? "" });
                  }}
                  disabled={!canEditCreatedAction}
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Select action category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIVE_S_ACTION_CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="mt-1.5 text-[11px] text-muted-foreground">Required and selected by the Auditor.</p>
              </div>

              <div>
                <label className="text-xs font-medium">
                  Priority
                </label>

                <Select
                  value={state.priority}
                  onValueChange={(value) => {
                    if (!value) return;
                    const priority = value as FiveSActionPriority;
                    onUpdate({
                      priority,
                      dueDate: getPriorityDueDate(priority),
                    });
                  }}
                  disabled={!canEditCreatedAction}
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical"><span className="font-medium text-red-600 dark:text-red-400">Critical</span></SelectItem>
                    <SelectItem value="High"><span className="font-medium text-orange-600 dark:text-orange-400">High</span></SelectItem>
                    <SelectItem value="Medium"><span className="font-medium text-amber-600 dark:text-amber-400">Medium</span></SelectItem>
                    <SelectItem value="Low"><span className="font-medium text-emerald-600 dark:text-emerald-400">Low</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2"><div><label className="text-xs font-medium">Target Zone</label><div className="mt-1.5 rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">{zone}</div></div><div><label className="text-xs font-medium">Zone Leader</label><div className="mt-1.5 rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">{selectedZone?.leader ?? "Not configured"}</div></div></div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium">Due Date</label>
                <Input
                  type="date"
                  value={state.dueDate}
                  min={today}
                  onChange={(event) =>
                    onUpdate({ dueDate: event.target.value })
                  }
                  className="mt-1.5"
                  disabled={!canEditCreatedAction}
                />
                <p className={`mt-1.5 text-[11px] ${dueDateInvalid ? "text-destructive" : "text-muted-foreground"}`}>
                  {dueDateInvalid ? "Due Date cannot be in the past." : priorityHelper[state.priority]}
                </p>
              </div>
            </div>

            {requiresAction && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                Corrective action is
                mandatory because this
                question received a
                score of{" "}
                {state.score}.
              </div>
            )}
          </div>
        </div>

        {/* DIALOG FOOTER */}

        <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>

          {canEditCreatedAction && (
            <Button
              type="button"
              onClick={onCreate}
              disabled={
                saving ||
                !state.actionTitle.trim() ||
                !state.actionCategory ||
                dueDateInvalid ||
                (requiresAction && state.evidence.length === 0)
              }
            >
              {saving ? (
                state.actionId ? "Updating..." : "Creating..."
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  {state.actionId ? "Update Action" : "Create Action"}
                </>
              )}
            </Button>
          )}

          {state.actionId && !canEditCreatedAction && (
            <Button
              type="button"
              onClick={onClose}
            >
              <CheckCircle2 className="mr-2 size-4" />
              Action Created
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FiveSAuditExecution;
