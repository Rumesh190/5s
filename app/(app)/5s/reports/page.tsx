import FiveSReportsPage from "@/features/five-s/reports-page";

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string; sort?: string }> }) {
  const params = await searchParams;
  return <FiveSReportsPage initialTab={params.tab} initialSearch={params.q} initialSort={params.sort} />;
}
