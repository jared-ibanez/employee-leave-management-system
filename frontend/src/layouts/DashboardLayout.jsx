import {
    Outlet,
    useNavigate,
} from "react-router-dom";

import {
    LogOut,
    ShieldCheck,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import useAuth from "../hooks/useAuth";

function DashboardLayout() {
    const {
        user,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    const employee = user?.employee;

    const initials = [
        employee?.first_name?.[0],
        employee?.last_name?.[0],
    ]
        .filter(Boolean)
        .join("")
        .toUpperCase();

    const handleLogout = async () => {
        await logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };

    return (
        <div className="app-shell">

            <Sidebar />

            <div className="app-main">

                <header className="topbar">

                    <div className="topbar-title">
                        <span>
                            Employee Leave Management
                        </span>
                    </div>

                    <div className="topbar-actions">

                        <div className="topbar-role">
                            <ShieldCheck size={16} />

                            {
                                user?.role
                                    ?.display_name
                            }
                        </div>

                        <div className="topbar-user">

                            <div className="user-avatar user-avatar-small">
                                {initials || "U"}
                            </div>

                            <div>
                                <strong>
                                    {
                                        employee
                                            ?.full_name
                                    }
                                </strong>

                                <span>
                                    {employee?.position}
                                </span>
                            </div>

                        </div>

                        <button
                            className="icon-button"
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                        >
                            <LogOut size={19} />
                        </button>

                    </div>

                </header>


                <main className="app-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;