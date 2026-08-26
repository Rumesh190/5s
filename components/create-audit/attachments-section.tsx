"use client"

import * as React from "react"
import { Paperclip, UploadCloud, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/create-audit/form-section"

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.pdf,.docx"

interface AttachmentsSectionProps {
  files: File[]
  onFilesAdded: (files: File[]) => void
  onRemove: (index: number) => void
}

/** UI-only file upload — nothing is actually uploaded; no backend exists yet. */
function AttachmentsSection({ files, onFilesAdded, onRemove }: AttachmentsSectionProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = React.useState(false)

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    onFilesAdded(Array.from(fileList))
  }

  return (
    <FormSection
      id="attachments"
      title="Attachments"
      description="Upload supporting evidence — JPG, PNG, PDF, or DOCX."
      contentClassName="grid-cols-1"
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
          handleFiles(event.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center transition-colors",
          dragActive ? "border-blue-400 bg-blue-50 dark:bg-blue-500/10" : "hover:bg-muted/50"
        )}
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">JPG, PNG, PDF, or DOCX</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{file.name}</span>
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </FormSection>
  )
}

export { AttachmentsSection }
