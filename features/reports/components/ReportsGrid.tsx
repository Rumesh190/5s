import ReportCard from "./ReportCard";

import { reports } from "../data/reports";

export default function ReportsGrid() {
  return (
    <section className="pb-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
          />
        ))}
      </div>
    </section>
  );
}