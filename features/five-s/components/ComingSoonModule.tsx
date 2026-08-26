import type { LucideIcon } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import FiveSPageHeader from "./FiveSPageHeader";

interface ComingSoonModuleProps {
  eyebrow: string;
  title: string;
  description: string;
  message: string;
  icon: LucideIcon;
}

export default function ComingSoonModule({
  eyebrow,
  title,
  description,
  message,
  icon: Icon,
}: ComingSoonModuleProps) {
  return (
    <PageContainer>
      <FiveSPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <section className="flex min-h-[340px] items-center justify-center rounded-xl border border-border/75 bg-card px-6 py-12 shadow-[0_12px_35px_-32px_rgb(15_23_42/0.35)] dark:shadow-none sm:min-h-[390px]">
        <div className="max-w-lg text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.07] text-primary">
            <Icon className="size-5" />
          </span>
          <p className="mt-5 text-base font-semibold text-foreground">Coming Soon</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>
      </section>
    </PageContainer>
  );
}
