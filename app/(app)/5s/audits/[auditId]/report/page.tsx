import FiveSAuditReport from "@/features/five-s/components/FiveSAuditReport";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ auditId: string }>;
  searchParams: Promise<{ from?: string; returnTo?: string }>;
}) {
  const { auditId } = await params;
  const context = await searchParams;
  return <FiveSAuditReport auditId={decodeURIComponent(auditId)} origin={context.from} returnTo={context.returnTo} />;
}
