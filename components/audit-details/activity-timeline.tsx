"use client"

import * as React from "react"
import {
  CheckCircle2,
  ClipboardPlus,
  FileUp,
  MessageSquare,
  PlusCircle,
  RefreshCcw,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DetailSection } from "@/components/audit-details/detail-section"
import { CURRENT_USER } from "@/lib/create-audit/master-data.mock"
import type { ActivityEvent, ActivityEventType } from "@/types/audit-details"

const EVENT_ICON: Record<ActivityEventType, typeof PlusCircle> = {
  "Audit Created": PlusCircle,
  "Status Changed": RefreshCcw,
  "User Assigned": UserPlus,
  "Investigation Updated": RefreshCcw,
  "Corrective Action Added": ClipboardPlus,
  "Attachment Uploaded": FileUp,
  "Audit Closed": CheckCircle2,
  "Comment Added": MessageSquare,
}

const EVENT_VERB: Record<ActivityEventType, string> = {
  "Audit Created": "created the audit",
  "Status Changed": "changed the status",
  "User Assigned": "assigned a user",
  "Investigation Updated": "updated the investigation",
  "Corrective Action Added": "added a finding",
  "Attachment Uploaded": "uploaded an attachment",
  "Audit Closed": "closed the audit",
  "Comment Added": "commented",
}

interface ActivityTimelineProps {
  activity: ActivityEvent[]
}

/** Comments + system events in one reverse-chronological feed, per the spec. */
function ActivityTimeline({ activity: initialActivity }: ActivityTimelineProps) {
  const [activity, setActivity] = React.useState(initialActivity)
  const [comment, setComment] = React.useState("")

  function handlePostComment() {
    if (!comment.trim()) return
    setActivity((previous) => [
      {
        id: `comment-${previous.length}-${Date.now()}`,
        type: "Comment Added",
        description: comment.trim(),
        actor: CURRENT_USER.name,
        timestamp: "Just now",
      },
      ...previous,
    ])
    setComment("")
  }

  return (
    <DetailSection title="Comments & Activity" description="Newest events appear first." contentClassName="gap-5">
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Add a comment..."
          rows={3}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <div className="flex justify-end">
          <Button size="sm" disabled={!comment.trim()} onClick={handlePostComment}>
            Post Comment
          </Button>
        </div>
      </div>

      {activity.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity recorded.</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {activity.map((event, index) => {
            const Icon = EVENT_ICON[event.type]
            return (
              <li key={event.id} className="relative flex gap-3 pb-1">
                {index < activity.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-7 left-[15px] h-[calc(100%-4px)] w-px bg-border"
                  />
                )}
                <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col gap-0.5 pt-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{event.actor}</span>{" "}
                    <span className="text-muted-foreground">{EVENT_VERB[event.type]}</span>
                  </p>
                  <p className="text-sm text-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </DetailSection>
  )
}

export { ActivityTimeline }
