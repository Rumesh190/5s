import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: ElementType;
  className?: string;
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 transition-[border-color,box-shadow,transform] hover:-translate-y-px hover:border-border hover:shadow-[0_8px_24px_-18px_rgb(16_24_40/0.35)] dark:hover:border-white/10",
        className
      )}
    >
      <CardContent className="p-4 sm:p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <p className="mt-1.5 text-2xl font-semibold leading-none tracking-[-0.03em] text-foreground">
              {value}
            </p>
          </div>

          {Icon && (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/8 text-primary">
              <Icon className="size-[18px]" />
            </div>
          )}
        </div>

        {description && (
          <p className="mt-2.5 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export { StatCard };
