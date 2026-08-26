import { TrendingUp } from "lucide-react";

import ComingSoonModule from "@/features/five-s/components/ComingSoonModule";

export default function Page() {
  return (
    <ComingSoonModule
      eyebrow="Continuous Improvement"
      title="Continuous Improvement"
      description="Track, prioritize and manage improvement opportunities across your plant."
      message="We're building a focused workspace for continuous improvement initiatives and measurable outcomes."
      icon={TrendingUp}
    />
  );
}
