"use client"

import * as React from "react"
import {
  CheckCircle2,
  CircleAlert,
  File,
  FileImage,
  FileText,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import type { VerificationRecord } from "./types/verification"

interface VerificationEvidence {
  id: string
  file: File
  name: string
  size: number
  type: string
}

interface VerificationSectionProps {
  status:
    | "Awaiting Verification"
    | "Closed"
    | "In Progress"

  verification?: VerificationRecord

  onVerified: (
    result: "Passed" | "Failed",
    comments: string,
    failureReason: string
  ) => void
}

const DEFAULT_VERIFICATION: VerificationRecord = {
  result: "Pending",
  verifiedBy: null,
  verifiedAt: null,
  comments: "",
  failureReason: "",
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return FileImage
  }

  if (type === "application/pdf") {
    return FileText
  }

  return File
}

export default function VerificationSection({
  status,
  verification = DEFAULT_VERIFICATION,
  onVerified,
}: VerificationSectionProps) {
  const [comments, setComments] = React.useState(
    verification.comments ?? ""
  )

  const [failureReason, setFailureReason] =
    React.useState(
      verification.failureReason ?? ""
    )

  const [evidence, setEvidence] =
    React.useState<VerificationEvidence[]>([])

  const [submitting, setSubmitting] =
    React.useState(false)

  const [fileError, setFileError] =
    React.useState<string | null>(null)

  const fileInputRef =
    React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setComments(
        verification.comments ?? ""
      )

      setFailureReason(
        verification.failureReason ?? ""
      )
    })
    return () => {
      cancelled = true
    }
  }, [
    verification.comments,
    verification.failureReason,
  ])

  const isPending =
    status === "Awaiting Verification"

  const isPassed =
    status === "Closed" &&
    verification.result === "Passed"

  const isFailed =
    status === "In Progress" &&
    verification.result === "Failed"

  function handleSelectFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    )

    if (!files.length) {
      return
    }

    setFileError(null)

    const invalidFile = files.find(
      (file) =>
        !ACCEPTED_FILE_TYPES.includes(
          file.type
        )
    )

    if (invalidFile) {
      setFileError(
        `"${invalidFile.name}" is not a supported file type.`
      )

      event.target.value = ""
      return
    }

    const oversizedFile = files.find(
      (file) =>
        file.size > MAX_FILE_SIZE
    )

    if (oversizedFile) {
      setFileError(
        `"${oversizedFile.name}" exceeds the 10 MB file size limit.`
      )

      event.target.value = ""
      return
    }

    const existingNames = new Set(
      evidence.map((item) => item.name)
    )

    const newEvidence = files
      .filter(
        (file) =>
          !existingNames.has(file.name)
      )
      .map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }))

    setEvidence((previous) => [
      ...previous,
      ...newEvidence,
    ])

    event.target.value = ""
  }

  function handleRemoveEvidence(id: string) {
    setEvidence((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    )
  }

  function handleVerification(
    result: "Passed" | "Failed"
  ) {
    if (
      result === "Failed" &&
      !failureReason.trim()
    ) {
      return
    }

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)

      onVerified(
        result,
        comments.trim(),
        failureReason.trim()
      )
    }, 400)
  }

  function renderEvidenceIcon(
    type: string
  ) {
    const Icon = getFileIcon(type)

    return (
      <Icon className="size-4" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Verification
            </CardTitle>

            <CardDescription>
              Verify that the corrective action has
              resolved the identified issue.
            </CardDescription>
          </div>

          <Badge
            variant={
              isPassed
                ? "default"
                : isFailed
                  ? "danger"
                  : "secondary"
            }
          >
            {verification.result}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Verification status */}
        <div className="grid gap-3 sm:grid-cols-3">

          <div
            className={[
              "rounded-lg border p-4",
              isPending
                ? "border-primary bg-primary/5"
                : "border-border",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  "flex size-7 items-center justify-center rounded-full",
                  isPending
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                <CircleAlert className="size-4" />
              </span>

              <div>
                <p className="text-sm font-medium">
                  Pending
                </p>

                <p className="text-xs text-muted-foreground">
                  Awaiting QA verification
                </p>
              </div>
            </div>
          </div>

          <div
            className={[
              "rounded-lg border p-4",
              isPassed
                ? "border-primary bg-primary/5"
                : "border-border",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  "flex size-7 items-center justify-center rounded-full",
                  isPassed
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                <CheckCircle2 className="size-4" />
              </span>

              <div>
                <p className="text-sm font-medium">
                  Passed
                </p>

                <p className="text-xs text-muted-foreground">
                  Issue successfully resolved
                </p>
              </div>
            </div>
          </div>

          <div
            className={[
              "rounded-lg border p-4",
              isFailed
                ? "border-destructive bg-destructive/5"
                : "border-border",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  "flex size-7 items-center justify-center rounded-full",
                  isFailed
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                <CircleAlert className="size-4" />
              </span>

              <div>
                <p className="text-sm font-medium">
                  Failed
                </p>

                <p className="text-xs text-muted-foreground">
                  Corrective action needs review
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Verification comments */}
        <div className="space-y-2">
          <label
            htmlFor="verification-comments"
            className="text-sm font-medium"
          >
            Verification Comments
          </label>

          <Textarea
            id="verification-comments"
            placeholder="Add verification findings or comments..."
            value={comments}
            onChange={(event) =>
              setComments(event.target.value)
            }
            disabled={!isPending || submitting}
            rows={4}
          />

          <p className="text-xs text-muted-foreground">
            Record the evidence or observations supporting
            the verification decision.
          </p>
        </div>

        {/* Verification evidence */}
        {isPending && (
          <div className="space-y-3">

            <div>
              <label className="text-sm font-medium">
                Verification Evidence
              </label>

              <p className="mt-1 text-xs text-muted-foreground">
                Attach photos, reports, measurements, or
                other evidence supporting the verification.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept={[
                "image/jpeg",
                "image/png",
                "image/webp",
                "application/pdf",
                ".txt",
                ".docx",
                ".xlsx",
              ].join(",")}
              onChange={handleSelectFiles}
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={submitting}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-background ring-1 ring-border">
                <Upload className="size-4 text-muted-foreground" />
              </span>

              <span className="text-sm font-medium">
                Upload verification evidence
              </span>

              <span className="text-xs text-muted-foreground">
                Images, PDF, Word, Excel or text files
                up to 10 MB
              </span>
            </button>

            {fileError && (
              <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {fileError}
              </div>
            )}

            {evidence.length > 0 && (
              <div className="space-y-2">
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      {renderEvidenceIcon(
                        item.type
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(
                          item.size
                        )}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        handleRemoveEvidence(
                          item.id
                        )
                      }
                      disabled={submitting}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Failure reason */}
        {isPending && (
          <div className="space-y-2">
            <label
              htmlFor="verification-failure-reason"
              className="text-sm font-medium"
            >
              Failure Reason
              <span className="ml-1 text-destructive">
                *
              </span>
            </label>

            <Textarea
              id="verification-failure-reason"
              placeholder="Explain why the corrective action was not effective..."
              value={failureReason}
              onChange={(event) =>
                setFailureReason(
                  event.target.value
                )
              }
              disabled={submitting}
              rows={3}
            />

            <p className="text-xs text-muted-foreground">
              Required only when verification fails.
            </p>
          </div>
        )}

        {/* Actions */}
        {isPending && (
          <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="outline"
              disabled={
                submitting ||
                !failureReason.trim()
              }
              onClick={() =>
                handleVerification("Failed")
              }
            >
              <CircleAlert className="size-4" />

              {submitting
                ? "Saving..."
                : "Fail Verification"}
            </Button>

            <Button
              type="button"
              disabled={submitting}
              onClick={() =>
                handleVerification("Passed")
              }
            >
              <CheckCircle2 className="size-4" />

              {submitting
                ? "Saving..."
                : "Pass Verification"}
            </Button>

          </div>
        )}

        {/* Passed */}
        {isPassed && (
          <div className="rounded-lg bg-primary/5 p-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 text-primary" />

              <div className="space-y-2">
                <p className="font-medium">
                  Verification passed
                </p>

                <p className="text-muted-foreground">
                  The corrective action was verified
                  successfully and the investigation has
                  been closed.
                </p>

                {verification.comments && (
                  <p className="text-muted-foreground">
                    {verification.comments}
                  </p>
                )}

                {verification.verifiedBy && (
                  <p className="text-xs text-muted-foreground">
                    Verified by{" "}
                    {verification.verifiedBy}
                    {verification.verifiedAt
                      ? ` · ${verification.verifiedAt}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Failed */}
        {isFailed && (
          <div className="rounded-lg bg-destructive/5 p-4 text-sm">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 size-4 text-destructive" />

              <div className="space-y-2">
                <div>
                  <p className="font-medium">
                    Verification failed
                  </p>

                  <p className="mt-1 text-muted-foreground">
                    The corrective action was not effective.
                    The investigation has been returned
                    for further action.
                  </p>
                </div>

                {verification.failureReason && (
                  <div>
                    <p className="text-xs font-medium">
                      Failure reason
                    </p>

                    <p className="mt-1 text-muted-foreground">
                      {verification.failureReason}
                    </p>
                  </div>
                )}

                {verification.comments && (
                  <div>
                    <p className="text-xs font-medium">
                      Comments
                    </p>

                    <p className="mt-1 text-muted-foreground">
                      {verification.comments}
                    </p>
                  </div>
                )}

                {verification.verifiedBy && (
                  <p className="text-xs text-muted-foreground">
                    Verified by{" "}
                    {verification.verifiedBy}
                    {verification.verifiedAt
                      ? ` · ${verification.verifiedAt}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
