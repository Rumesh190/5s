import { CREATE_AUDIT_SECTIONS, type CreateAuditSection } from "@/lib/create-audit/schema"

const SECTION_LABELS: Record<CreateAuditSection, string> = {
  "basic-information": "Basic Information",
  location: "Location",
  "audit-details": "Audit Details",
  "audit-team": "Audit Team",
  schedule: "Schedule",
  attachments: "Attachments",
  review: "Review & Submit",
}

/** Desktop-only anchor rail so the user always knows where they are and what remains. */
function CreateAuditSectionNav() {
  return (
    <nav aria-label="Form sections" className="hidden lg:block">
      <ol className="sticky top-20 flex flex-col gap-1 border-l border-border pl-4">
        {CREATE_AUDIT_SECTIONS.map((section, index) => (
          <li key={section}>
            <a
              href={`#${section}`}
              className="flex items-center gap-2 rounded-md py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px]">
                {index + 1}
              </span>
              {SECTION_LABELS[section]}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { CreateAuditSectionNav }
