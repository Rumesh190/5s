import { RedTagPrintPage } from "@/features/five-s/red-tag/red-tag-module";

export default async function Page({ params }: { params: Promise<{ tagId: string }> }) {
  const { tagId } = await params;
  return <RedTagPrintPage tagId={tagId} />;
}
