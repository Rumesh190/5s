import ReportsHeader from "./components/ReportsHeader";
import ReportsFilters from "./components/ReportsFilters";
import ReportsGrid from "./components/ReportsGrid";

export default function ReportsPage() {
  return (
    <main className="flex flex-col gap-8 p-8">
      {/* Page Header */}
      <ReportsHeader />

      {/* Filters */}
      <ReportsFilters />

      {/* Report Cards */}
      <ReportsGrid />
    </main>
  );
}