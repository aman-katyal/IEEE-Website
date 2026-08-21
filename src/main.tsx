import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./bones/registry";

import { Layout } from "./app/components/shared/Layout";
import { PageTransition } from "./app/components/shared/PageTransition";
import { ErrorBoundary } from "./app/components/shared/ErrorBoundary";
import { PageSkeleton } from "./app/components/shared/PageSkeleton";

const HomePage = React.lazy(() => import('./app/pages/HomePage').then(m => ({ default: m.HomePage })));
const CommitteePage = React.lazy(() => import('./app/pages/CommitteePage').then(m => ({ default: m.CommitteePage })));
const CommitteesPage = React.lazy(() => import('./app/pages/CommitteesPage').then(m => ({ default: m.CommitteesPage })));
const OfficersPage = React.lazy(() => import('./app/pages/OfficersPage').then(m => ({ default: m.OfficersPage })));
const CalendarPage = React.lazy(() => import('./app/pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const JoinPage = React.lazy(() => import('./app/pages/JoinPage').then(m => ({ default: m.JoinPage })));
const AboutUsPage = React.lazy(() => import('./app/pages/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const PartnersPage = React.lazy(() => import('./app/pages/PartnersPage').then(m => ({ default: m.PartnersPage })));
const ConstitutionPage = React.lazy(() => import('./app/pages/ConstitutionPage').then(m => ({ default: m.ConstitutionPage })));
const PrivacyPage = React.lazy(() => import('./app/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = React.lazy(() => import('./app/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const AccessibilityPage = React.lazy(() => import('./app/pages/AccessibilityPage').then(m => ({ default: m.AccessibilityPage })));
const FinancePortalPage = React.lazy(() => import('./app/pages/FinancePortalPage').then(m => ({ default: m.FinancePortalPage })));
const NotFoundPage = React.lazy(() => import('./app/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Layout />,
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

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ErrorBoundary>
);
