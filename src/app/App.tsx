import { Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CommitteePage } from "./pages/CommitteePage";
import { OfficersPage } from "./pages/OfficersPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/committee/:id" element={<CommitteePage />} />
        <Route path="/officers" element={<OfficersPage />} />
      </Route>
    </Routes>
  );
}
