"use client";

import * as React from "react";

import { Header } from "@/components/navigation/header";
import { ProductNav } from "@/components/navigation/product-nav";
import { Sidebar } from "@/components/navigation/sidebar";

/**
 * Standalone 5S application shell: desktop product navigation, compact mobile
 * header, and one consistently aligned content outlet.
 */
function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.dataset.sidebar = sidebarCollapsed
      ? "collapsed"
      : "expanded";
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-muted/35 dark:bg-[#15171c]">
      <ProductNav />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
      />

      <div className="app-workspace-shell flex min-h-screen flex-col">
        <Header />

        <main className="flex min-w-0 flex-1 flex-col px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-6 2xl:px-8 2xl:py-8">
          <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export { AppShell };
