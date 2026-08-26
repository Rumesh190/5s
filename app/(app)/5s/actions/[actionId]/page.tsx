import FiveSActionDetailPage from "@/features/five-s/action-detail-page";

interface PageProps {
  params: Promise<{ actionId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { actionId } = await params;
  return <FiveSActionDetailPage actionId={actionId} />;
}
