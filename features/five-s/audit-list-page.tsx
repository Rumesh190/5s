"use client";

import { useState } from "react";

import FiveSAuditList from "./components/FiveSAuditList";
import FiveSAuditCreate from "./components/FiveSAuditCreate";
import FiveSAuditExecution from "./components/FiveSAuditExecution";
import { PageContainer } from "@/components/layout/page-container";

import {
  createFiveSAudit,
  deleteFiveSAudit,
  useFiveSAuditStore,
} from "@/lib/five-s/audit-store";

import type { FiveSAudit } from "./types/five-s";

/* =========================================================
   PAGE
   ========================================================= */

export default function FiveSAuditListPage() {
  const audits = useFiveSAuditStore();

  const [selectedAudit, setSelectedAudit] =
    useState<FiveSAudit | null>(null);

  const [isCreatingAudit, setIsCreatingAudit] =
    useState(false);

  /* =======================================================
     START AUDIT
     ======================================================= */

  function handleStartAudit() {
    setSelectedAudit(null);
    setIsCreatingAudit(true);
  }

  /* =======================================================
     CREATE AUDIT
     ======================================================= */

  function handleCreateAudit(input: {
    title: string;
    plant: string;
    department: string;
    area: string;
    auditor: string;
    dueDate: string;
  }) {
    const audit =
      createFiveSAudit({
        title: input.title,
        plant: input.plant,
        department: input.department,
        area: input.area,
        auditor: input.auditor,
        dueDate: input.dueDate,
      });

    setIsCreatingAudit(false);
    setSelectedAudit(audit);
  }

  /* =======================================================
     VIEW AUDIT
     ======================================================= */

  function handleViewAudit(
    audit: FiveSAudit
  ) {
    setIsCreatingAudit(false);
    setSelectedAudit(audit);
  }

  /* =======================================================
     DELETE AUDIT
     ======================================================= */

  function handleDeleteAudit(
    audit: FiveSAudit
  ) {
    deleteFiveSAudit(audit.id);

    if (
      selectedAudit?.id ===
      audit.id
    ) {
      setSelectedAudit(null);
    }

    setIsCreatingAudit(false);
  }

  /* =======================================================
     COMPLETE AUDIT
     ======================================================= */

  function handleCompleteAudit() {
    // The execution component is responsible
    // for updating the audit during assessment.
    // Returning here simply closes the execution view.
    setSelectedAudit(null);
    setIsCreatingAudit(false);
  }

  /* =======================================================
     BACK
     ======================================================= */

  function handleBack() {
    setSelectedAudit(null);
    setIsCreatingAudit(false);
  }

  /* =======================================================
     CREATE
     ======================================================= */

  if (isCreatingAudit) {
    return (
      <FiveSAuditCreate
        onBack={handleBack}
        onStart={handleCreateAudit}
      />
    );
  }

  /* =======================================================
     EXECUTION
     ======================================================= */

  if (selectedAudit) {
    return (
      <div className="grid gap-6">
        <FiveSAuditExecution
          audit={selectedAudit}
          onBack={handleBack}
          onComplete={handleCompleteAudit}
        />
      </div>
    );
  }

  /* =======================================================
     LISTING
     ======================================================= */

  return (
    <PageContainer>
      <FiveSAuditList
        audits={audits}
        onStartAudit={handleStartAudit}
        onViewAudit={handleViewAudit}
        onDeleteAudit={handleDeleteAudit}
      />
    </PageContainer>
  );
}
