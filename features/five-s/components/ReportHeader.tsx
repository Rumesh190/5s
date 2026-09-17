import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const IQ_LOGO_PATH = "/branding/iq-logo.png";

export async function prepareReportForPrint(selector: string) {
  await document.fonts?.ready;
  const report = document.querySelector<HTMLElement>(selector);
  const images = report ? Array.from(report.querySelectorAll("img")) : [];
  await Promise.all(images.map(async (image) => {
    if (image.complete) return;
    try { await image.decode(); } catch { /* Let print use the browser fallback. */ }
  }));
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

export default function ReportHeader({
  title,
  reportId,
  subtitle,
  metadata,
  status,
  className,
}: {
  title: string;
  reportId?: string;
  subtitle?: string;
  metadata?: ReactNode;
  status?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("report-brand-header flex flex-col gap-5 border-b border-slate-200 bg-white px-5 py-6 text-slate-950 sm:flex-row sm:items-start sm:justify-between sm:px-7", className)}>
      <div className="shrink-0">
        <img
          src={IQ_LOGO_PATH}
          alt="IQ – Intelligence Quality"
          className="report-brand-logo h-auto w-[150px] object-contain object-left sm:w-[190px]"
        />
      </div>
      <div className="min-w-0 text-left sm:max-w-[65%] sm:text-right">
        {status && <div className="mb-2 flex sm:justify-end">{status}</div>}
        <p className="text-lg font-extrabold uppercase tracking-[0.04em] text-blue-800 sm:text-2xl">{title}</p>
        {reportId && <p className="mt-1 break-all font-mono text-xs font-semibold text-blue-700">{reportId}</p>}
        {subtitle && <h1 className="mt-2 break-words text-lg font-bold tracking-tight sm:text-xl">{subtitle}</h1>}
        {metadata && <div className="mt-2 text-xs text-slate-500">{metadata}</div>}
      </div>
    </header>
  );
}
