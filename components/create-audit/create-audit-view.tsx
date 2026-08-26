"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Loader2 } from "lucide-react"
import { FormProvider, useForm, type FieldErrors } from "react-hook-form"

import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { AttachmentsSection } from "@/components/create-audit/attachments-section"
import { AuditDetailsSection } from "@/components/create-audit/audit-details-section"
import { AuditTeamSection } from "@/components/create-audit/audit-team-section"
import { BasicInformationSection } from "@/components/create-audit/basic-information-section"
import { CreateAuditSectionNav } from "@/components/create-audit/create-audit-section-nav"
import { LocationSection } from "@/components/create-audit/location-section"
import { ReviewSection } from "@/components/create-audit/review-section"
import { ScheduleSection } from "@/components/create-audit/schedule-section"
import {
  CREATE_AUDIT_DEFAULT_VALUES,
  createAuditSchema,
  type CreateAuditFormValues,
  type CreateAuditSection,
} from "@/lib/create-audit/schema"

// No backend exists yet — Save Draft / Submit both simulate a request.
// Replace with audit-service.ts once POST /api/v1/audits
// (docs/02_Engineering/21_API_Contracts.md) is implemented.
const SIMULATED_DELAY_MS = 600

const FIELD_SECTION_MAP: Partial<Record<keyof CreateAuditFormValues, CreateAuditSection>> = {
  auditTitle: "basic-information",
  auditType: "basic-information",
  severity: "basic-information",
  productName: "basic-information",
  region: "location",
  plant: "location",
  city: "location",
  department: "location",
  productionLine: "location",
  problemDescription: "audit-details",
  observation: "audit-details",
  quantityAffected: "audit-details",
  immediateAction: "audit-details",
  additionalNotes: "audit-details",
  leadInvestigator: "audit-team",
  teamMembers: "audit-team",
  auditDate: "schedule",
  targetCompletionDate: "schedule",
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

function CreateAuditView() {
  const router = useRouter()
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [submitting, setSubmitting] = React.useState(false)
  const [savingDraft, setSavingDraft] = React.useState(false)
  const [banner, setBanner] = React.useState<string | null>(null)

  const form = useForm<CreateAuditFormValues>({
    resolver: zodResolver(createAuditSchema),
    defaultValues: CREATE_AUDIT_DEFAULT_VALUES,
    mode: "onBlur",
  })

  function handleInvalid(errors: FieldErrors<CreateAuditFormValues>) {
    const firstField = Object.keys(errors)[0] as keyof CreateAuditFormValues | undefined
    const section = firstField ? FIELD_SECTION_MAP[firstField] : undefined
    if (section) scrollToSection(section)
  }

  function handleSaveDraft() {
    setSavingDraft(true)
    setTimeout(() => {
      setSavingDraft(false)
      setBanner("Draft saved. You can continue this audit later from the Audit List.")
    }, SIMULATED_DELAY_MS)
  }

  function onSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setBanner("Audit created successfully. Redirecting to the audit list...")
      setTimeout(() => router.push("/audits"), 900)
    }, SIMULATED_DELAY_MS)
  }

  const disabled = submitting || savingDraft

  return (
    <FormProvider {...form}>
      <PageContainer
        title="Create Audit"
        description="Report a manufacturing quality issue and route it for investigation."
      >
        {banner && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            {banner}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <CreateAuditSectionNav />

          <form
            onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
            className="flex flex-col gap-6"
            noValidate
          >
            <BasicInformationSection />
            <LocationSection />
            <AuditDetailsSection />
            <AuditTeamSection />
            <ScheduleSection />
            <AttachmentsSection
              files={attachments}
              onFilesAdded={(files) => setAttachments((previous) => [...previous, ...files])}
              onRemove={(index) =>
                setAttachments((previous) => previous.filter((_, i) => i !== index))
              }
            />
            <ReviewSection attachmentCount={attachments.length} />

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                onClick={() => router.push("/audits")}
              >
                Cancel
              </Button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  onClick={handleSaveDraft}
                >
                  {savingDraft && <Loader2 className="size-4 animate-spin" />}
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={disabled}
                  className="bg-blue-600 text-white hover:bg-blue-600/90"
                >
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  Submit Audit
                </Button>
              </div>
            </div>
          </form>
        </div>
      </PageContainer>
    </FormProvider>
  )
}

export { CreateAuditView }
