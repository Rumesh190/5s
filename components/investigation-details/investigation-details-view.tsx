"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react"

import VerificationSection from "./VerificationSection"

import { AttachmentsPanel } from "@/components/audit-details/attachments-panel"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { CorrectiveActionSection } from "@/components/investigation-details/corrective-action-section"
import { FiveWhySection } from "@/components/investigation-details/five-why-section"
import { InvestigationDetailsHeader } from "@/components/investigation-details/investigation-details-header"
import { InvestigationDetailsSkeleton } from "@/components/investigation-details/investigation-details-skeleton"
import { InvestigationProgress } from "@/components/investigation-details/investigation-progress"
import { InvestigationSummary } from "@/components/investigation-details/investigation-summary"
import { InvestigationTimeline } from "@/components/investigation-details/investigation-timeline"
import { PreventiveActionSection } from "@/components/investigation-details/preventive-action-section"
import { RootCauseSection } from "@/components/investigation-details/root-cause-section"

import {
  fiveWhyComplete,
  getInvestigationDetails,
} from "@/lib/mock/investigations.mock"

import type {
  CorrectiveAction,
  InvestigationStatus,
  PreventiveAction,
  RootCause,
  WhyStep,
} from "@/types/investigation"

import type { VerificationRecord } from "./types/verification"

const MOCK_LOAD_DELAY_MS = 500

interface InvestigationDetailsViewProps {
  investigationId: string
}

const DEFAULT_VERIFICATION: VerificationRecord = {
  result: "Pending",
  verifiedBy: null,
  verifiedAt: null,
  comments: "",
  failureReason: "",
}

function InvestigationDetailsView({
  investigationId,
}: InvestigationDetailsViewProps) {
  const [loading, setLoading] = React.useState(true)

  const initial = React.useMemo(
    () => getInvestigationDetails(investigationId),
    [investigationId]
  )

  const [whySteps, setWhySteps] = React.useState<WhyStep[]>(
    initial?.whySteps ?? []
  )

  const [rootCause, setRootCause] =
    React.useState<RootCause | null>(
      initial?.rootCause ?? null
    )

  const [correctiveAction, setCorrectiveAction] =
    React.useState<CorrectiveAction | null>(
      initial?.correctiveAction ?? null
    )

  const [preventiveAction, setPreventiveAction] =
    React.useState<PreventiveAction | null>(
      initial?.preventiveAction ?? null
    )

  const [status, setStatus] =
    React.useState<InvestigationStatus | undefined>(
      initial?.status
    )

  const [verification, setVerification] =
    React.useState<VerificationRecord>(
      DEFAULT_VERIFICATION
    )
const [timeline, setTimeline] =
  React.useState(initial?.timeline ?? [])

  const [banner, setBanner] =
    React.useState<string | null>(null)

  const [saving, setSaving] =
    React.useState(false)

  const [completing, setCompleting] =
    React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(
      () => setLoading(false),
      MOCK_LOAD_DELAY_MS
    )

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <PageContainer>
        <InvestigationDetailsSkeleton />
      </PageContainer>
    )
  }

  if (!initial) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-24 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <AlertTriangle className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              Investigation not found
            </p>

            <p className="max-w-sm text-sm text-muted-foreground">
              &ldquo;{investigationId}&rdquo; doesn&apos;t
              match any investigation in the system.
            </p>
          </div>

          <Button
            render={<Link href="/investigations" />}
            nativeButton={false}
            variant="outline"
          >
            Back to Investigations
          </Button>
        </div>
      </PageContainer>
    )
  }

  const investigation = {
    ...initial,
    status: status ?? initial.status,
  }

  /*
   * Once closed, investigation fields become read-only.
   *
   * Awaiting Verification remains editable because the
   * verification decision is handled by VerificationSection.
   */
  const disabled =
    investigation.status === "Closed"

  const canComplete =
    fiveWhyComplete(whySteps) &&
    rootCause !== null &&
    correctiveAction !== null

  function updateWhyStep(
    step: number,
    patch: Partial<WhyStep>
  ) {
    setWhySteps((previous) =>
      previous.map((why) =>
        why.step === step
          ? { ...why, ...patch }
          : why
      )
    )
  }

  function updateRootCause(
    patch: Partial<RootCause>
  ) {
    setRootCause((previous) => ({
      category:
        previous?.category ?? "Method / Process",
      description:
        previous?.description ?? "",
      contributingFactors:
        previous?.contributingFactors ?? [],
      summary:
        previous?.summary ?? "",
      ...patch,
    }))
  }

  function updateCorrectiveAction(
    patch: Partial<CorrectiveAction>
  ) {
    setCorrectiveAction((previous) => ({
      description:
        previous?.description ?? "",
      owner:
        previous?.owner ?? "",
      targetDate:
        previous?.targetDate ?? "",
      priority:
        previous?.priority ?? "Medium",
      notes:
        previous?.notes ?? "",
      ...patch,
    }))
  }

  function updatePreventiveAction(
    patch: Partial<PreventiveAction>
  ) {
    setPreventiveAction((previous) => ({
      description:
        previous?.description ?? "",
      owner:
        previous?.owner ?? "",
      targetDate:
        previous?.targetDate ?? "",
      notes:
        previous?.notes ?? "",
      ...patch,
    }))
  }

  function handleSaveDraft() {
    setSaving(true)

    setTimeout(() => {
      setSaving(false)
      setBanner("Draft saved.")
    }, MOCK_LOAD_DELAY_MS)
  }

  function handleSaveInvestigation() {
    setSaving(true)

    setTimeout(() => {
      setSaving(false)
      setBanner(
        "Investigation saved successfully."
      )
    }, MOCK_LOAD_DELAY_MS)
  }

  function handleComplete() {
    if (!canComplete) return

    setCompleting(true)

    setTimeout(() => {
      setCompleting(false)

      /*
       * Investigation is NOT closed here.
       * It moves to QA verification.
       */
      setStatus("Awaiting Verification")

      

      /*
       * Reset any previous verification result
       * when a new verification cycle begins.
       */
      setVerification({
        result: "Pending",
        verifiedBy: null,
        verifiedAt: null,
        comments: "",
        failureReason: "",
      })

      setTimeline((previous) => [
  {
    id: `verification-requested-${Date.now()}`,
    type: "Investigation Completed",
    description:
      "Investigation completed and sent for verification.",
    actor: "Current User",
    timestamp: "Just now",
  },
  ...previous,
])

      setBanner(
        "Investigation completed and sent for verification."
      )
    }, MOCK_LOAD_DELAY_MS)
  }

function handleVerification(
  result: "Passed" | "Failed",
  comments: string,
  failureReason: string
) {
  const verifiedAt =
    new Date().toLocaleString()

  const verificationRecord: VerificationRecord = {
    result,
    verifiedBy: "QA User",
    verifiedAt,
    comments,
    failureReason,
  }

  setVerification(
    verificationRecord
  )

  if (result === "Passed") {
    setStatus("Closed")

    setTimeline((previous) => [
      {
        id: `verification-passed-${Date.now()}`,
        type: "Verification Passed",
        description:
          comments ||
          "Corrective action verified successfully. Investigation closed.",
        actor: "QA User",
        timestamp: "Just now",
      },
      ...previous,
    ])

    setBanner(
      "Verification passed. Investigation closed."
    )

    return
  }

  setStatus("In Progress")

  setTimeline((previous) => [
    {
      id: `verification-failed-${Date.now()}`,
      type: "Verification Failed",
      description:
        failureReason ||
        "Corrective action was not effective.",
      actor: "QA User",
      timestamp: "Just now",
    },
    ...previous,
  ])

  setBanner(
    "Verification failed. Investigation returned for corrective action."
  )
}

  return (
    <PageContainer>
      <InvestigationDetailsHeader
        investigation={investigation}
      />

      {banner && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          {banner}
        </div>
      )}

      <InvestigationProgress
        progress={investigation.progress}
        whySteps={whySteps}
        hasRootCause={
          rootCause !== null
        }
      />

      <InvestigationSummary
        investigation={investigation}
        onStatusChange={setStatus}
      />

      <FiveWhySection
        whySteps={whySteps}
        onChange={updateWhyStep}
        disabled={disabled}
      />

      <RootCauseSection
        rootCause={rootCause}
        disabled={disabled}
        onChange={updateRootCause}
      />

      <CorrectiveActionSection
        action={correctiveAction}
        disabled={disabled}
        onChange={updateCorrectiveAction}
      />

      <PreventiveActionSection
        action={preventiveAction}
        disabled={disabled}
        onChange={updatePreventiveAction}
      />

      {/* Verification */}
      <VerificationSection
        status={
          investigation.status ===
          "Awaiting Verification"
            ? "Awaiting Verification"
            : investigation.status === "Closed"
              ? "Closed"
              : "In Progress"
        }
        verification={verification}
        onVerified={handleVerification}
      />

      <InvestigationTimeline
  timeline={timeline}
/>

      <AttachmentsPanel
        attachments={initial.attachments}
      />

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          render={
            <Link href="/investigations" />
          }
          nativeButton={false}
        >
          Cancel
        </Button>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={
              saving ||
              completing ||
              disabled
            }
            onClick={handleSaveDraft}
          >
            {saving && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Save Draft
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={
              saving ||
              completing ||
              disabled
            }
            onClick={
              handleSaveInvestigation
            }
          >
            {saving && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Save Investigation
          </Button>

          <Button
            type="button"
            disabled={
              !canComplete ||
              completing ||
              disabled ||
              investigation.status ===
                "Awaiting Verification"
            }
            onClick={handleComplete}
            className="bg-blue-600 text-white hover:bg-blue-600/90"
          >
            {completing && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Complete Investigation
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

export { InvestigationDetailsView }