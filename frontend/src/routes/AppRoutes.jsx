import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Unauthorized from "../pages/errors/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            {/* Public */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* Protected */}

            <Route element={<ProtectedRoute />}>
                <Route
                    element={<DashboardLayout />}
                >
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                </Route>
            </Route>


            {/* Errors */}

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* Default */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />


            {/* 404 fallback */}

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