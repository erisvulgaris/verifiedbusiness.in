"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
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

// Lazy-load admin views — they're heavy and only needed when accessing admin panel
const AdminDashboardView = lazy(() => import("@/components/admin/AdminDashboardView").then(m => ({ default: m.AdminDashboardView })));
const AdminBusinessesView = lazy(() => import("@/components/admin/AdminBusinessesView").then(m => ({ default: m.AdminBusinessesView })));
const AdminReviewsView = lazy(() => import("@/components/admin/AdminReviewsView").then(m => ({ default: m.AdminReviewsView })));
const AdminSubscriptionsView = lazy(() => import("@/components/admin/AdminSubscriptionsView").then(m => ({ default: m.AdminSubscriptionsView })));
const AdminSettingsView = lazy(() => import("@/components/admin/AdminSettingsView").then(m => ({ default: m.AdminSettingsView })));
const AdminAnalyticsView = lazy(() => import("@/components/admin/AdminAnalyticsView").then(m => ({ default: m.AdminAnalyticsView })));
const AdminAuditLogView = lazy(() => import("@/components/admin/AdminAuditLogView").then(m => ({ default: m.AdminAuditLogView })));
const AdminUsersView = lazy(() => import("@/components/admin/AdminUsersView").then(m => ({ default: m.AdminUsersView })));
const AdminContentView = lazy(() => import("@/components/admin/AdminContentView").then(m => ({ default: m.AdminContentView })));
const AdminSystemView = lazy(() => import("@/components/admin/AdminSystemView").then(m => ({ default: m.AdminSystemView })));
const AdminSupportView = lazy(() => import("@/components/admin/AdminSupportView").then(m => ({ default: m.AdminSupportView })));
import {
  CommandPalette,
  useCommandPaletteShortcut,
} from "@/components/showcase/CommandPalette";
import { MobileTabBar } from "@/components/showcase/MobileTabBar";
import { ErrorBoundary, useGlobalErrorHandler } from "@/components/showcase/ErrorBoundary";
import { KeyboardShortcutsOverlay, KeyboardHintButton } from "@/components/showcase/KeyboardShortcutsOverlay";
import { BackToTopButton, ScrollProgressBar } from "@/components/showcase/BackToTopButton";
import { PageTransition } from "@/components/showcase/animations";
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
              <PageTransition viewKey={view}>
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
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminDashboardView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-businesses" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminBusinessesView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                  onOpenBusiness={handleOpenBusiness}
                />
                </Suspense>
              )}
              {view === "admin-reviews" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminReviewsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-subscriptions" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminSubscriptionsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-settings" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminSettingsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-analytics" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminAnalyticsView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-audit-log" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminAuditLogView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-users" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminUsersView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-content" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminContentView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-system" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminSystemView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              {view === "admin-support" && (
                <Suspense fallback={<AdminLoadingFallback />}>
                <AdminSupportView
                  onViewChange={(v) => setView(v)}
                  onExitAdmin={() => setView("home")}
                />
                </Suspense>
              )}
              </PageTransition>
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

/** Loading fallback for lazy-loaded admin views */
function AdminLoadingFallback() {
  return (
    <div className="directory-container py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
        <aside>
          <div className="premium-skeleton h-8 rounded-[8px] mb-4" style={{ width: 100 }} />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="premium-skeleton h-9 rounded-[8px]" />
            ))}
          </div>
        </aside>
        <div>
          <div className="premium-skeleton h-10 rounded-[8px] mb-4" style={{ width: 200 }} />
          <div className="premium-skeleton h-5 rounded-[8px] mb-6" style={{ width: 300 }} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="premium-skeleton h-24 rounded-[12px]" />
            ))}
          </div>
          <div className="premium-skeleton h-64 rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}
