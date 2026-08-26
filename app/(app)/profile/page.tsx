import { UserCircle } from "lucide-react";

import { ComingSoonPanel } from "@/components/layout/coming-soon-panel";
import { PageContainer } from "@/components/layout/page-container";

export default function ProfilePage() {
  return (
    <PageContainer
      title="Profile Settings"
      description="Manage your profile, password, and account preferences."
    >
      <ComingSoonPanel
        icon={UserCircle}
        title="Profile settings are coming soon"
        description="My Profile, Change Password, and account preferences will be built here."
      />
    </PageContainer>
  );
}
