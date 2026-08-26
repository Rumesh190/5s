import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AdminModule } from "../types/admin";

interface AdminCardProps {
  module: AdminModule;
}

export default function AdminCard({ module }: AdminCardProps) {
  const Icon = module.icon;

  return (
    <Link href={module.href} className="block">
      <Card className="group h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
        <CardContent className="flex h-full flex-col justify-between p-6">
          <div>
            {/* Icon */}
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>

            {/* Title */}
            <h3 className="mb-2 text-lg font-semibold">
              {module.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-6 text-muted-foreground">
              {module.description}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center text-sm font-medium text-primary">
            Manage

            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}