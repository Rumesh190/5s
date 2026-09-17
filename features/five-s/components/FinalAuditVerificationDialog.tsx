"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, RefreshCcw, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { stopCameraStream, verificationIsComplete } from "@/lib/five-s/audit-verification";
import AuditorSignaturePad from "./AuditorSignaturePad";

export interface AuditVerificationCapture {
  capturedAt: string;
  photo: string;
  signature: string;
}

export default function FinalAuditVerificationDialog({
  open,
  auditId,
  auditor,
  onOpenChange,
  onComplete,
}: {
  open: boolean;
  auditId: string;
  auditor: string;
  onOpenChange: (open: boolean) => void;
  onComplete: (capture: AuditVerificationCapture) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const signatureSectionRef = useRef<HTMLElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestRef = useRef(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const missingStepGuidance = !photo && !signature ? "Capture your live photo and add your signature to continue." : !photo ? "Capture your live photo to continue." : !signature ? "Add your signature to continue." : "";

  function stopCamera() {
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function startCamera() {
    stopCamera();
    const requestId = ++cameraRequestRef.current;
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Live camera capture is not supported by this browser.");
      return;
    }
    setCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (!open || requestId !== cameraRequestRef.current) { stopCameraStream(stream); return; }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      const denied = error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError");
      setCameraError(denied ? "Camera permission was denied. Allow camera access to complete this audit." : "The camera could not be started. Check that a camera is available and not in use.");
      stopCamera();
    } finally {
      setCameraStarting(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const startTimer = window.setTimeout(() => {
      setPhoto(null);
      setSignature(null);
      setCameraError(null);
      setCompleting(false);
      void startCamera();
    }, 0);
    return () => {
      window.clearTimeout(startTimer);
      cameraRequestRef.current += 1;
      stopCamera();
    };
    // Camera lifecycle is intentionally tied only to the dialog's open state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError("The live camera is not ready yet. Please try again.");
      return;
    }
    const width = Math.min(960, video.videoWidth);
    const height = Math.round(width * (video.videoHeight / video.videoWidth));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) { setCameraError("The camera image could not be captured."); return; }
    context.drawImage(video, 0, 0, width, height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.82));
    stopCamera();
    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.setTimeout(() => signatureSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  }

  function retakePhoto() {
    setPhoto(null);
    void startCamera();
  }

  function complete() {
    if (!photo || !signature || completing) return;
    setCompleting(true);
    stopCamera();
    onComplete({ photo, signature, capturedAt: new Date().toISOString() });
  }

  return <Dialog open={open} onOpenChange={(nextOpen) => { if (!completing) onOpenChange(nextOpen); }}>
    <DialogContent className="flex max-h-[calc(100dvh-24px)] !w-[calc(100vw-24px)] !max-w-none flex-col gap-0 overflow-hidden p-0 [&_[data-slot=dialog-close]]:size-11 sm:!w-[calc(100vw-40px)] lg:max-h-[calc(100dvh-48px)] lg:!w-[calc(100vw-64px)] lg:!max-w-[1120px] lg:[&_[data-slot=dialog-close]]:size-8" showCloseButton={!completing}>
      <header className="flex shrink-0 flex-col gap-4 border-b px-5 py-4 pr-12 sm:px-6 sm:pr-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="size-5" /></span><div className="min-w-0"><DialogTitle className="text-xl">Complete Audit</DialogTitle><DialogDescription className="mt-1 text-sm">Verify the auditor before completing this audit. All required questions are ready for final submission.</DialogDescription></div></div>
        <dl className="flex shrink-0 items-center divide-x rounded-xl bg-muted/35 px-1 py-2 text-xs"><div className="px-3"><dt className="text-muted-foreground">Audit ID</dt><dd className="mt-0.5 max-w-40 truncate font-semibold text-primary" title={auditId}>{auditId}</dd></div><div className="flex items-center gap-2 px-3"><UserRound className="size-4 text-primary" /><div><dt className="text-muted-foreground">Auditor</dt><dd className="mt-0.5 font-semibold">{auditor}</dd></div></div></dl>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 lg:px-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="flex h-full min-w-0 flex-col rounded-xl border p-4">
            <StepHeader step="1" complete={Boolean(photo)} title="Live Photo" description="Capture a live photo of the auditor" />
            <div className="mt-4 flex min-h-0 flex-1 flex-col"><div className="mx-auto aspect-[4/3] w-full max-w-[500px] overflow-hidden rounded-xl border bg-slate-950">{photo ? <img src={photo} alt={`${auditor} live verification`} className="size-full object-cover" /> : <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover" aria-label="Live auditor camera preview" />}</div>{cameraError && <p role="status" className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{cameraError}</p>}<div className="mt-3 flex justify-center">{photo ? <Button type="button" variant="outline" className="min-h-11 lg:min-h-9" onClick={retakePhoto}><RefreshCcw className="size-4" />Retake</Button> : cameraError ? <Button type="button" variant="outline" className="min-h-11 lg:min-h-9" onClick={() => void startCamera()}><RefreshCcw className="size-4" />Try Camera Again</Button> : <Button type="button" className="min-h-11 lg:min-h-9" onClick={capturePhoto} disabled={cameraStarting}><Camera className="size-4" />{cameraStarting ? "Starting Camera..." : "Capture Photo"}</Button>}</div></div>
            <div className={photo ? "hidden lg:block" : "block"}><InfoBlock title="Requirements" items={["Capture a live photo of the auditor.", "Ensure the face is clearly visible."]} /></div>
          </section>
          <section ref={signatureSectionRef} className="flex h-full min-w-0 scroll-mt-4 flex-col rounded-xl border p-4">
            <StepHeader step="2" complete={Boolean(signature)} title="Signature" description="Provide your signature to complete this audit" />
            <div className="mt-4 flex min-h-0 flex-1 flex-col"><AuditorSignaturePad compact auditor={auditor} signature={signature ? { signedAt: new Date().toISOString(), signatureImage: signature } : undefined} onConfirm={setSignature} onClear={() => setSignature(null)} /></div>
            <div className={signature ? "hidden lg:block" : "block"}><InfoBlock title="Signature Tips" items={["Sign using mouse, touch or stylus.", "You can clear and re-sign if needed."]} /></div>
          </section>
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-muted/35 px-4 py-3 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />By completing this audit, I confirm that the information recorded in this assessment has been reviewed and is accurate.</p>
      </div>
      <footer className="mobile-safe-bottom z-10 flex shrink-0 flex-wrap items-center justify-end gap-2 border-t bg-background px-5 py-3 sm:px-6">{verificationIsComplete(photo, signature) ? <span className="mr-auto hidden items-center gap-1.5 text-xs font-medium text-emerald-700 sm:flex"><Check className="size-4" />Verification complete</span> : <span role="status" className="w-full text-xs text-muted-foreground sm:mr-auto sm:w-auto">{missingStepGuidance}</span>}<Button type="button" variant="outline" className="min-h-11 lg:min-h-9" disabled={completing} onClick={() => onOpenChange(false)}>Cancel</Button><Button type="button" className="min-h-11 lg:min-h-9" disabled={!verificationIsComplete(photo, signature) || completing} onClick={complete}>{completing ? "Completing..." : "Complete Audit"}</Button></footer>
    </DialogContent>
  </Dialog>;
}

function StepHeader({ step, complete, title, description }: { step: string; complete: boolean; title: string; description: string }) {
  return <div className="flex items-center gap-3"><span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${complete ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-primary/10 text-primary"}`}>{complete ? <Check className="size-4" aria-label="Completed" /> : step}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-0.5 text-xs text-muted-foreground">{description}</p></div></div>;
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return <div className="mt-4 rounded-lg bg-primary/[0.055] px-3 py-2.5 text-xs text-muted-foreground"><p className="font-semibold text-primary">{title}</p><ul className="mt-1 list-disc space-y-0.5 pl-4">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
