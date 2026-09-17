export interface ShareNavigator {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
}

export type PdfShareResult = "shared" | "unsupported" | "cancelled" | "failed";

export function sanitizePdfFilename(value: string) {
  const stem = value.replace(/\.pdf$/i, "").replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${stem || "IQ-Report"}.pdf`;
}

export function createPdfFile(blob: Blob, filename: string) {
  return new File([blob], sanitizePdfFilename(filename), { type: "application/pdf" });
}

export function canSharePdfFile(navigatorLike: ShareNavigator, file: File) {
  if (!navigatorLike.share || !navigatorLike.canShare) return false;
  try { return navigatorLike.canShare({ files: [file] }); } catch { return false; }
}

export async function sharePdfFile(navigatorLike: ShareNavigator, file: File, title: string): Promise<PdfShareResult> {
  if (!canSharePdfFile(navigatorLike, file)) return "unsupported";
  try {
    await navigatorLike.share!({ files: [file], title });
    return "shared";
  } catch (error) {
    return error instanceof DOMException && error.name === "AbortError" ? "cancelled" : "failed";
  }
}

export function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sanitizePdfFilename(filename);
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function generateReportPdf(selector: string): Promise<Blob> {
  const report = document.querySelector<HTMLElement>(selector);
  if (!report) throw new Error("Report content is unavailable.");
  const wasHidden = getComputedStyle(report).display === "none";
  const previousStyle = report.getAttribute("style");
  if (wasHidden) Object.assign(report.style, { display: "block", position: "fixed", left: "-100000px", top: "0", width: "1120px" });
  let canvas: HTMLCanvasElement | undefined;
  try {
  await document.fonts?.ready;
  await Promise.all(Array.from(report.querySelectorAll("img")).map(async (image) => {
    if (image.complete) return;
    try { await image.decode(); } catch { /* Preserve the browser's image fallback. */ }
  }));

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
  canvas = await html2canvas(report, {
    backgroundColor: "#ffffff",
    scale: Math.min(2, window.devicePixelRatio || 1),
    useCORS: true,
    logging: false,
    windowWidth: Math.max(report.scrollWidth, report.clientWidth),
  });
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageHeight = canvas.height * pageWidth / canvas.width;
  const image = canvas.toDataURL("image/jpeg", 0.92);
  let offset = 0;
  do {
    if (offset > 0) pdf.addPage();
    pdf.addImage(image, "JPEG", 0, -offset, pageWidth, imageHeight, undefined, "FAST");
    offset += pageHeight;
  } while (offset < imageHeight);
  return pdf.output("blob");
  } finally {
    if (canvas) { canvas.width = 1; canvas.height = 1; }
    if (previousStyle === null) report.removeAttribute("style"); else report.setAttribute("style", previousStyle);
  }
}
