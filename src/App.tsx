import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Campaigns } from "./pages/Campaigns";
import { Templates } from "./pages/Templates";
import { Analytics } from "./pages/Analytics";
import { Education } from "./pages/Education";
import { Layout } from "./components/Layout";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/education" element={<Education />} />
      </Routes>
    </Layout>
  );
}
