import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./bones/registry";

import { Layout } from "./app/components/shared/Layout";
import { HomePage } from "./app/pages/HomePage";
import { CommitteePage } from "./app/pages/CommitteePage";
import { CommitteesPage } from "./app/pages/CommitteesPage";
import { OfficersPage } from "./app/pages/OfficersPage";
import { CalendarPage } from "./app/pages/CalendarPage";
import { JoinPage } from "./app/pages/JoinPage";
import { AboutUsPage } from "./app/pages/AboutUsPage";
import { PartnersPage } from "./app/pages/PartnersPage";
import { ConstitutionPage } from "./app/pages/ConstitutionPage";
import { PageTransition } from "./app/components/shared/PageTransition";

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
          { path: "/", element: <PageTransition><HomePage /></PageTransition> },
          { path: "/about", element: <PageTransition><AboutUsPage /></PageTransition> },
          { path: "/committees", element: <PageTransition><CommitteesPage /></PageTransition> },
          { path: "/committee/:id", element: <PageTransition><CommitteePage /></PageTransition> },
          { path: "/officers", element: <PageTransition><OfficersPage /></PageTransition> },
          { path: "/calendar", element: <PageTransition><CalendarPage /></PageTransition> },
          { path: "/join", element: <PageTransition><JoinPage /></PageTransition> },
          { path: "/partners", element: <PageTransition><PartnersPage /></PageTransition> },
          { path: "/constitution", element: <PageTransition><ConstitutionPage /></PageTransition> },
          { path: "*", element: <div style={{ color: 'white', padding: '100px' }}>404 - Page Not Found</div> },
        ]
      }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
