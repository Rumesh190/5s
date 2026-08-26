"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Search,
  Target,
  Trash2,
  Upload,
  History,
  IndianRupee,
  Maximize2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { PageContainer } from "@/components/layout/page-container";
import FiveSPageHeader from "./components/FiveSPageHeader";
import { StatCard } from "@/components/ui/stat-card";

import {
  addActionEvidence,
  closeReviewedAction,
  removeActionEvidence,
  sendActionBack,
  startAssignedAction,
  submitActionForReview,
  useActionStore,
} from "@/lib/actions/action-store";
import { useCurrentUser } from "@/lib/current-user";
import { FIVE_S_ACTION_CATEGORIES } from "@/lib/five-s/configuration";

import type {
  MyAction,
  MyActionEvidence,
  MyActionPriority,
  MyActionStatus,
} from "./types/my-actions";

/* =========================================================
   STATUS CONFIG
   ========================================================= */

const STATUS_CONFIG: Record<
  MyActionStatus,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "muted"
      | "success"
      | "warning"
      | "danger"
      | "info";
  }
> = {
  "Awaiting Assignment": { label: "Awaiting Assignment", variant: "warning" },
  "Pending Auditor Review": { label: "Pending Auditor Review", variant: "info" },
  Open: {
    label: "Open",
    variant: "info",
  },

  "In Progress": {
    label: "In Progress",
    variant: "warning",
  },

  Overdue: {
    label: "Overdue",
    variant: "danger",
  },

  "Awaiting Review": {
    label: "Awaiting Review",
    variant: "info",
  },

  Assigned: { label: "Assigned", variant: "info" },
  "Pending Review": { label: "Pending Review", variant: "info" },
  "Rework Required": { label: "Rework Required", variant: "danger" },

  Completed: {
    label: "Completed",
    variant: "success",
  },
};

/* =========================================================
   PRIORITY CONFIG
   ========================================================= */

const PRIORITY_CONFIG: Record<
  MyActionPriority,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "muted"
      | "success"
      | "warning"
      | "danger"
      | "info";
  }
> = {
  Low: {
    label: "Low",
    variant: "secondary",
  },

  Medium: {
    label: "Medium",
    variant: "warning",
  },

  High: {
    label: "High",
    variant: "danger",
  },

  Critical: {
    label: "Critical",
    variant: "danger",
  },
};

/* =========================================================
   PAGE
   ========================================================= */

export default function MyActionsPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const actions = useActionStore();
  const roleActions = useMemo(() => actions.filter((action) => {
    if (currentUser.id === "USR-LAKSHMAN") return action.createdByUserId === currentUser.id || action.createdByName === currentUser.name || action.auditor === currentUser.name;
    if (currentUser.id === "USR-RUMESH") return action.area === currentUser.primaryZone;
    return action.responsiblePersonId === currentUser.id || action.responsiblePersonName === currentUser.name || action.assignedTo === currentUser.name;
  }), [actions, currentUser.id, currentUser.name, currentUser.primaryZone]);

  const [selectedAction, setSelectedAction] =
    useState<MyAction | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | MyActionStatus>("All");

  /*
   * UI-only field for the action progress section.
   */
  const [actionTakenDescription, setActionTakenDescription] =
    useState("");
  const [actionCategory, setActionCategory] = useState("");
  const [costSaving, setCostSaving] = useState("0");
  const [sendBackRemark, setSendBackRemark] = useState("");
  const [showSendBack, setShowSendBack] = useState(false);
  const [previewEvidence, setPreviewEvidence] = useState<MyActionEvidence | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [showPriorityGuide, setShowPriorityGuide] =
    useState(false);

  /*
   * Evidence inputs:
   * 1. File browser
   * 2. Camera
   */
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const cameraInputRef =
    useRef<HTMLInputElement | null>(null);

  /* =========================================================
     LOCK BODY SCROLL + ESCAPE HANDLER
     ========================================================= */

  useEffect(() => {
    if (!selectedAction) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (previewEvidence) {
          setPreviewEvidence(null);
        } else {
          setSelectedAction(null);
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [previewEvidence, selectedAction]);

  /* =========================================================
     KPI COUNTS
     ========================================================= */

  const totalActions = roleActions.length;

  const openActions = roleActions.filter(
    (action) => action.status === "Open" || action.status === "Assigned"
  ).length;

  const inProgressActions = roleActions.filter(
    (action) => action.status === "In Progress"
  ).length;

  const overdueActions = roleActions.filter(
    (action) => action.status === "Overdue"
  ).length;

  const awaitingReviewActions = roleActions.filter(
    (action) =>
      action.status === "Awaiting Review"
      || action.status === "Pending Review" || action.status === "Pending Auditor Review"
  ).length;

  const completedActions = roleActions.filter(
    (action) => action.status === "Completed"
  ).length;

  /* =========================================================
     FILTER ACTIONS
     ========================================================= */

  const filteredActions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roleActions.filter((action) => {
      const matchesStatus =
        statusFilter === "All" ||
        action.status === statusFilter;

      const matchesSearch =
        !query ||
        action.title
          .toLowerCase()
          .includes(query) ||
        action.description
          .toLowerCase()
          .includes(query) ||
        action.sourceTitle
          .toLowerCase()
          .includes(query) ||
        action.plant
          .toLowerCase()
          .includes(query) ||
        action.department
          .toLowerCase()
          .includes(query) ||
        action.area
          .toLowerCase()
          .includes(query) ||
        action.priority
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [roleActions, search, statusFilter]);

  /* =========================================================
     OPEN ACTION
     ========================================================= */

  function handleOpenAction(action: MyAction) {
    router.push(`/5s/actions/${encodeURIComponent(action.id)}`);
  }

  useEffect(() => {
    const actionId = new URLSearchParams(window.location.search).get("actionId");
    if (!actionId) return;
    const action = actions.find((item) => item.id === actionId);
    if (!action) return;
    router.replace(`/5s/actions/${encodeURIComponent(action.id)}`);
    // Open a notification target once after actions hydrate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, router]);

  /* =========================================================
     CLOSE DRAWER
     ========================================================= */

  function handleCloseAction() {
    setSelectedAction(null);
    setActionTakenDescription("");
    setActionCategory("");
    setCostSaving("0");
    setSendBackRemark("");
    setShowSendBack(false);
    setShowPriorityGuide(false);
  }

  /* =========================================================
     START ACTION
     ========================================================= */

  function handleStartAction(actionId: string) {
    const updatedAction = startAssignedAction(actionId, currentUser);

    if (updatedAction) {
      setSelectedAction(updatedAction);
    }
  }

  /* =========================================================
     SUBMIT ACTION FOR AUDITOR REVIEW
     ========================================================= */

  function handleCompleteAction(actionId: string) {
    if (!selectedAction) {
      return;
    }

    const updatedAction = submitActionForReview(actionId, currentUser, {
      observation: actionTakenDescription,
      actionCategory,
      costSaving: Number(costSaving),
    });

    if (updatedAction) {
      setSelectedAction(updatedAction);
    }
  }

  /* =========================================================
     AUDITOR REVIEW
     ========================================================= */

  function handleVerifyAndClose(
    actionId: string
  ) {
    if (!selectedAction) {
      return;
    }

    const updatedAction = closeReviewedAction(actionId, currentUser);

    if (updatedAction) {
      setSelectedAction(updatedAction);
    }
  }

  function handleSendBack(actionId: string) {
    if (!selectedAction) {
      return;
    }

    const updatedAction = sendActionBack(actionId, currentUser, sendBackRemark);

    if (updatedAction) {
      setSelectedAction(updatedAction);

      setActionTakenDescription(
        updatedAction
          .actionTakenDescription ??
          ""
      );
      setShowSendBack(false);
      setSendBackRemark("");
    }
  }

  /* =========================================================
     REAL FILE / CAMERA EVIDENCE
     ========================================================= */

  async function handleEvidenceFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!selectedAction) {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    let url: string | undefined;

    if (file.type.startsWith("image/")) {
      url = await readImageAsDataUrl(file);
    }

    const evidence = {
      id: `EV-${crypto.randomUUID()}`,
      name: file.name,
      type: file.type.startsWith("image/")
        ? ("image" as const)
        : ("document" as const),
      uploadedAt: new Date()
        .toISOString()
        .slice(0, 10),
      uploadedBy: selectedAction.assignedTo,
      url,
    };

    const updatedAction =
      addActionEvidence(
        selectedAction.id,
        evidence
      );

    if (updatedAction) {
      setSelectedAction(updatedAction);
    }

    event.target.value = "";
  }

  /* =========================================================
     IMAGE PREVIEW
     ========================================================= */

  function readImageAsDataUrl(
    file: File
  ): Promise<string | undefined> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(
          typeof reader.result === "string"
            ? reader.result
            : undefined
        );
      };

      reader.onerror = () => {
        resolve(undefined);
      };

      reader.readAsDataURL(file);
    });
  }

  /* =========================================================
     REMOVE EVIDENCE
     ========================================================= */

  function handleRemoveEvidence(
    evidenceId: string
  ) {
    if (!selectedAction) {
      return;
    }

    const updatedAction = removeActionEvidence(selectedAction.id, evidenceId);
    if (updatedAction) setSelectedAction(updatedAction);
  }

  /* =========================================================
     OPEN FILE BROWSER
     ========================================================= */

  function handleOpenFileBrowser() {
    fileInputRef.current?.click();
  }

  /* =========================================================
     OPEN CAMERA
     ========================================================= */

  function handleOpenCamera() {
    cameraInputRef.current?.click();
  }

  /* =========================================================
     VIEW COMPLETED ACTION REPORT
     ========================================================= */

  function handleViewReport(actionId: string) {
    router.push(
      `/5s/actions/${encodeURIComponent(actionId)}/report`
    );
  }

  /* =========================================================
     ACTION DRAWER
     ========================================================= */

  function renderActionDrawer() {
    if (!selectedAction) {
      return null;
    }

    const status =
      STATUS_CONFIG[selectedAction.status];

    const priority =
      PRIORITY_CONFIG[selectedAction.priority];

    const isResponsiblePerson = selectedAction.responsiblePersonId
      ? selectedAction.responsiblePersonId === currentUser.id
      : selectedAction.assignedTo === currentUser.name;
    const isActionCreator = selectedAction.createdByUserId
      ? selectedAction.createdByUserId === currentUser.id
      : !selectedAction.auditor || selectedAction.auditor === currentUser.name;
    const canEditResolution = isResponsiblePerson && ["Assigned", "Open", "In Progress", "Rework Required"].includes(selectedAction.status);
    const canReview = isActionCreator && ["Pending Review", "Awaiting Review"].includes(selectedAction.status);
    const latestRemark = [...(selectedAction.reviewHistory ?? [])].reverse().find((item) => item.type === "sent_back");

    return createPortal(
      <>
        {/* ===================================================
            BACKDROP
            =================================================== */}

        <div
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[1px]"
          onClick={handleCloseAction}
          aria-hidden="true"
        />

        {/* ===================================================
            RIGHT SIDE DRAWER
            =================================================== */}

        <aside
          className="
            fixed
            inset-y-0
            right-0
            z-[9999]
            flex
            w-full
            max-w-xl
            flex-col
            border-l
            bg-background
            shadow-2xl
            transition-transform
            duration-300
            ease-out
          "
          role="dialog"
          aria-modal="true"
          aria-label="Action details"
        >
          {/* =================================================
              DRAWER HEADER
              ================================================= */}

          <div className="flex shrink-0 items-start justify-between gap-3 border-b bg-background px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold leading-tight">
                  {selectedAction.title}
                </h2>

                <Badge variant={status.variant}>
                  {status.label}
                </Badge>

                <Badge variant={priority.variant}>
                  {priority.label}
                </Badge>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {selectedAction.sourceTitle}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCloseAction}
              aria-label="Close action details"
              className="shrink-0"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* =================================================
              DRAWER CONTENT
              ================================================= */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
              {/* =================================================
                  COMPACT ACTION DETAILS
                  ================================================= */}

              <section>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Action Details
                  </p>

                  <div className="flex items-center gap-2">
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>

                    <div className="relative">
                      <div className="flex items-center gap-1">
                        <Badge variant={priority.variant}>
                          {priority.label}
                        </Badge>

                        <button
                          type="button"
                          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() =>
                            setShowPriorityGuide(
                              (current) => !current
                            )
                          }
                          aria-label="View priority definitions"
                          aria-expanded={showPriorityGuide}
                          title="View priority definitions"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </div>

                      {showPriorityGuide && (
                        <div className="absolute right-0 top-8 z-20 w-[320px] rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
                          <p className="text-xs font-semibold">
                            Priority Definitions
                          </p>

                          <div className="mt-3 space-y-3">
                            <PriorityDefinition
                              priority="Critical"
                              description="Severe impact requiring urgent action and immediate escalation."
                            />

                            <PriorityDefinition
                              priority="High"
                              description="Significant impact. Requires immediate attention and should be resolved as soon as possible."
                            />

                            <PriorityDefinition
                              priority="Medium"
                              description="Requires timely attention and should be addressed within the planned due date."
                            />

                            <PriorityDefinition
                              priority="Low"
                              description="Minor impact. Can be addressed through normal planned action."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6">
                  {selectedAction.description}
                </p>

                <div className="mt-4 overflow-hidden rounded-lg border bg-card">
                  <div className="grid grid-cols-2 divide-x border-b">
                    <CompactDetail
                      label="Source"
                      value={selectedAction.source}
                    />

                    <CompactDetail
                      label="Responsible Person"
                      value={selectedAction.responsiblePersonName ?? selectedAction.assignedTo}
                    />
                  </div>

                  <div className="grid grid-cols-2 divide-x border-b">
                    <CompactDetail
                      label="Plant"
                      value={selectedAction.plant}
                    />

                    <CompactDetail
                      label="Area"
                      value={selectedAction.area}
                    />
                  </div>

                  <div className="grid grid-cols-2 divide-x">
                    <CompactDetail
                      label="Department"
                      value={selectedAction.department}
                    />

                    <CompactDetail
                      label="Due Date"
                      value={selectedAction.dueDate}
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    Audit: {selectedAction.sourceTitle}
                  </span>

                  <span>
                    Created: {selectedAction.createdAt}
                  </span>
                  <span>Raised by: {selectedAction.createdByName ?? selectedAction.auditor ?? "—"}</span>
                  {selectedAction.category && <span>5S Section: {selectedAction.category}</span>}
                </div>
                {selectedAction.questionText && <div className="mt-3 rounded-lg border bg-muted/20 p-3"><p className="text-[11px] text-muted-foreground">Related Question</p><p className="mt-1 text-sm">{selectedAction.questionText}</p></div>}
              </section>

              {selectedAction.status === "Rework Required" && latestRemark && (
                <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                  <p className="text-sm font-semibold">Rework Required</p>
                  <p className="mt-1 text-xs opacity-80">{latestRemark.actorName} · {new Date(latestRemark.createdAt).toLocaleString()}</p>
                  <p className="mt-3 text-sm leading-6">{latestRemark.remark}</p>
                </section>
              )}

              {/* =================================================
                  ORIGINAL ISSUE ATTACHMENTS
                  ================================================= */}

              <section>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Attached Image
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Evidence attached when this action was created.
                </p>

                {!selectedAction.issueEvidence ||
                selectedAction.issueEvidence.length === 0 ? (
                  <div className="mt-3 flex min-h-36 items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <Paperclip className="mx-auto size-5 text-muted-foreground" />

                      <p className="mt-2 text-xs text-muted-foreground">
                        No original attachment available
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {selectedAction.issueEvidence.map(
                      (evidence) => (
                        <div
                          key={evidence.id}
                          className="overflow-hidden rounded-lg border bg-card"
                        >
                          {evidence.type === "image" &&
                          evidence.url ? (
                            <a
                              href={evidence.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block"
                            >
                              <img
                                src={evidence.url}
                                alt={evidence.name}
                                className="aspect-[16/10] w-full object-cover"
                              />
                            </a>
                          ) : (
                            <div className="flex aspect-[16/10] items-center justify-center bg-muted/40">
                              <FileText className="size-7 text-muted-foreground" />
                            </div>
                          )}

                          <div className="p-3">
                            <p
                              className="truncate text-sm font-medium"
                              title={evidence.name}
                            >
                              {evidence.name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {evidence.uploadedBy} ·{" "}
                              {evidence.uploadedAt}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* =================================================
                  ACTION PROGRESS
                  ================================================= */}

              {canEditResolution && (
                <section className="rounded-xl border bg-muted/20 p-4">
                  <div className="space-y-5">
                    {/* Heading */}

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">Action Progress</p>
                        {["Assigned", "Rework Required"].includes(selectedAction.status) && (
                          <Button size="sm" variant="outline" onClick={() => handleStartAction(selectedAction.id)}>Start Work</Button>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Record the action taken and
                        provide evidence before
                        submitting it for auditor review.
                      </p>
                    </div>

                    {/* =================================================
                        1. DESCRIPTION OF ACTION TAKEN
                        ================================================= */}

                    <div>
                      <label
                        htmlFor="action-taken-description"
                        className="text-sm font-medium"
                      >
                        Observation
                      </label>

                      <Textarea
                        id="action-taken-description"
                        value={
                          actionTakenDescription
                        }
                        onChange={(event) =>
                          setActionTakenDescription(
                            event.target.value
                          )
                        }
                        placeholder="Explain what was done, what was found, and how the issue was resolved..."
                        className="mt-2 min-h-28 resize-y"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Action Category</label>
                        <Select value={actionCategory} onValueChange={(value) => setActionCategory(value ?? "")}>
                          <SelectTrigger className="mt-2 w-full"><SelectValue placeholder="Select action category" /></SelectTrigger>
                          <SelectContent>{FIVE_S_ACTION_CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="cost-saving" className="text-sm font-medium">Cost Saving</label>
                        <div className="relative mt-2">
                          <IndianRupee className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                          <Input id="cost-saving" type="number" min="0" step="0.01" inputMode="decimal" value={costSaving} onChange={(event) => setCostSaving(event.target.value)} className="pl-8" />
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        2. EVIDENCE
                        ================================================= */}

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">
                            Evidence
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Upload a file or capture
                            evidence using the camera.
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          {/* Upload */}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={
                              handleOpenFileBrowser
                            }
                          >
                            <Upload className="mr-2 size-4" />
                            Upload
                          </Button>

                          {/* Camera */}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={
                              handleOpenCamera
                            }
                          >
                            <ImageIcon className="mr-2 size-4" />
                            Camera
                          </Button>

                          {/* File browser */}

                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                            onChange={
                              handleEvidenceFile
                            }
                          />

                          {/* Camera */}

                          <input
                            ref={cameraInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={
                              handleEvidenceFile
                            }
                          />
                        </div>
                      </div>

                      {selectedAction.evidence.length ===
                      0 ? (
                        <div className="mt-3 flex min-h-24 items-center justify-center rounded-lg border border-dashed">
                          <div className="text-center">
                            <Paperclip className="mx-auto size-5 text-muted-foreground" />

                            <p className="mt-2 text-xs text-muted-foreground">
                              No evidence attached yet
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-2">
                          {selectedAction.evidence.map(
                            (evidence) => (
                              <div
                                key={evidence.id}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30"
                              >
                                {/* Evidence information */}

                                <button
                                  type="button"
                                  className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  onClick={() => setPreviewEvidence(evidence)}
                                  aria-label={`Preview ${evidence.name}`}
                                >
                                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                    {evidence.type === "image" &&
                                    evidence.url ? (
                                      <img
                                        src={evidence.url}
                                        alt={evidence.name}
                                        className="size-full object-cover"
                                      />
                                    ) : evidence.type ===
                                      "image" ? (
                                      <ImageIcon className="size-4 text-muted-foreground" />
                                    ) : (
                                      <FileText className="size-4 text-muted-foreground" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                      {evidence.name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                      Uploaded by{" "}
                                      {
                                        evidence.uploadedBy
                                      }{" "}
                                      ·{" "}
                                      {
                                        evidence.uploadedAt
                                      }
                                    </p>
                                  </div>
                                </button>

                                {/* Remove button */}

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                  onClick={(event) => {
                                    event.stopPropagation();

                                    handleRemoveEvidence(
                                      evidence.id
                                    );
                                  }}
                                  aria-label={`Remove ${evidence.name}`}
                                  title="Remove evidence"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        3. COMPLETE ACTION
                        ================================================= */}

                    <div className="border-t pt-4">
                      <Button
                        type="button"
                        className="w-full"
                        disabled={!actionTakenDescription.trim() || !actionCategory || costSaving === "" || Number(costSaving) < 0 || !Number.isFinite(Number(costSaving))}
                        onClick={() =>
                          handleCompleteAction(
                            selectedAction.id
                          )
                        }
                        title="Submit for auditor review"
                      >
                        <CheckCircle2 className="mr-2 size-4" />
                        Submit for Auditor Review
                      </Button>

                      <p className="mt-2 text-center text-xs text-muted-foreground">Observation and Action Category are required. Evidence is optional.</p>
                    </div>
                  </div>
                </section>
              )}

              {/* =================================================
                  AUDITOR REVIEW
                  ================================================= */}

              {["Pending Review", "Awaiting Review"].includes(selectedAction.status) && (
                <section className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div>
                    <div className="flex items-start gap-3">
                      <Eye className="mt-0.5 size-5 shrink-0 text-blue-600" />

                      <div>
                        <p className="text-sm font-semibold">
                          Auditor Review
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          The responsible person has completed
                          the corrective work and submitted it
                          for auditor verification.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border bg-background p-3">
                      <p className="text-xs text-muted-foreground">
                        Description of action taken
                      </p>

                      <p className="mt-1 text-sm leading-6">
                        {selectedAction
                          .resolutionObservation || selectedAction.actionTakenDescription ||
                          "—"}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-background p-3"><p className="text-xs text-muted-foreground">Action Category</p><p className="mt-1 text-sm font-medium">{selectedAction.actionCategory || "—"}</p></div>
                      <div className="rounded-lg border bg-background p-3"><p className="text-xs text-muted-foreground">Cost Saving</p><p className="mt-1 text-sm font-medium">₹{(selectedAction.costSaving ?? 0).toLocaleString("en-IN")}</p></div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Closure Evidence
                      </p>

                      {selectedAction.evidence.length === 0 ? (
                        <div className="mt-2 flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-background">
                          <div className="text-center">
                            <Paperclip className="mx-auto size-5 text-muted-foreground" />

                            <p className="mt-2 text-xs text-muted-foreground">
                              No closure evidence available
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          {selectedAction.evidence.map(
                            (evidence) => (
                              <div
                                key={evidence.id}
                                className="overflow-hidden rounded-lg border bg-background"
                              >
                                {evidence.type === "image" &&
                                evidence.url ? (
                                  <a
                                    href={evidence.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block"
                                  >
                                    <img
                                      src={evidence.url}
                                      alt={evidence.name}
                                      className="aspect-video w-full object-cover"
                                    />
                                  </a>
                                ) : (
                                  <div className="flex aspect-video items-center justify-center bg-muted/40">
                                    <FileText className="size-7 text-muted-foreground" />
                                  </div>
                                )}

                                <div className="p-3">
                                  <p
                                    className="truncate text-sm font-medium"
                                    title={evidence.name}
                                  >
                                    {evidence.name}
                                  </p>

                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {evidence.uploadedBy} ·{" "}
                                    {evidence.uploadedAt}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-background p-3">
                        <p className="text-xs text-muted-foreground">
                          Submitted for review
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {selectedAction
                            .submittedForReviewAt ||
                            "—"}
                        </p>
                      </div>

                      <div className="rounded-lg border bg-background p-3">
                        <p className="text-xs text-muted-foreground">
                          Auditor
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {selectedAction.auditor ||
                            "Rumesh Ravi"}
                        </p>
                      </div>
                    </div>

                    {canReview ? <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowSendBack(true)}
                      >
                        Send Back
                      </Button>

                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() =>
                          handleVerifyAndClose(
                            selectedAction.id
                          )
                        }
                      >
                        <CheckCircle2 className="mr-2 size-4" />
                        Verify & Close
                      </Button>
                    </div> : <p className="mt-4 rounded-lg border bg-background p-3 text-xs text-muted-foreground">Awaiting review by {selectedAction.createdByName ?? selectedAction.auditor ?? "the action creator"}.</p>}

                    {showSendBack && canReview && (
                      <div className="mt-4 rounded-lg border border-destructive/30 bg-background p-3">
                        <label htmlFor="send-back-remark" className="text-sm font-medium">Send Action Back</label>
                        <Textarea id="send-back-remark" value={sendBackRemark} onChange={(event) => setSendBackRemark(event.target.value)} placeholder="Explain what needs to be corrected..." className="mt-2 min-h-20" />
                        <div className="mt-3 flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => setShowSendBack(false)}>Cancel</Button><Button variant="destructive" size="sm" disabled={!sendBackRemark.trim()} onClick={() => handleSendBack(selectedAction.id)}>Send Back</Button></div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* =================================================
                  COMPLETED
                  ================================================= */}

              {selectedAction.status ===
                "Completed" && (
                <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

                      <div>
                        <p className="text-sm font-medium">
                          Action verified & closed
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Completed on{" "}
                          {selectedAction.completedAt ??
                            "—"}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() =>
                        handleViewReport(
                          selectedAction.id
                        )
                      }
                    >
                      <FileText className="mr-2 size-4" />
                      View Report
                    </Button>
                  </div>
                </section>
              )}

              {(selectedAction.activityHistory?.length ?? 0) > 0 && (
                <section>
                  <div className="flex items-center gap-2"><History className="size-4 text-muted-foreground" /><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Activity</p></div>
                  <div className="mt-3 space-y-3 border-l border-border pl-4">
                    {selectedAction.activityHistory!.map((item) => (
                      <div key={item.id} className="relative text-sm before:absolute before:-left-[19px] before:top-1.5 before:size-2 before:rounded-full before:bg-primary">
                        <p className="font-medium">{formatActivityType(item.type)}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.actorName} · {new Date(item.createdAt).toLocaleString()}</p>
                        {item.remark && <p className="mt-2 rounded-md bg-muted/50 p-2 text-xs leading-5">{item.remark}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* =================================================
                  EVIDENCE LIST FOR COMPLETED ACTIONS
                  ================================================= */}

              {selectedAction.status ===
                "Completed" && (
                <section>
                  <div>
                    <p className="text-sm font-semibold">
                      Evidence
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Evidence attached to this action.
                    </p>
                  </div>

                  <div className="mt-3 space-y-2">
                    {selectedAction.evidence.map(
                      (evidence) => (
                        <div
                          key={evidence.id}
                          className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                              {evidence.type === "image" &&
                              evidence.url ? (
                                <img
                                  src={evidence.url}
                                  alt={evidence.name}
                                  className="size-full object-cover"
                                />
                              ) : evidence.type ===
                                "image" ? (
                                <ImageIcon className="size-4 text-muted-foreground" />
                              ) : (
                                <FileText className="size-4 text-muted-foreground" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {evidence.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                Uploaded by{" "}
                                {
                                  evidence.uploadedBy
                                }{" "}
                                ·{" "}
                                {
                                  evidence.uploadedAt
                                }
                              </p>
                            </div>
                          </div>

                          <Badge variant="secondary">
                            Evidence
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* =================================================
              DRAWER FOOTER
              ================================================= */}

          <div className="mobile-safe-bottom shrink-0 border-t bg-background px-4 py-3 sm:px-6 sm:py-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleCloseAction}
            >
              Close
            </Button>
          </div>
        </aside>

        {previewEvidence && (
          <div
            className="fixed inset-0 z-[10002] flex flex-col bg-slate-950/95"
            role="dialog"
            aria-modal="true"
            aria-label={`Preview ${previewEvidence.name}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setPreviewEvidence(null);
            }}
          >
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/10 bg-slate-950 px-4 py-3 text-white sm:px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" title={previewEvidence.name}>{previewEvidence.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">Uploaded by {previewEvidence.uploadedBy} · {previewEvidence.uploadedAt}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button type="button" variant="ghost" size="icon-sm" className="text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => void previewRef.current?.requestFullscreen?.()} aria-label="Enter full screen" title="Full screen">
                  <Maximize2 className="size-4" />
                </Button>
                {previewEvidence.url && (
                  <Button nativeButton={false} render={<a href={previewEvidence.url} target="_blank" rel="noreferrer" />} variant="ghost" size="icon-sm" className="text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Open original" title="Open original">
                    <ExternalLink className="size-4" />
                  </Button>
                )}
                <Button type="button" variant="ghost" size="icon-sm" className="text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setPreviewEvidence(null)} aria-label="Close preview">
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <div ref={previewRef} className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
              {previewEvidence.type === "image" && previewEvidence.url ? (
                // Evidence is stored as a local data URL and should retain its natural aspect ratio.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewEvidence.url} alt={previewEvidence.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="rounded-xl border border-white/10 bg-slate-900 px-8 py-10 text-center text-white">
                  <FileText className="mx-auto size-10 text-slate-400" />
                  <p className="mt-4 text-sm font-medium">{previewEvidence.name}</p>
                  <p className="mt-1 text-xs text-slate-400">Preview unavailable for this file type.</p>
                  {previewEvidence.url && <Button nativeButton={false} render={<a href={previewEvidence.url} target="_blank" rel="noreferrer" />} variant="secondary" size="sm" className="mt-5"><ExternalLink className="size-4" />Open File</Button>}
                </div>
              )}
            </div>
          </div>
        )}
      </>,
      document.body
    );
  }

  /* =========================================================
     MAIN PAGE
     ========================================================= */

  return (
    <>
      <PageContainer>
        {/* ===================================================
            PAGE HEADER
            =================================================== */}

        <FiveSPageHeader
          eyebrow="5S Workspace"
          title="Actions"
          description="Manage assigned corrective actions and track them through verification and closure."
        />

        {/* ===================================================
            KPI CARDS
            =================================================== */}

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <StatCard label="Total Actions" value={totalActions} description="Assigned to you" icon={ClipboardCheck} />
          <StatCard label="Open" value={openActions} description="Yet to be started" icon={Clock3} />
          <StatCard label="In Progress" value={inProgressActions} description="Currently being worked on" icon={Target} />
          <StatCard label="Overdue" value={overdueActions} description="Require attention" icon={AlertCircle} />
          <StatCard label="Awaiting Review" value={awaitingReviewActions} description="Pending auditor verification" icon={Eye} />
          <StatCard label="Completed" value={completedActions} description="Successfully closed" icon={CheckCircle2} />
        </div>

        {/* ===================================================
            ACTION LIST
            =================================================== */}

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 pb-3 sm:pt-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-base">
                  Action Plans
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Actions requiring your attention.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search actions..."
                  className="pl-9 sm:w-64"
                />
              </div>
            </div>

            {/* =================================================
                FILTERS
                ================================================= */}

            <div className="flex flex-wrap gap-2 pt-1">
              {(
                [
                  "All",
                  "Assigned",
                  "Open",
                  "In Progress",
                  "Overdue",
                  "Pending Review",
                  "Awaiting Review",
                  "Rework Required",
                  "Completed",
                ] as const
              ).map((status) => (
                <Button
                  key={status}
                  type="button"
                  size="sm"
                  variant={
                    statusFilter === status
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setStatusFilter(status)
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            {filteredActions.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <CheckCircle2 className="size-8 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  No actions found
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try changing your search or filter.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActions.map((action) => {
                  const status =
                    STATUS_CONFIG[action.status];

                  const priority =
                    PRIORITY_CONFIG[action.priority];

                  return (
                    <article
                      key={action.id}
                      className="
                        w-full
                        rounded-lg
                        border border-border/70
                        bg-muted/15
                        p-4 sm:p-5
                        text-left
                        transition-all
                        duration-200
                        hover:-translate-y-[1px]
                        hover:border-border
                        hover:bg-muted/35
                        hover:shadow-[0_8px_24px_-20px_rgb(16_24_40/0.35)]
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring
                        focus-visible:ring-offset-2
                      "
                    >
                      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="min-w-0 break-words text-sm font-semibold">
                              {action.title}
                            </h3>

                            <Badge
                              variant={
                                status.variant
                              }
                            >
                              {status.label}
                            </Badge>

                            <Badge
                              variant={
                                priority.variant
                              }
                            >
                              {priority.label}
                            </Badge>
                          </div>

                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {action.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span>
                              {action.source}:{" "}
                              {action.sourceTitle}
                            </span>

                            <span>
                              {action.plant} ·{" "}
                              {action.area}
                            </span>

                            <span>Responsible: {action.responsiblePersonName ?? action.assignedTo}</span>

                            <span>Raised by: {action.createdByName ?? action.auditor ?? "—"}</span>

                            {action.status === "Completed" && (
                              <span>Approved by: {action.reviewedBy ?? action.auditor ?? "—"}</span>
                            )}

                            {action.actionCategory && <span>{action.actionCategory}</span>}

                            {action.costSaving !== undefined && <span>₹{action.costSaving.toLocaleString("en-IN")}</span>}

                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-3.5" />

                              Due{" "}
                              {action.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {action.evidence.length >
                            0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Paperclip className="size-3.5" />

                              {
                                action.evidence
                                  .length
                              }
                            </span>
                          )}

                          <Button size="sm" variant="outline" onClick={() => handleOpenAction(action)}>
                            <Eye className="size-3.5" /> View
                          </Button>
                          {action.status === "Completed" && (
                            <Button size="sm" variant="outline" title="View improvement report" onClick={() => handleViewReport(action.id)}>
                              <FileText className="size-3.5" /> Report
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </PageContainer>

      {/* =====================================================
          PORTALED DRAWER
          ===================================================== */}

      {renderActionDrawer()}
    </>
  );
}

function CompactDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p
        className="mt-0.5 truncate text-sm font-medium"
        title={value}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function formatActivityType(type: NonNullable<MyAction["activityHistory"]>[number]["type"]) {
  const labels = {
    created: "Action created",
    awaiting_assignment: "Awaiting assignment",
    assigned: "Action assigned",
    started: "Work started",
    submitted: "Submitted for review",
    resubmitted: "Resubmitted for review",
    reviewed: "Reviewed",
    sent_back: "Sent back for rework",
    closed: "Action closed",
  } as const;
  return labels[type];
}

function PriorityDefinition({
  priority,
  description,
}: {
  priority: MyActionPriority;
  description: string;
}) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <div className="grid grid-cols-[92px_1fr] items-start gap-3">
      <div className="flex justify-start">
        <Badge
          variant={config.variant}
          className="shrink-0"
        >
          {config.label}
        </Badge>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
