"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"

import { AuditSeverityBadge } from "@/components/audits/audit-severity-badge"
import { InvestigationStatusBadge } from "@/components/investigations/investigation-status-badge"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { InvestigationRecord } from "@/types/investigation"

interface InvestigationTableProps {
  investigations: InvestigationRecord[]
}

function InvestigationTable({
  investigations,
}: InvestigationTableProps) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Investigation</TableHead>
          <TableHead>Linked Audit</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {investigations.map((investigation) => (
          <TableRow
            key={investigation.id}
            onClick={() =>
              router.push(`/investigations/${investigation.id}`)
            }
          >
            <TableCell className="font-medium">
              {investigation.id}
              <div className="text-muted-foreground">
                {investigation.title}
              </div>
            </TableCell>

            <TableCell>
              <Link
                href={`/audits/${investigation.linkedAuditId}`}
                className="hover:underline"
                onClick={(event) => event.stopPropagation()}
              >
                {investigation.linkedAuditId}
              </Link>
            </TableCell>

            <TableCell>
              <AuditSeverityBadge severity={investigation.severity} />
            </TableCell>

            <TableCell>
              <InvestigationStatusBadge
                status={investigation.status}
              />
            </TableCell>

            <TableCell>
              {investigation.owner}
            </TableCell>

            <TableCell>
              {investigation.dueDate}
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-3">
                <ProgressBar
                  value={investigation.progress}
                  className="w-20"
                />
                <span className="text-muted-foreground text-xs">
                  {investigation.progress}%
                </span>
              </div>
            </TableCell>

            <TableCell
              className="text-right"
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`View ${investigation.id}`}
                render={
                  <Link
                    href={`/investigations/${investigation.id}`}
                  />
                }
                nativeButton={false}
              >
                <Eye />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { InvestigationTable }