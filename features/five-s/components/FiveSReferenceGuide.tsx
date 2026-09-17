"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, Info, Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useI18n } from "@/components/preferences/use-i18n";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { FiveSQuestion } from "../types/five-s";

function ImageViewer({ image, description, open, onClose }: { image: string; description: string; open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [zoom, setZoom] = useState(1);
  const close = () => { setZoom(1); onClose(); };
  return <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) close(); }}>
    <DialogContent showCloseButton={false} className="inset-0 left-0 top-0 h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none bg-black p-0 ring-0">
      <DialogTitle className="sr-only">Reference image</DialogTitle><DialogDescription className="sr-only">{description}</DialogDescription>
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-black/65 p-1 text-white">
        <Button type="button" variant="ghost" size="icon" className="size-11 text-white hover:bg-white/15 hover:text-white sm:size-9" aria-label={t("audit.zoomOut")} onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))}><Minus /></Button>
        <Button type="button" variant="ghost" size="icon" className="size-11 text-white hover:bg-white/15 hover:text-white sm:size-9" aria-label={t("audit.resetZoom")} onClick={() => setZoom(1)}><RotateCcw /></Button>
        <Button type="button" variant="ghost" size="icon" className="size-11 text-white hover:bg-white/15 hover:text-white sm:size-9" aria-label={t("audit.zoomIn")} onClick={() => setZoom((value) => Math.min(3, value + 0.25))}><Plus /></Button>
        <Button type="button" variant="ghost" size="icon" className="size-11 text-white hover:bg-white/15 hover:text-white sm:size-9" aria-label={t("common.close")} onClick={close}><X /></Button>
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-auto p-4 pt-16"><Image src={image} alt={description} width={1600} height={1000} className="max-h-full max-w-full object-contain transition-transform duration-200" style={{ transform: `scale(${zoom})` }} /></div>
    </DialogContent>
  </Dialog>;
}

export default function FiveSReferenceGuide({ question, questionText }: { question: FiveSQuestion; questionText: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const reference = question.reference;
  if (!reference) return null;

  return <>
    <Tooltip><TooltipTrigger render={<Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground hover:bg-primary/8 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring" aria-label={`View reference for: ${questionText}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setOpen(true); }} />}><Info className="size-4" aria-hidden="true" /></TooltipTrigger><TooltipContent>{t("audit.viewReference")}</TooltipContent></Tooltip>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="grid max-h-[calc(100dvh-24px)] !w-[calc(100vw-24px)] !max-w-none min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-[20px] p-0 sm:max-h-[calc(100dvh-40px)] sm:!w-[calc(100vw-48px)] sm:!max-w-none sm:min-w-0 lg:max-h-[calc(100dvh-64px)] lg:!w-[calc(100vw-96px)] lg:!max-w-[960px] lg:min-w-[760px] lg:rounded-[24px]">
        <header className="relative border-b px-5 py-4 pr-14 sm:px-8 lg:px-10"><DialogTitle>{t("audit.referenceGuide")}</DialogTitle><Button type="button" variant="ghost" size="icon" className="absolute right-3 top-2.5 size-9 sm:right-5 lg:right-7" aria-label={t("common.close")} onClick={() => setOpen(false)}><X className="size-4" /></Button></header>
        <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <DialogDescription className="max-w-[760px] text-xl font-semibold leading-[1.35] text-foreground lg:text-2xl lg:leading-[1.3]">{questionText}</DialogDescription>
          <div className="mt-7 w-full sm:mt-8">{imageFailed ? <div className="flex aspect-video max-h-[480px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-muted/35 px-5 text-center text-muted-foreground"><ImageOff className="size-7" aria-hidden="true" /><p className="text-sm font-medium">{t("audit.referenceUnavailable")}</p></div> : <button type="button" className="group relative aspect-video max-h-[480px] w-full overflow-hidden rounded-2xl border bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={t("audit.openFullScreen")} onClick={() => setViewerOpen(true)}><Image src={reference.image} alt={reference.description} fill priority sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1023px) calc(100vw - 112px), 880px" onError={() => setImageFailed(true)} className="object-cover" /><span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-md bg-black/65 text-white shadow-sm"><Maximize2 className="size-4" aria-hidden="true" /></span></button>}</div>
          <section className="mt-7"><p className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary">{t("audit.whatGoodLooksLike")}</p><h3 className="mt-2.5 text-xl font-semibold leading-snug lg:text-[22px]">{reference.title}</h3><p className="mt-2.5 text-[15px] leading-[1.6] text-muted-foreground sm:text-base">{reference.description}</p><p className="mt-4 text-xs text-muted-foreground">{t("audit.referenceDisclaimer")}</p></section>
        </div>
        <footer className="flex justify-end border-t bg-background px-5 py-3 sm:px-8 lg:px-10"><Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("common.close")}</Button></footer>
      </DialogContent>
    </Dialog>
    <ImageViewer image={reference.image} description={reference.description} open={viewerOpen} onClose={() => setViewerOpen(false)} />
  </>;
}
