import { Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CommitteePage } from "./pages/CommitteePage";
import { CommitteesPage } from "./pages/CommitteesPage";
import { OfficersPage } from "./pages/OfficersPage";
import { CalendarPage } from "./pages/CalendarPage";
import { JoinPage } from "./pages/JoinPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/committees" element={<CommitteesPage />} />
        <Route path="/committee/:id" element={<CommitteePage />} />
        <Route path="/officers" element={<OfficersPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/join" element={<JoinPage />} />
      </Route>
    </Routes>
  );
}
