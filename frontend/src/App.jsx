import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import Experiments from "../pages/Experiments.jsx";
import Monitoring from "../pages/Monitoring.jsx";
import Analysis from "../pages/Analysis.jsx";
import Reports from "../pages/Reports.jsx";
import Alerts from "../pages/Alerts.jsx";
import Settings from "../pages/Settings.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />

        <div className="main-panel">
          <Header />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;