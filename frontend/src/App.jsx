import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import Experiments from "../pages/Experiments.jsx";
import Monitoring from "../pages/Monitoring.jsx";
import Analysis from "../pages/Analysis.jsx";
import Reports from "../pages/Reports.jsx";
import Alerts from "../pages/Alerts.jsx";
import Settings from "../pages/Settings.jsx";

import Login from "../pages/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import Register from "../pages/Register.jsx";

import "./App.css";

function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-panel">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password/:uid/:token"
          element={<ResetPassword />}
        />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/experiments"
              element={<Experiments />}
            />
            <Route
              path="/monitoring"
              element={<Monitoring />}
            />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;