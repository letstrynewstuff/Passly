// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import MyTickets from "./pages/MyTickets";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PlannerProfile from "./pages/PlannerProfile";
import PlannerPublicProfile from "./pages/PlannerPublicProfile";

// Routes protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ProtectedScannerRoute from "./scanner/ProtectedScannerRoute";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Withdrawals from "./admin/Withdrawals";
import Events from "./admin/Events";

// Scanner Pages
import ScannerPage from "./scanner/ScannerPage";
import ScannerDashboard from "./scanner/ScannerDashboard";
import ScannerLogin from "./scanner/ScannerLogin";
import ScannerNameScreen from "./scanner/ScannerNameScreen";

export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/feed" replace />} />

        {/* Public pages */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* PLANNER PROFILE */}
        <Route
          path="/planner/profile"
          element={
            <ProtectedRoute allowedRoles={["planner"]}>
              <PlannerProfile />
            </ProtectedRoute>
          }
        />

        {/* Public planner page */}
        <Route
          path="/planner/public/:plannerId"
          element={<PlannerPublicProfile />}
        />

        {/* USER TICKETS */}
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        {/* SCANNER  */}

        <Route path="/scanner-login" element={<ScannerLogin />} />

        <Route path="/scanner-name" element={<ScannerNameScreen />} />



        <Route
          path="/scanner"
          element={
            <ProtectedScannerRoute>
              <ScannerDashboard />
            </ProtectedScannerRoute>
          }
        />

        <Route
          path="/event/:eventId/scanner"
          element={
            <ProtectedScannerRoute>
              <ScannerPage /> {/* ← the actual camera + input page */}
            </ProtectedScannerRoute>
          }
        />

        {/* ADMIN ROUTES */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/withdrawals"
          element={
            <AdminRoute>
              <Withdrawals />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <Events />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}
