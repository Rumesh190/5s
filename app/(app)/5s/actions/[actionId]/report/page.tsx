import FiveSActionReportRoute from "@/features/five-s/action-report-route";

interface PageProps {
  params: Promise<{
    actionId: string;
  }>;
  searchParams: Promise<{ from?: string; returnTo?: string }>;
}

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  const { actionId } = await params;
  const context = await searchParams;

  return (
    <FiveSActionReportRoute
      actionId={actionId}
      origin={context.from}
      returnTo={context.returnTo}
    />
  );
}
