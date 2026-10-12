import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Unauthorized from "../pages/errors/Unauthorized";

import LeaveList from "../pages/leaves/LeaveList";
import LeaveCreate from "../pages/leaves/LeaveCreate";
import LeaveDetails from "../pages/leaves/LeaveDetails";
import LeaveBalances from "../pages/leaves/LeaveBalances";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
    return (
        <Routes>

            {/* =====================================================
                Public Routes
            ===================================================== */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =====================================================
                Protected Application
            ===================================================== */}

            <Route element={<ProtectedRoute />}>

                {/*
                    DashboardLayout stays mounted for ALL
                    of the routes below.

                    This means:
                    - Sidebar stays visible
                    - Topbar stays visible
                    - Only <Outlet /> changes
                */}

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* Leave Management */}

                    <Route
                        path="/leaves"
                        element={<LeaveList />}
                    />

                    <Route
                        path="/leaves/create"
                        element={<LeaveCreate />}
                    />

                    <Route
                        path="/leaves/:id"
                        element={<LeaveDetails />}
                    />

                    <Route
                        path="/leave-balances"
                        element={<LeaveBalances />}
                    />

                </Route>

            </Route>


            {/* =====================================================
                Error Pages
            ===================================================== */}

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* =====================================================
                Default Route
            ===================================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />


            {/* =====================================================
                404 Fallback
            ===================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default AppRoutes;