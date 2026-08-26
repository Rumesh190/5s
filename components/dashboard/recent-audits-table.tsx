import Link from "next/link"

import { cn } from "@/lib/utils"
import { AUDIT_STATUS_STYLES } from "@/lib/dashboard/accent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RecentAudit } from "@/types/dashboard"

interface RecentAuditsTableProps {
  audits: RecentAudit[]
}

function RecentAuditsTable({ audits }: RecentAuditsTableProps) {
  return (
    <Card className="h-full transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Audits</CardTitle>
        <Link
          href="/audits"
          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          View all audits
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell className="font-medium text-foreground">
                  <Link href={`/audits/${audit.id}`} className="hover:underline">
                    {audit.id}
                  </Link>
                </TableCell>
                <TableCell className="max-w-64 truncate text-muted-foreground">
                  {audit.title}
                </TableCell>
                <TableCell className="text-muted-foreground">{audit.department}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                      AUDIT_STATUS_STYLES[audit.status]
                    )}
                  >
                    {audit.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {audit.updatedAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export { RecentAuditsTable }
