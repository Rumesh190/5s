"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, Info, LoaderCircle, LockKeyhole } from "lucide-react";

import { getNextFiveSAuditTitle } from "@/lib/five-s/audit-store";
import { useCurrentUser } from "@/lib/current-user";
import {
  FIVE_S_ZONE_CONFIGURATION,
  canAuditZone,
  getFiveSZoneConfiguration,
  toLocalInputDate,
} from "@/lib/five-s/configuration";
import FiveSPageHeader from "./FiveSPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiveSAuditCreateProps {
  onBack: () => void;
  onStart: (audit: {
    title: string;
    plant: string;
    department: string;
    area: string;
    auditor: string;
    dueDate: string;
  }) => void;
}

function formatDate(value: string): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function FieldInfo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`More information about ${label}`}
          />
        }
      >
        <Info className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 text-xs leading-5">
        {children}
      </PopoverContent>
    </Popover>
  );
}

function ReadOnlyField({ label, value, placeholder, mono = false, helper }: { label: string; value?: string; placeholder: string; mono?: boolean; helper?: string }) {
  return (
    <div className="grid gap-2">
      <div className="flex min-h-5 items-center gap-1.5">
        <Label>{label}</Label>
        {helper && <FieldInfo label={label}>{helper}</FieldInfo>}
      </div>
      <div
        className="flex h-11 min-h-11 items-center gap-2 rounded-md border border-input bg-muted/35 px-3 text-sm text-foreground"
        aria-label={`${label}: ${value || placeholder}`}
      >
        <LockKeyhole className="size-3.5 shrink-0 text-muted-foreground" />
        <span className={value ? (mono ? "font-mono font-medium" : "font-medium") : "text-muted-foreground"}>
          {value || placeholder}
        </span>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className={`mt-1 truncate text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function FiveSAuditCreate({ onBack, onStart }: FiveSAuditCreateProps) {
  const currentUser = useCurrentUser();
  const createdAt = useMemo(() => new Date(), []);
  const today = useMemo(() => toLocalInputDate(createdAt), [createdAt]);
  const defaultDueDate = useMemo(() => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 2);
    return toLocalInputDate(date);
  }, [createdAt]);

  const [zone, setZone] = useState<string>("");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [starting, setStarting] = useState(false);

  const selectedZone = getFiveSZoneConfiguration(zone);
  const generatedAuditTitle = zone
    ? getNextFiveSAuditTitle(currentUser.plant, zone)
    : "";

  const createdDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(createdAt);
  const createdTime = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(createdAt);

  const ownZoneSelected = Boolean(zone && !canAuditZone(currentUser, zone));
  const isValid = Boolean(selectedZone && generatedAuditTitle && dueDate >= today && !ownZoneSelected);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || !selectedZone || starting || !canAuditZone(currentUser, selectedZone.name)) return;

    setStarting(true);
    window.setTimeout(() => onStart({ title: generatedAuditTitle, plant: currentUser.plant, department: selectedZone.department, area: selectedZone.name, auditor: currentUser.name, dueDate }), 220);
  }

  return (
    <div className="min-h-full w-full">
      <div className="sticky top-0 z-30 -mx-6 border-b border-border bg-background/95 px-6 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:-mx-8 lg:px-8">
        <FiveSPageHeader
          eyebrow=""
          title="Create 5S Audit"
          description={generatedAuditTitle || "Select a zone to generate the audit ID"}
          className="border-b-0 pb-3"
          leading={
            <Button type="button" variant="ghost" size="icon" onClick={onBack} aria-label="Back" className="-ml-2 shrink-0">
              <ArrowLeft className="size-4" />
            </Button>
          }
          actions={
            <>
              <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
              <Button type="submit" form="five-s-audit-form" disabled={!isValid || starting}>
                {starting ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" /> : <Check className="size-4" />}
                {starting ? "Starting..." : "Start Audit"}
              </Button>
            </>
          }
        />
      </div>

      <div className="w-full px-6 py-5 lg:px-8 lg:py-6">
        <form id="five-s-audit-form" onSubmit={handleSubmit} className="mx-auto grid w-full max-w-[1600px] gap-5">
          <Card className="gap-0">
            <CardContent className="p-5 lg:p-6">
              <section>
                <h2 className="text-sm font-semibold">Workplace Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your plant is supplied by your profile. Select the zone being audited.</p>

                <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  <ReadOnlyField label="Plant" value={currentUser.plant} placeholder="Profile plant unavailable" />

                  <div className="grid gap-2">
                    <Label>Zone</Label>
                    <Select value={zone} onValueChange={(value) => setZone(value ?? "")}>
                      <SelectTrigger className="h-11 min-h-11 w-full px-3">
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIVE_S_ZONE_CONFIGURATION.map((item) => (
                          <SelectItem key={item.code} value={item.name} disabled={item.name === currentUser.primaryZone}>{item.name}{item.name === currentUser.primaryZone ? " — Your own Zone" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div key={`leader-${zone}`} className="motion-success-in"><ReadOnlyField label="Zone Leader" value={selectedZone?.leader} placeholder="Select a zone first" /></div>
                  <div key={`audit-${generatedAuditTitle}`} className="motion-success-in"><ReadOnlyField
                    label="Audit ID"
                    value={generatedAuditTitle}
                    placeholder="Generated after zone selection"
                    mono
                    helper="Generated automatically based on Plant and Zone"
                  /></div>
                </div>
              </section>

              <section className="mt-5 border-t border-border/65 pt-5">
                <h2 className="text-sm font-semibold">Audit Details</h2>
                <p className="mt-1 text-sm text-muted-foreground">Confirm the assigned auditor and required completion date.</p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <ReadOnlyField label="Auditor" value={currentUser.name} placeholder="Auditor unavailable" />
                  <div className="grid gap-2">
                    <div className="flex min-h-5 items-center gap-1.5">
                      <Label htmlFor="five-s-due-date">Due Date</Label>
                      <FieldInfo label="Due Date">
                        Defaults to {formatDate(defaultDueDate)}. Previous dates cannot be selected.
                      </FieldInfo>
                    </div>
                    <Input
                      id="five-s-due-date"
                      type="date"
                      value={dueDate}
                      min={today}
                      onChange={(event) => setDueDate(event.target.value)}
                      className="h-11 min-h-11 px-3"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-5 border-t border-border/65 pt-5">
                <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                  <h2 className="text-sm font-semibold">Audit Summary</h2>
                  <div className="mt-4 grid min-w-0 gap-x-5 gap-y-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <SummaryItem label="Audit ID" value={generatedAuditTitle || "Pending zone selection"} mono />
                    <SummaryItem label="Plant" value={currentUser.plant} />
                    <SummaryItem label="Zone" value={selectedZone?.name || "Not selected"} />
                    <SummaryItem label="Zone Leader" value={selectedZone?.leader || "Pending"} />
                    <SummaryItem label="Auditor" value={currentUser.name} />
                    <SummaryItem label="Created" value={`${createdDate} · ${createdTime}`} />
                    <SummaryItem label="Schedule" value={`Due ${formatDate(dueDate)}`} />
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

        </form>
      </div>
    </div>
  );
}
