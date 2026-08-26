import { RedTagDetailPage } from "@/features/five-s/red-tag/red-tag-module";

export default async function Page({ params }: { params: Promise<{ tagId: string }> }) {
  const { tagId } = await params;
  return <RedTagDetailPage tagId={tagId} />;
}
