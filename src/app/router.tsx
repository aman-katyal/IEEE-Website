import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router";
import App from "./App";

import { Layout } from "./components/shared/Layout";
import { PageTransition } from "./components/shared/PageTransition";
import { RouteErrorBoundary } from "./components/shared/ErrorBoundary";
import { PageSkeleton } from "./components/shared/PageSkeleton";

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

const HomePage = lazyWithRetry(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CommitteePage = lazyWithRetry(() => import('./pages/CommitteePage').then(m => ({ default: m.CommitteePage })));
const CommitteesPage = lazyWithRetry(() => import('./pages/CommitteesPage').then(m => ({ default: m.CommitteesPage })));
const OfficersPage = lazyWithRetry(() => import('./pages/OfficersPage').then(m => ({ default: m.OfficersPage })));
const CalendarPage = lazyWithRetry(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const JoinPage = lazyWithRetry(() => import('./pages/JoinPage').then(m => ({ default: m.JoinPage })));
const AboutUsPage = lazyWithRetry(() => import('./pages/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const PartnersPage = lazyWithRetry(() => import('./pages/PartnersPage').then(m => ({ default: m.PartnersPage })));
const ConstitutionPage = lazyWithRetry(() => import('./pages/ConstitutionPage').then(m => ({ default: m.ConstitutionPage })));
const PrivacyPage = lazyWithRetry(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazyWithRetry(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const AccessibilityPage = lazyWithRetry(() => import('./pages/AccessibilityPage').then(m => ({ default: m.AccessibilityPage })));
const FinancePortalPage = lazyWithRetry(() => import('./pages/FinancePortalPage').then(m => ({ default: m.FinancePortalPage })));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const router = createBrowserRouter([
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
          { path: "*", element: <PageTransition><Suspense fallback={<PageSkeleton />}><NotFoundPage /></Suspense></PageTransition> },
        ]
      }
    ]
  }
]);
