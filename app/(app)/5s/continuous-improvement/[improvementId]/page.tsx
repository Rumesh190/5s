import { ImprovementDetailPage } from "@/features/five-s/continuous-improvement/module";
export default async function Page({ params }: { params: Promise<{ improvementId: string }> }) { const { improvementId } = await params; return <ImprovementDetailPage id={improvementId} />; }
