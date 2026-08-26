import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { ReportItem } from "../types/reports";

interface ReportCardProps {
  report: ReportItem;
}

export default function ReportCard({
  report,
}: ReportCardProps) {
  const Icon = report.icon;

  return (
    <Link href={report.href}>
      <Card className="group h-full cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-lg">
        <CardContent className="flex h-full flex-col justify-between p-6">

          <div>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>

            <h3 className="mb-2 text-lg font-semibold">
              {report.title}
            </h3>

            <p className="text-sm leading-6 text-muted-foreground">
              {report.description}
            </p>

          </div>

          <div className="mt-6 flex items-center text-sm font-medium text-primary">
            View Report

            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}