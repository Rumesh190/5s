import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsHeader() {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Reports
        </h1>

        <p className="max-w-2xl text-muted-foreground text-base">
          Analyze audit performance, investigations, compliance, and
          manufacturing quality metrics across all plants.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="default">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>

        <Button size="default">
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </div>
    </div>
  );
}