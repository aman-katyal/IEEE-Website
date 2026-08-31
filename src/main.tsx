import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./bones/registry";

import { Layout } from "./app/components/shared/Layout";
import { PageTransition } from "./app/components/shared/PageTransition";
import { ErrorBoundary, RouteErrorBoundary } from "./app/components/shared/ErrorBoundary";
import { PageSkeleton } from "./app/components/shared/PageSkeleton";
import { ThemeProvider } from "next-themes";

// Handle stale chunks after new deployments
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    const hasReloaded = window.sessionStorage.getItem("chunk_reload");
    if (!hasReloaded) {
      window.sessionStorage.setItem("chunk_reload", "true");
      window.location.reload();
    }
  });
}

function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    try {
      const component = await factory();
      window.sessionStorage.removeItem("chunk_reload");
      return component;
    } catch (error) {
      const hasReloaded = window.sessionStorage.getItem("chunk_reload");
      if (!hasReloaded) {
        window.sessionStorage.setItem("chunk_reload", "true");
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    }
  });
}

const HomePage = lazyWithRetry(() => import('./app/pages/HomePage').then(m => ({ default: m.HomePage })));
const CommitteePage = lazyWithRetry(() => import('./app/pages/CommitteePage').then(m => ({ default: m.CommitteePage })));
const CommitteesPage = lazyWithRetry(() => import('./app/pages/CommitteesPage').then(m => ({ default: m.CommitteesPage })));
const OfficersPage = lazyWithRetry(() => import('./app/pages/OfficersPage').then(m => ({ default: m.OfficersPage })));
const CalendarPage = lazyWithRetry(() => import('./app/pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const JoinPage = lazyWithRetry(() => import('./app/pages/JoinPage').then(m => ({ default: m.JoinPage })));
const AboutUsPage = lazyWithRetry(() => import('./app/pages/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const PartnersPage = lazyWithRetry(() => import('./app/pages/PartnersPage').then(m => ({ default: m.PartnersPage })));
const ConstitutionPage = lazyWithRetry(() => import('./app/pages/ConstitutionPage').then(m => ({ default: m.ConstitutionPage })));
const PrivacyPage = lazyWithRetry(() => import('./app/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazyWithRetry(() => import('./app/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const AccessibilityPage = lazyWithRetry(() => import('./app/pages/AccessibilityPage').then(m => ({ default: m.AccessibilityPage })));
const FinancePortalPage = lazyWithRetry(() => import('./app/pages/FinancePortalPage').then(m => ({ default: m.FinancePortalPage })));
const NotFoundPage = lazyWithRetry(() => import('./app/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

import { Navigate, useLocation } from "react-router";
import { getLegacyRedirectTarget } from "./lib/legacyRedirects";

function CatchAllRoute() {
  const location = useLocation();
  const target = getLegacyRedirectTarget(location.pathname);

  if (target) {
    return <Navigate to={target} replace />;
  }

  return (
    <PageTransition>
      <Suspense fallback={<PageSkeleton />}>
        <NotFoundPage />
      </Suspense>
    </PageTransition>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <Layout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: "/", element: <PageTransition><Suspense fallback={<PageSkeleton />}><HomePage /></Suspense></PageTransition> },
          { path: "/about", element: <PageTransition><Suspense fallback={<PageSkeleton />}><AboutUsPage /></Suspense></PageTransition> },
          { path: "/committees", element: <PageTransition><Suspense fallback={<PageSkeleton />}><CommitteesPage /></Suspense></PageTransition> },
          { path: "/committee/:id", element: <PageTransition><Suspense fallback={<PageSkeleton />}><CommitteePage /></Suspense></PageTransition> },
          { path: "/officers", element: <PageTransition><Suspense fallback={<PageSkeleton />}><OfficersPage /></Suspense></PageTransition> },
          { path: "/calendar", element: <PageTransition><Suspense fallback={<PageSkeleton />}><CalendarPage /></Suspense></PageTransition> },
          { path: "/join", element: <PageTransition><Suspense fallback={<PageSkeleton />}><JoinPage /></Suspense></PageTransition> },
          { path: "/partners", element: <PageTransition><Suspense fallback={<PageSkeleton />}><PartnersPage /></Suspense></PageTransition> },
          { path: "/constitution", element: <PageTransition><Suspense fallback={<PageSkeleton />}><ConstitutionPage /></Suspense></PageTransition> },
          { path: "/privacy", element: <PageTransition><Suspense fallback={<PageSkeleton />}><PrivacyPage /></Suspense></PageTransition> },
          { path: "/terms", element: <PageTransition><Suspense fallback={<PageSkeleton />}><TermsPage /></Suspense></PageTransition> },
          { path: "/accessibility", element: <PageTransition><Suspense fallback={<PageSkeleton />}><AccessibilityPage /></Suspense></PageTransition> },
          { path: "/finance", element: <PageTransition><Suspense fallback={<PageSkeleton />}><FinancePortalPage /></Suspense></PageTransition> },

          // Legacy Committee Direct Aliases (WordPress & Google Index backward compatibility)
          { path: "/rov", element: <Navigate to="/committee/rov" replace /> },
          { path: "/racing", element: <Navigate to="/committee/racing" replace /> },
          { path: "/aerial", element: <Navigate to="/committee/aerial-robotics" replace /> },
          { path: "/part", element: <Navigate to="/committee/aerial-robotics" replace /> },
          { path: "/aesc", element: <Navigate to="/committee/aerial-robotics" replace /> },
          { path: "/aess", element: <Navigate to="/committee/aerial-robotics" replace /> },
          { path: "/aerial-robotics", element: <Navigate to="/committee/aerial-robotics" replace /> },
          { path: "/cs", element: <Navigate to="/committee/computer-society" replace /> },
          { path: "/csociety", element: <Navigate to="/committee/computer-society" replace /> },
          { path: "/computer-society", element: <Navigate to="/committee/computer-society" replace /> },
          { path: "/embs", element: <Navigate to="/committee/embs" replace /> },
          { path: "/mtts", element: <Navigate to="/committee/mtts" replace /> },
          { path: "/mtt-s", element: <Navigate to="/committee/mtts" replace /> },
          { path: "/eds", element: <Navigate to="/committee/eds" replace /> },
          { path: "/smc", element: <Navigate to="/committee/smc" replace /> },
          { path: "/software-saturdays", element: <Navigate to="/committee/software-saturdays" replace /> },
          { path: "/social", element: <Navigate to="/committee/social" replace /> },
          { path: "/growth", element: <Navigate to="/committee/growth" replace /> },
          { path: "/learning", element: <Navigate to="/committee/learning" replace /> },
          { path: "/workspace", element: <Navigate to="/committee/workspace" replace /> },
          { path: "/infrastructure", element: <Navigate to="/committee/workspace" replace /> },
          { path: "/general", element: <Navigate to="/committee/general" replace /> },
          { path: "/hardware", element: <Navigate to="/committee/hardware" replace /> },
          { path: "/assistive-tech", element: <Navigate to="/committee/assistive-tech" replace /> },

          // Legacy Top-Level Page Aliases
          { path: "/sponsors", element: <Navigate to="/partners" replace /> },
          { path: "/sponsorship", element: <Navigate to="/partners" replace /> },
          { path: "/sponsor", element: <Navigate to="/partners" replace /> },
          { path: "/bylaws", element: <Navigate to="/constitution" replace /> },
          { path: "/by-laws", element: <Navigate to="/constitution" replace /> },
          { path: "/dues", element: <Navigate to="/join" replace /> },
          { path: "/membership", element: <Navigate to="/join" replace /> },
          { path: "/history", element: <Navigate to="/about" replace /> },
          { path: "/archive", element: <Navigate to="/about" replace /> },
          { path: "/archives", element: <Navigate to="/about" replace /> },
          { path: "/events", element: <Navigate to="/calendar" replace /> },
          { path: "/leadership", element: <Navigate to="/officers" replace /> },
          { path: "/exec", element: <Navigate to="/officers" replace /> },
          { path: "/executive", element: <Navigate to="/officers" replace /> },
          { path: "/boso", element: <Navigate to="/finance" replace /> },

          // Smart Catch-all Route (handles legacy subpaths like /rov/team, /cs/index.php, and true 404s)
          { path: "*", element: <CatchAllRoute /> },
        ]
      }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
