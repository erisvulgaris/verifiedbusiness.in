"use client";

import { useState, useEffect } from "react";
import { TopNav, Footer, type ViewKey } from "@/components/showcase/TopNav";
import { HomepageView } from "@/components/showcase/HomepageView";
import { CategoryListingView } from "@/components/showcase/CategoryListingView";
import { BusinessDetailView } from "@/components/showcase/BusinessDetailView";
import { StyleGuideView } from "@/components/showcase/StyleGuideView";

export default function Page() {
  const [view, setView] = useState<ViewKey>("home");
  const [businessId, setBusinessId] = useState<string | undefined>(undefined);

  // Scroll to top on view change for clean transitions
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [view, businessId]);

  const handleOpenBusiness = (id: string) => {
    setBusinessId(id);
    setView("detail");
  };

  const handleNavigate = (target: "category" | "detail") => {
    setView(target);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-base)" }}
    >
      <TopNav activeView={view} onViewChange={setView} />

      <main className="flex-1">
        {view === "home" && (
          <HomepageView
            onNavigate={handleNavigate}
            onOpenBusiness={handleOpenBusiness}
          />
        )}
        {view === "category" && (
          <CategoryListingView
            onOpenBusiness={handleOpenBusiness}
            onNavigateHome={() => setView("home")}
          />
        )}
        {view === "detail" && (
          <BusinessDetailView
            businessId={businessId}
            onNavigateHome={() => setView("home")}
            onNavigateCategory={() => setView("category")}
            onOpenBusiness={handleOpenBusiness}
          />
        )}
        {view === "style-guide" && <StyleGuideView />}
      </main>

      <Footer />
    </div>
  );
}
