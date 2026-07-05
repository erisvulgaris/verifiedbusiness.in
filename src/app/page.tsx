"use client";

import { useState, useEffect, useCallback } from "react";
import { TopNav, Footer, type ViewKey } from "@/components/showcase/TopNav";
import { HomepageView } from "@/components/showcase/HomepageView";
import { CategoryListingView } from "@/components/showcase/CategoryListingView";
import { BusinessDetailView } from "@/components/showcase/BusinessDetailView";
import { StyleGuideView } from "@/components/showcase/StyleGuideView";
import { SearchResultsView } from "@/components/showcase/SearchResultsView";
import { AllCategoriesView } from "@/components/showcase/AllCategoriesView";
import { LocationsView } from "@/components/showcase/LocationsView";
import { CompareView } from "@/components/showcase/CompareView";
import { FavoritesView } from "@/components/showcase/FavoritesView";
import { ListBusinessView } from "@/components/showcase/ListBusinessView";
import { WriteReviewView } from "@/components/showcase/WriteReviewView";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { AdminBusinessesView } from "@/components/admin/AdminBusinessesView";
import { AdminReviewsView } from "@/components/admin/AdminReviewsView";
import { AdminSubscriptionsView } from "@/components/admin/AdminSubscriptionsView";
import { AdminSettingsView } from "@/components/admin/AdminSettingsView";
import { AdminAnalyticsView } from "@/components/admin/AdminAnalyticsView";
import { AdminAuditLogView } from "@/components/admin/AdminAuditLogView";
import {
  CommandPalette,
  useCommandPaletteShortcut,
} from "@/components/showcase/CommandPalette";
import { MobileTabBar } from "@/components/showcase/MobileTabBar";
import { ErrorBoundary, useGlobalErrorHandler } from "@/components/showcase/ErrorBoundary";
import { KeyboardShortcutsOverlay, KeyboardHintButton } from "@/components/showcase/KeyboardShortcutsOverlay";
import { BackToTopButton, ScrollProgressBar } from "@/components/showcase/BackToTopButton";
import { track } from "@/lib/analytics";
import { RecentlyViewedProvider } from "@/components/showcase/RecentlyViewedContext";
import { FavoritesProvider } from "@/components/showcase/FavoritesContext";
import { CompareProvider } from "@/components/showcase/CompareContext";

export default function Page() {
  const [view, setView] = useState<ViewKey>("home");
  const [businessId, setBusinessId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | undefined>(undefined);
  const [activeCityName, setActiveCityName] = useState<string | undefined>(undefined);
  const [searchLocation, setSearchLocation] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Attach global error handlers (window.onerror, unhandledrejection)
  useGlobalErrorHandler();

  // Scroll to top on view change for clean transitions
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    // Track page view
    track.pageView(view);
  }, [view, businessId]);

  // Register Cmd+K shortcut
  useCommandPaletteShortcut(useCallback(() => setPaletteOpen((o) => !o), []));

  const handleOpenBusiness = (id: string) => {
    setBusinessId(id);
    setView("detail");
    track.businessViewed(id, id); // In production, pass actual business name
  };

  const handleNavigate = (target: "category" | "detail") => {
    setView(target);
  };

  const handleSearch = (q: { query: string; location: string }) => {
    setSearchQuery(q.query);
    setSearchLocation(q.location);
    setView("search");
    track.search(q.query, 0, q.location);
  };

  return (
    <FavoritesProvider>
      <CompareProvider>
        <RecentlyViewedProvider>
          <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "var(--color-base)" }}
          >
            {/* Skip to content — keyboard accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2.5 focus:rounded-[8px]"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                fontFamily: "var(--font-jakarta), sans-serif",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              Skip to content
            </a>

            <TopNav
              activeView={view === "detail" ? "business" : view}
              onViewChange={(v) => {
                if (v === "business") {
                  setView("detail");
                } else {
                  setView(v);
                }
              }}
              onOpenPalette={() => setPaletteOpen(true)}
            />

            <main className="flex-1 pb-20 lg:pb-0" id="main-content" tabIndex={-1}>
              <ErrorBoundary>
              {view === "home" && (
                <HomepageView
                  onNavigate={handleNavigate}
                  onOpenBusiness={handleOpenBusiness}
                  onSearch={handleSearch}
                  onViewAllCategories={() => setView("all-categories")}
                  onViewLocations={() => setView("locations")}
                  onSelectCategory={(slug) => {
                    setActiveCategorySlug(slug);
                    setActiveCityName(undefined);
                    setView("category");
                  }}
                />
              )}
              {view === "category" && (
                <CategoryListingView
                  categorySlug={activeCategorySlug}
                  cityName={activeCityName}
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
                  onNavigateWriteReview={() => setView("write-review")}
                />
              )}
              {view === "style-guide" && <StyleGuideView />}
              {view === "search" && (
                <SearchResultsView
                  initialQuery={searchQuery}
                  initialLocation={searchLocation}
                  onOpenBusiness={handleOpenBusiness}
                  onNavigateHome={() => setView("home")}
                />
              )}
              {view === "all-categories" && (
                <AllCategoriesView
                  onNavigateCategory={(slug) => {
                    setActiveCategorySlug(slug);
                    setActiveCityName(undefined);
                    setView("category");
                  }}
                  onNavigateHome={() => setView("home")}
                />
              )}
              {view === "locations" && (
                <LocationsView
                  onNavigateHome={() => setView("home")}
                  onNavigateCategory={() => setView("category")}
                />
              )}
              {view === "compare" && (
                <CompareView
                  onOpenBusiness={handleOpenBusiness}
                  onNavigateHome={() => setView("home")}
                  onNavigateCategory={() => setView("category")}
                />
              )}
              {view === "favorites" && (
                <FavoritesView
                  onOpenBusiness={handleOpenBusiness}
                  onNavigateHome={() => setView("home")}
                />
              )}
              {view === "list-business" && (
                <ListBusinessView onNavigateHome={() => setView("home")} />
              )}
              {view === "write-review" && (
                <WriteReviewView
                  businessId={businessId}
                  onNavigateHome={() => setView("home")}
                  onBack={() => setView("detail")}
                />
              )}
              {view === "admin-dashboard" && (
                <AdminDashboardView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
              )}
              {view === "admin-businesses" && (
                <AdminBusinessesView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                  onOpenBusiness={handleOpenBusiness}
                />
              )}
              {view === "admin-reviews" && (
                <AdminReviewsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
              )}
              {view === "admin-subscriptions" && (
                <AdminSubscriptionsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
              )}
              {view === "admin-settings" && (
                <AdminSettingsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
              )}
              {view === "admin-analytics" && (
                <AdminAnalyticsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
              )}
              {view === "admin-audit-log" && (
                <AdminAuditLogView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
              )}
              </ErrorBoundary>
            </main>

            <Footer
              onNavigate={(v) => setView(v as ViewKey)}
              onViewLocations={() => setView("locations")}
              onViewAllCategories={() => setView("all-categories")}
              onViewListBusiness={() => setView("list-business")}
            />

            {/* Mobile bottom tab bar — native-app feel */}
            <MobileTabBar
              activeView={view === "detail" ? "business" : view}
              onViewChange={(v) => setView(v)}
            />
          </div>

          <CommandPalette
            key={paletteOpen ? "open" : "closed"}
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            onNavigate={(v) => setView(v)}
            onOpenBusiness={handleOpenBusiness}
            onSearch={handleSearch}
          />

          {/* Keyboard shortcuts overlay — press ? to open */}
          <KeyboardShortcutsOverlay />
          <KeyboardHintButton />

          {/* Scroll progress + back to top */}
          <ScrollProgressBar />
          <BackToTopButton />
        </RecentlyViewedProvider>
      </CompareProvider>
    </FavoritesProvider>
  );
}
