import Link from "next/link"

import { AuditSeverityBadge } from "@/components/audits/audit-severity-badge"
import { DetailSection } from "@/components/audit-details/detail-section"
import type { RelatedInvestigation } from "@/types/audit-details"

interface RelatedInvestigationsProps {
  investigations: RelatedInvestigation[]
}

function RelatedInvestigations({ investigations }: RelatedInvestigationsProps) {
  return (
    <DetailSection title="Related Investigations">
      {investigations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No related investigations linked to this audit.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {investigations.map((investigation) => (
            <li key={investigation.id}>
              <Link
                href="/investigations"
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">{investigation.id}</span>
                  <span className="text-muted-foreground">{investigation.title}</span>
                </span>
                <AuditSeverityBadge severity={investigation.severity} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DetailSection>
  )
}

export { RelatedInvestigations }
