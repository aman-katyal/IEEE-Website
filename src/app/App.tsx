import { Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CommitteePage } from "./pages/CommitteePage";
import { CommitteesPage } from "./pages/CommitteesPage";
import { OfficersPage } from "./pages/OfficersPage";
import { CalendarPage } from "./pages/CalendarPage";
import { JoinPage } from "./pages/JoinPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { ConstitutionPage } from "./pages/ConstitutionPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/committees" element={<CommitteesPage />} />
        <Route path="/committee/:id" element={<CommitteePage />} />
        <Route path="/officers" element={<OfficersPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/constitution" element={<ConstitutionPage />} />
      </Route>
    </Routes>
  );
}
