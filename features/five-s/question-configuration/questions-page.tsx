"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ImageIcon, Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import FiveSPageHeader from "@/features/five-s/components/FiveSPageHeader";
import { FIVE_S_CATEGORIES, FIVE_S_CATEGORY_DESCRIPTIONS } from "@/features/five-s/data/five-s-data";
import type { FiveSCategory } from "@/features/five-s/types/five-s";
import { useAdminUsers } from "@/features/five-s/administration/store";
import { hasPermission } from "@/features/five-s/administration/permissions";
import { useCurrentUser } from "@/lib/current-user";
import { optimizeEvidenceImage } from "@/lib/evidence-images";
import { addQuestionDefinition, deactivateQuestionDefinition, moveQuestionDefinition, updateQuestionDefinition, useQuestionConfiguration } from "./store";
import type { QuestionDefinition, QuestionDefinitionInput } from "./types";

type EditorState = { sectionId: FiveSCategory; question?: QuestionDefinition } | null;

export default function FiveSQuestionsPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const users = useAdminUsers();
  const definitions = useQuestionConfiguration();
  const actor = users.find((user) => user.id === currentUser.id);
  const canManage = Boolean(actor?.status === "Active" && actor.roles.includes("Admin") && hasPermission(actor, "administration.manage_questions"));
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleting, setDeleting] = useState<QuestionDefinition | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!canManage) {
    return <PageContainer><Card><CardContent className="grid min-h-72 place-items-center text-center"><div><Settings2 className="mx-auto size-9 text-muted-foreground" /><h1 className="mt-3 text-lg font-semibold">Admin access required</h1><p className="mt-2 text-sm text-muted-foreground">Only Admin users can manage 5S audit questions.</p></div></CardContent></Card></PageContainer>;
  }

  function perform(action: () => unknown, success: string) {
    try {
      setError("");
      action();
      setMessage(success);
      window.setTimeout(() => setMessage(""), 2200);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update question configuration.");
    }
  }

  return <PageContainer className="max-w-none">
    <FiveSPageHeader eyebrow="Audit / Audit Configuration" title="Audit Configuration" description="Manage the questions used in 5S audits." leading={<Button type="button" variant="ghost" size="icon-sm" className="size-11 md:size-8" onClick={() => router.push("/5s/audits")} aria-label="Back to Audits"><ArrowLeft className="size-4" /></Button>} />
    {(message || error) && <div role={error ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${error ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400"}`}>{error || message}</div>}
    <div className="grid gap-4">
      {FIVE_S_CATEGORIES.map((sectionId) => {
        const questions = definitions.filter((item) => item.sectionId === sectionId && item.active).sort((a, b) => a.displayOrder - b.displayOrder);
        return <Card key={sectionId} className="gap-0 overflow-hidden">
          <div className="flex items-start justify-between gap-4 border-b bg-muted/20 px-4 py-3 sm:px-5">
            <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold uppercase tracking-[.08em]">{sectionId}</h2><Badge variant="secondary">{questions.length}</Badge><Badge variant="muted">System section</Badge></div><p className="mt-1 text-xs text-muted-foreground">{FIVE_S_CATEGORY_DESCRIPTIONS[sectionId]} Section names are fixed.</p></div>
            <Button size="sm" variant="outline" className="min-h-11 md:min-h-8" onClick={() => { setError(""); setEditor({ sectionId }); }}><Plus className="size-4" />Add Question</Button>
          </div>
          <CardContent className="p-0">
            {questions.length === 0 ? <p className="px-5 py-8 text-center text-sm text-muted-foreground">No active questions in this section.</p> : questions.map((question, index) => <div key={question.id} className="flex flex-col gap-3 border-b px-4 py-3 last:border-0 sm:flex-row sm:items-center sm:px-5">
              <div className="flex min-w-0 flex-1 items-start gap-3"><span className="mt-0.5 w-7 shrink-0 text-right font-mono text-xs font-semibold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0"><p className="text-sm font-medium leading-6">{question.questionText}</p><div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground"><span>{question.required ? "Required" : "Optional"}</span><span>·</span><span>{question.referenceGuide.title}</span></div></div></div>
              <div className="grid shrink-0 grid-cols-2 gap-3 pl-10 sm:flex sm:items-center sm:justify-end sm:gap-1 sm:pl-0">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:sr-only">Reorder</p>
                  <div className="flex gap-2 sm:gap-1">
                    <Button size="icon-sm" className="size-11 md:size-8" variant="ghost" disabled={index === 0} aria-label={`Move ${question.questionText} up`} onClick={() => perform(() => moveQuestionDefinition(question.id, "up", currentUser.id), "Question order updated.")}><ArrowUp className="size-4" /></Button>
                    <Button size="icon-sm" className="size-11 md:size-8" variant="ghost" disabled={index === questions.length - 1} aria-label={`Move ${question.questionText} down`} onClick={() => perform(() => moveQuestionDefinition(question.id, "down", currentUser.id), "Question order updated.")}><ArrowDown className="size-4" /></Button>
                  </div>
                </div>
                <div className="min-w-0 border-l pl-3 sm:flex sm:border-l-0 sm:pl-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:sr-only">Manage</p>
                  <div className="flex gap-2 sm:gap-1">
                    <Button size="sm" variant="ghost" className="min-h-11 md:min-h-8" onClick={() => { setError(""); setEditor({ sectionId, question }); }}><Pencil className="size-4" />Edit</Button>
                    <Button size="sm" variant="ghost" className="min-h-11 text-destructive hover:text-destructive md:min-h-8" onClick={() => setDeleting(question)}><Trash2 className="size-4" />Deactivate</Button>
                  </div>
                </div>
              </div>
            </div>)}
          </CardContent>
        </Card>;
      })}
    </div>
    <QuestionEditor editor={editor} onClose={() => setEditor(null)} onSave={(input) => perform(() => {
      if (!editor) return;
      if (editor.question) updateQuestionDefinition(editor.question.id, input, currentUser.id);
      else addQuestionDefinition(editor.sectionId, input, currentUser.id);
      setEditor(null);
    }, editor?.question ? "Question updated." : "Question added.")} />
    <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Deactivate question?</AlertDialogTitle><AlertDialogDescription>This question will no longer appear in new audits. Existing, in-progress, and completed audit snapshots remain unchanged.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => { if (!deleting) return; perform(() => deactivateQuestionDefinition(deleting.id, currentUser.id), "Question deactivated for future audits."); setDeleting(null); }}>Deactivate Question</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </PageContainer>;
}

function QuestionEditor({ editor, onClose, onSave }: { editor: EditorState; onClose: () => void; onSave: (input: QuestionDefinitionInput) => void }) {
  return <Dialog open={Boolean(editor)} onOpenChange={(open) => !open && onClose()}><DialogContent className="grid max-h-[calc(100dvh-1.5rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:!max-w-2xl">{editor && <EditorForm key={editor.question?.id ?? `new-${editor.sectionId}`} editor={editor} onClose={onClose} onSave={onSave} />}</DialogContent></Dialog>;
}

function EditorForm({ editor, onClose, onSave }: { editor: NonNullable<EditorState>; onClose: () => void; onSave: (input: QuestionDefinitionInput) => void }) {
  const existing = editor.question;
  const [questionText, setQuestionText] = useState(existing?.questionText ?? "");
  const [required, setRequired] = useState(existing?.required ?? true);
  const [title, setTitle] = useState(existing?.referenceGuide.title ?? "");
  const [description, setDescription] = useState(existing?.referenceGuide.description ?? "");
  const [image, setImage] = useState(existing?.referenceGuide.image ?? "");
  const [imageError, setImageError] = useState("");
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = questionText.trim() && title.trim() && description.trim() && image.trim() && !processing;

  async function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setProcessing(true);
    setImageError("");
    try { setImage((await optimizeEvidenceImage(file)).dataUrl); }
    catch (cause) { setImageError(cause instanceof Error ? cause.message : "Unable to process this image."); }
    finally { setProcessing(false); }
  }

  return <>
    <DialogHeader className="border-b px-5 py-4"><DialogTitle>{existing ? "Edit Question" : "Add Question"}</DialogTitle><DialogDescription>{editor.sectionId} is system-defined and cannot be changed.</DialogDescription></DialogHeader>
    <div className="min-h-0 space-y-4 overflow-y-auto px-5 py-5">
      <Field label="Question"><Textarea value={questionText} onChange={(event) => setQuestionText(event.target.value)} className="min-h-24" placeholder="Enter the audit question..." /></Field>
      <div className="flex items-center justify-between rounded-lg border p-3"><div><Label htmlFor="question-required">Required</Label><p className="mt-1 text-xs text-muted-foreground">Required questions must be answered before audit completion.</p></div><Switch id="question-required" checked={required} onCheckedChange={setRequired} /></div>
      <Field label="Reference Guide Title"><Input value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
      <Field label="Reference Guide Description"><Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24" /></Field>
      <Field label="Reference Image"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={processing}><ImageIcon className="size-4" />{processing ? "Processing..." : image ? "Replace Image" : "Choose Image"}</Button><input ref={inputRef} hidden type="file" accept="image/*" onChange={chooseImage} />{image && <div className="relative aspect-video w-full max-w-52 overflow-hidden rounded-lg border bg-muted"><Image src={image} alt="Reference preview" fill sizes="208px" className="object-cover" /></div>}</div>{imageError && <p className="text-sm text-destructive">{imageError}</p>}<p className="text-xs text-muted-foreground">Images are compressed into browser storage for this frontend MVP.</p></Field>
    </div>
    <DialogFooter className="m-0 border-t p-4"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={() => onSave({ questionText, required, referenceGuide: { image, title, description } })}>Save Question</Button></DialogFooter>
  </>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><Label>{label}</Label>{children}</div>;
}
