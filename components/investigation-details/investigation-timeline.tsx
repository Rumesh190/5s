"use client"

import * as React from "react"
import {
  CheckCircle2,
  ClipboardPlus,
  FileUp,
  MessageSquare,
  PlusCircle,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DetailSection } from "@/components/audit-details/detail-section"
import { CURRENT_USER } from "@/lib/create-audit/master-data.mock"

import type {
  InvestigationEvent,
  InvestigationEventType,
} from "@/types/investigation"

const EVENT_ICON: Record<
  InvestigationEventType,
  typeof PlusCircle
> = {
  "Investigation Started": PlusCircle,
  "Why Answered": RefreshCcw,
  "Root Cause Documented": RefreshCcw,
  "Corrective Action Added": ClipboardPlus,
  "Preventive Action Added": ShieldCheck,
  "Status Changed": RefreshCcw,
  "Comment Added": MessageSquare,
  "Attachment Uploaded": FileUp,
  "Investigation Completed": CheckCircle2,
  "Verification Passed": CheckCircle2,
  "Verification Failed": XCircle,
}

const EVENT_VERB: Record<
  InvestigationEventType,
  string
> = {
  "Investigation Started":
    "started the investigation",

  "Why Answered":
    "answered a Why step",

  "Root Cause Documented":
    "documented the root cause",

  "Corrective Action Added":
    "added a corrective action",

  "Preventive Action Added":
    "added a preventive action",

  "Status Changed":
    "changed the status",

  "Comment Added":
    "commented",

  "Attachment Uploaded":
    "uploaded an attachment",

  "Investigation Completed":
    "completed the investigation",

  "Verification Passed":
    "passed verification",

  "Verification Failed":
    "failed verification",
}

interface InvestigationTimelineProps {
  timeline: InvestigationEvent[]
}

function InvestigationTimeline({
  timeline: initialTimeline,
}: InvestigationTimelineProps) {
  const [timeline, setTimeline] =
    React.useState(initialTimeline)

  const [comment, setComment] =
    React.useState("")

  /*
   * If the parent timeline changes,
   * synchronize the local timeline.
   */
  React.useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setTimeline(initialTimeline)
    })
    return () => {
      cancelled = true
    }
  }, [initialTimeline])

  function handlePostComment() {
    if (!comment.trim()) return

    const event: InvestigationEvent = {
      id: `comment-${Date.now()}`,
      type: "Comment Added",
      description: comment.trim(),
      actor: CURRENT_USER.name,
      timestamp: "Just now",
    }

    setTimeline((previous) => [
      event,
      ...previous,
    ])

    setComment("")
  }

  return (
    <DetailSection
      title="Timeline & Comments"
      description="Newest events appear first."
      contentClassName="gap-5"
    >
      {/* Comment composer */}
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Add a comment..."
          rows={3}
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
        />

        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={!comment.trim()}
            onClick={handlePostComment}
          >
            Post Comment
          </Button>
        </div>
      </div>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No activity recorded.
        </p>
      ) : (
        <ol className="flex flex-col gap-4">
          {timeline.map((event, index) => {
            const Icon = EVENT_ICON[event.type]

            const isVerificationPassed =
              event.type ===
              "Verification Passed"

            const isVerificationFailed =
              event.type ===
              "Verification Failed"

            return (
              <li
                key={event.id}
                className="relative flex gap-3 pb-1"
              >
                {index <
                  timeline.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-7 left-[15px] h-[calc(100%-4px)] w-px bg-border"
                  />
                )}

                <span
                  className={[
                    "z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                    isVerificationPassed
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : isVerificationFailed
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  <Icon className="size-4" />
                </span>

                <div className="flex flex-col gap-0.5 pt-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">
                      {event.actor}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {EVENT_VERB[event.type]}
                    </span>
                  </p>

                  <p className="text-sm text-foreground">
                    {event.description}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {event.timestamp}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </DetailSection>
  )
}

export { InvestigationTimeline }
