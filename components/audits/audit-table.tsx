"use client"

import { useRouter } from "next/navigation"

import { Checkbox } from "@/components/ui/checkbox"
import { ProgressBar } from "@/components/ui/progress-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AuditRowActions } from "@/components/audits/audit-row-actions"
import { AuditSeverityBadge } from "@/components/audits/audit-severity-badge"
import { AuditStatusBadge } from "@/components/audits/audit-status-badge"
import { formatDaysAgo } from "@/lib/audits/format"
import type { AuditRecord } from "@/types/audit"

interface AuditTableProps {
  audits: AuditRecord[]
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: (checked: boolean) => void
  onDelete: (id: string) => void
}

function AuditTable({
  audits,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onDelete,
}: AuditTableProps) {
  const router = useRouter()

  const allSelected =
    audits.length > 0 &&
    audits.every((audit) => selectedIds.has(audit.id))

  const someSelected =
    audits.some((audit) => selectedIds.has(audit.id))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              aria-label="Select all audits on this page"
              checked={allSelected}
              indeterminate={!allSelected && someSelected}
              onCheckedChange={(checked) =>
                onToggleAll(checked === true)
              }
            />
          </TableHead>

          <TableHead>Audit ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Plant</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {audits.map((audit) => (
          <TableRow
            key={audit.id}
            data-state={
              selectedIds.has(audit.id)
                ? "selected"
                : undefined
            }
            onClick={() => router.push(`/audits/${audit.id}`)}
          >
            <TableCell
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <Checkbox
                aria-label={`Select ${audit.id}`}
                checked={selectedIds.has(audit.id)}
                onClick={(event) => {
                  event.stopPropagation()
                }}
                onCheckedChange={() => onToggleRow(audit.id)}
              />
            </TableCell>

            <TableCell className="font-medium">
              {audit.id}
            </TableCell>

            <TableCell>
              {audit.title}
            </TableCell>

            <TableCell>
              {audit.plant}
            </TableCell>

            <TableCell>
              {audit.department}
            </TableCell>

            <TableCell>
              <AuditSeverityBadge
                severity={audit.severity}
              />
            </TableCell>

            <TableCell>
              <AuditStatusBadge
                status={audit.status}
              />
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-3">
                <ProgressBar
                  value={audit.progress}
                  className="w-20"
                />

                <span className="text-xs text-muted-foreground">
                  {audit.progress}%
                </span>
              </div>
            </TableCell>

            <TableCell>
              {audit.assignedTo}
            </TableCell>

            <TableCell>
              {formatDaysAgo(audit.createdDaysAgo)}
            </TableCell>

            <TableCell>
              {formatDaysAgo(audit.updatedDaysAgo)}
            </TableCell>

            <TableCell
              className="text-right"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <AuditRowActions
                auditId={audit.id}
  onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { AuditTable }