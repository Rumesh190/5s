"use client"

import * as React from "react"
import { Download, Eye, FileText, Image as ImageIcon, Trash2, UploadCloud } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DetailSection } from "@/components/audit-details/detail-section"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AttachmentType, AuditAttachment } from "@/types/audit-details"

const TYPE_ICON: Record<AttachmentType, typeof ImageIcon> = {
  image: ImageIcon,
  document: FileText,
  pdf: FileText,
}

interface AttachmentsPanelProps {
  attachments: AuditAttachment[]
}

/** Attachments tab — upload is local-only (no backend yet), Preview shows a
 * placeholder (mock files have no real content to render). */
function AttachmentsPanel({ attachments: initialAttachments }: AttachmentsPanelProps) {
  const [attachments, setAttachments] = React.useState(initialAttachments)
  const [previewing, setPreviewing] = React.useState<AuditAttachment | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const additions: AuditAttachment[] = Array.from(fileList).map((file, index) => ({
      id: `new-${index}-${file.name}`,
      name: file.name,
      type: file.type.startsWith("image/")
        ? "image"
        : file.name.toLowerCase().endsWith(".pdf")
          ? "pdf"
          : "document",
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedBy: "You",
      uploadedAt: "Just now",
    }))
    setAttachments((previous) => [...additions, ...previous])
  }

  function removeAttachment(id: string) {
    setAttachments((previous) => previous.filter((attachment) => attachment.id !== id))
  }

  return (
    <>
      <DetailSection
        title="Attachments"
        description="Images, documents, and PDFs supporting this investigation."
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragActive(false)
            addFiles(event.dataTransfer.files)
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-8 text-center transition-colors",
            dragActive ? "border-blue-400 bg-blue-50 dark:bg-blue-500/10" : "hover:bg-muted/50"
          )}
        >
          <UploadCloud className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, PDF, or DOCX — not uploaded anywhere yet
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => addFiles(event.target.files)}
          />
        </div>

        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No files uploaded.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {attachments.map((attachment) => {
              const Icon = TYPE_ICON[attachment.type]
              return (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {attachment.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {attachment.sizeLabel} · {attachment.uploadedBy} · {attachment.uploadedAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Preview ${attachment.name}`}
                      onClick={() => setPreviewing(attachment)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Download ${attachment.name}`}>
                      <Download className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${attachment.name}`}
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </DetailSection>

      <Dialog open={previewing !== null} onOpenChange={(open) => !open && setPreviewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewing?.name}</DialogTitle>
            <DialogDescription>
              {previewing?.sizeLabel} · Uploaded by {previewing?.uploadedBy} · {previewing?.uploadedAt}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center rounded-lg bg-muted p-8 text-sm text-muted-foreground">
            Preview not available in this demo.
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  )
}

export { AttachmentsPanel }
