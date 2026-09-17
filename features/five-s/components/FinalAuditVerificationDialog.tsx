"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCcw, ShieldCheck, UserRound } from "lucide-react";

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
  auditor,
  questionCount,
  onOpenChange,
  onComplete,
}: {
  open: boolean;
  auditor: string;
  questionCount: number;
  onOpenChange: (open: boolean) => void;
  onComplete: (capture: AuditVerificationCapture) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestRef = useRef(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [completing, setCompleting] = useState(false);

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
    <DialogContent className="flex max-h-[calc(100dvh-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:!max-w-4xl lg:max-h-[calc(100vh-3rem)]" showCloseButton={!completing}>
      <header className="shrink-0 border-b px-5 py-4 pr-12 sm:px-7 sm:pr-14"><DialogTitle className="text-lg">Complete Audit</DialogTitle><DialogDescription className="mt-1">Verify the auditor before completing this audit. All {questionCount} questions are ready for final submission.</DialogDescription></header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
        <section className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><UserRound className="size-5" /></span><div><p className="text-[11px] font-semibold uppercase tracking-[.12em] text-muted-foreground">Auditor</p><p className="mt-0.5 font-semibold">{auditor}</p><p className="text-xs text-muted-foreground">Auditor</p></div></section>
        <section className="mt-5"><div className="mb-2 flex items-center gap-2"><Camera className="size-4 text-primary" /><h3 className="text-sm font-semibold">Live Photo</h3></div><div className="overflow-hidden rounded-xl border bg-slate-950">{photo ? <img src={photo} alt={`${auditor} live verification`} className="aspect-video max-h-[300px] w-full object-cover" /> : <video ref={videoRef} autoPlay muted playsInline className="aspect-video max-h-[300px] w-full object-cover" aria-label="Live auditor camera preview" />}</div>{cameraError && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{cameraError}</p>}<div className="mt-3 flex justify-end">{photo ? <Button type="button" variant="outline" onClick={retakePhoto}><RefreshCcw className="size-4" />Retake</Button> : cameraError ? <Button type="button" variant="outline" onClick={() => void startCamera()}><RefreshCcw className="size-4" />Try Camera Again</Button> : <Button type="button" onClick={capturePhoto} disabled={cameraStarting}><Camera className="size-4" />{cameraStarting ? "Starting Camera..." : "Capture Photo"}</Button>}</div></section>
        <section className="mt-5"><AuditorSignaturePad auditor={auditor} signature={signature ? { signedAt: new Date().toISOString(), signatureImage: signature } : undefined} onConfirm={setSignature} onClear={() => setSignature(null)} /></section>
        <p className="mt-5 flex gap-2 rounded-lg bg-muted/30 p-3 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />By completing this audit, I confirm that the information recorded in this assessment has been reviewed and is accurate.</p>
      </div>
      <footer className="z-10 shrink-0 border-t bg-popover px-5 py-4 sm:px-7">
        {verificationIsComplete(photo, signature) && <p className="mb-3 flex items-center justify-end gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"><ShieldCheck className="size-4" />Auditor verification complete</p>}
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={completing} onClick={() => onOpenChange(false)}>Cancel</Button><Button type="button" disabled={!verificationIsComplete(photo, signature) || completing} onClick={complete}>{completing ? "Completing..." : "Complete Audit"}</Button></div>
      </footer>
    </DialogContent>
  </Dialog>;
}
