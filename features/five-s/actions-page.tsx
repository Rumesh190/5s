"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, Eye, FileText, Paperclip, Search, Target } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import FiveSPageHeader from "@/features/five-s/components/FiveSPageHeader";
import type { MyAction, MyActionPriority, MyActionStatus } from "@/features/five-s/types/my-actions";
import { useActionStore } from "@/lib/actions/action-store";
import { useCurrentUser } from "@/lib/current-user";
import { getFiveSZoneConfiguration } from "@/lib/five-s/configuration";
import { ACTION_LIFECYCLE_STAGES, getActionLifecycleStage, type ActionLifecycleStage } from "@/lib/five-s/lifecycle-status";

const STATUS_CONFIG: Record<MyActionStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "muted" }> = {
  "Awaiting Assignment": { label: "Awaiting Assignment", variant: "muted" },
  Open: { label: "Open", variant: "info" },
  Assigned: { label: "Assigned", variant: "info" },
  "In Progress": { label: "In Progress", variant: "info" },
  Overdue: { label: "Overdue", variant: "danger" },
  "Awaiting Review": { label: "Awaiting Review", variant: "info" },
  "Rework Required": { label: "Rework Required", variant: "danger" },
  Completed: { label: "Completed", variant: "success" },
};

const PRIORITY_CONFIG: Record<MyActionPriority, { label: string; variant: "secondary" | "warning" | "danger" }> = {
  Low: { label: "Low", variant: "secondary" },
  Medium: { label: "Medium", variant: "warning" },
  High: { label: "High", variant: "danger" },
  Critical: { label: "Critical", variant: "danger" },
};

export default function MyActionsPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const actions = useActionStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ActionLifecycleStage>("All");
  const [exactStatus, setExactStatus] = useState<"All" | MyActionStatus>("All");

  const roleActions = useMemo(() => actions.filter((action) => {
    const zoneLeaderId = action.zoneLeaderId ?? getFiveSZoneConfiguration(action.area)?.leaderId;
    const isAuditor = action.createdByUserId === currentUser.id || action.createdByName === currentUser.name || action.auditor === currentUser.name;
    const isZoneLeader = zoneLeaderId === currentUser.id;
    const isResponsible = action.responsiblePersonId === currentUser.id || action.responsiblePersonName === currentUser.name || action.assignedTo === currentUser.name;
    return isAuditor || isZoneLeader || isResponsible;
  }), [actions, currentUser.id, currentUser.name]);

  const filteredActions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return roleActions.filter((action) => {
      const matchesStatus = statusFilter === "All" || getActionLifecycleStage(action.status) === statusFilter;
      const matchesExactStatus = exactStatus === "All" || action.status === exactStatus;
      const searchableValues = [action.title, action.description, action.sourceTitle, action.plant, action.department, action.area, action.priority];
      return matchesStatus && matchesExactStatus && (!query || searchableValues.some((value) => value.toLowerCase().includes(query)));
    });
  }, [exactStatus, roleActions, search, statusFilter]);

  useEffect(() => {
    const actionId = new URLSearchParams(window.location.search).get("actionId");
    if (!actionId || !actions.some((action) => action.id === actionId)) return;
    router.replace(`/5s/actions/${encodeURIComponent(actionId)}`);
  }, [actions, router]);

  const counts = {
    total: roleActions.length,
    open: roleActions.filter((action) => action.status === "Open" || action.status === "Assigned").length,
    inProgress: roleActions.filter((action) => action.status === "In Progress").length,
    overdue: roleActions.filter((action) => action.status === "Overdue").length,
    awaitingReview: roleActions.filter((action) => action.status === "Awaiting Review").length,
    completed: roleActions.filter((action) => action.status === "Completed").length,
  };

  function openAction(action: MyAction) {
    router.push(`/5s/actions/${encodeURIComponent(action.id)}`);
  }

  function openReport(action: MyAction) {
    router.push(`/5s/actions/${encodeURIComponent(action.id)}/report`);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setExactStatus("All");
  }

  return (
    <PageContainer>
      <FiveSPageHeader eyebrow="5S Workspace" title="Actions" description="Manage assigned corrective actions and track them through verification and closure." />

      <p className="text-sm text-muted-foreground">Showing actions where you are the Auditor, Zone Leader, or responsible Zone Member.</p>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Total Actions" value={counts.total} description="Assigned to you" icon={ClipboardCheck} />
        <StatCard label="Open" value={counts.open} description="Yet to be started" icon={Clock3} />
        <StatCard label="In Progress" value={counts.inProgress} description="Currently being worked on" icon={Target} />
        <StatCard label="Overdue" value={counts.overdue} description="Require attention" icon={AlertCircle} />
        <StatCard label="Awaiting Review" value={counts.awaitingReview} description="Pending Zone Leader verification" icon={Eye} />
        <StatCard label="Completed" value={counts.completed} description="Successfully closed" icon={CheckCircle2} />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-3 sm:pt-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">Action Plans</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Actions requiring your attention.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search actions..." className="pl-9 sm:w-64" />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1 pt-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            {(["All", ...ACTION_LIFECYCLE_STAGES] as const).map((status) => (
              <Button key={status} type="button" size="sm" className="min-h-11 shrink-0 md:min-h-8" variant={statusFilter === status ? "default" : "outline"} onClick={() => setStatusFilter(status)}>{status}</Button>
            ))}
          </div>
          <Select value={exactStatus} onValueChange={(value)=>setExactStatus((value??"All") as "All"|MyActionStatus)}><SelectTrigger className="h-11 w-full md:h-9 md:w-52" aria-label="Refine by exact action status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">All exact statuses</SelectItem>{Object.keys(STATUS_CONFIG).map((status)=><SelectItem key={status} value={status}>{STATUS_CONFIG[status as MyActionStatus].label}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {filteredActions.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <CheckCircle2 className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No actions found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try changing your search or filter.</p>
              {(search.trim() || statusFilter !== "All" || exactStatus !== "All") && <Button type="button" variant="outline" className="mt-4 min-h-11 md:min-h-9" onClick={clearFilters}>Clear Search &amp; Filters</Button>}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActions.map((action) => {
                const status = STATUS_CONFIG[action.status];
                const priority = PRIORITY_CONFIG[action.priority];
                return (
                  <article key={action.id} className="w-full rounded-lg border border-border/70 bg-muted/15 p-4 text-left transition-all duration-200 hover:-translate-y-[1px] hover:border-border hover:bg-muted/35 hover:shadow-[0_8px_24px_-20px_rgb(16_24_40/0.35)] sm:p-5">
                    <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="min-w-0 break-words text-sm font-semibold">{action.title}</h3>
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <Badge variant={priority.variant}>{priority.label}</Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{action.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <span>{action.source}: {action.sourceTitle}</span>
                          <span>{action.plant} · {action.area}</span>
                          <span>Responsible: {action.responsiblePersonName ?? action.assignedTo}</span>
                          <span>Raised by: {action.createdByName ?? action.auditor ?? "—"}</span>
                          {action.status === "Completed" && <span>Approved by: {action.reviewedByRole === "Zone Leader" ? action.reviewedBy : action.closedBy ?? action.zoneLeaderName ?? "—"}</span>}
                          {action.actionCategory && <span>{action.actionCategory}</span>}
                          {action.costSaving !== undefined && <span>₹{action.costSaving.toLocaleString("en-IN")}</span>}
                          <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />Due {action.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {action.evidence.length > 0 && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Paperclip className="size-3.5" />{action.evidence.length}</span>}
                        <Button size="sm" className="min-h-11 md:min-h-8" variant="outline" onClick={() => openAction(action)}><Eye className="size-3.5" />View</Button>
                        {action.status === "Completed" && <Button size="sm" className="min-h-11 md:min-h-8" variant="outline" title="View improvement report" onClick={() => openReport(action)}><FileText className="size-3.5" />Report</Button>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
