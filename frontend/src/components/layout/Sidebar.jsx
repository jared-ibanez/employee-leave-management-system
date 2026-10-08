import { NavLink } from "react-router-dom";

import {
    BarChart3,
    Building2,
    CalendarDays,
    ClipboardCheck,
    FilePlus2,
    LayoutDashboard,
    Tags,
    Users,
    WalletCards,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Brand from "../common/Brand";

function Sidebar() {
    const { user } = useAuth();

    const role = user?.role?.name;

    const roleItems = {
        employee: [
            {
                label: "My Leave Requests",
                icon: CalendarDays,
            },
            {
                label: "Apply for Leave",
                icon: FilePlus2,
            },
            {
                label: "Leave Balance",
                icon: WalletCards,
            },
        ],

        supervisor: [
            {
                label: "My Leave Requests",
                icon: CalendarDays,
            },
            {
                label: "Pending Approvals",
                icon: ClipboardCheck,
            },
            {
                label: "My Team",
                icon: Users,
            },
        ],

        hr_admin: [
            {
                label: "Employees",
                icon: Users,
            },
            {
                label: "Departments",
                icon: Building2,
            },
            {
                label: "Leave Types",
                icon: Tags,
            },
            {
                label: "Leave Requests",
                icon: ClipboardCheck,
            },
            {
                label: "Reports",
                icon: BarChart3,
            },
        ],
    };

    const items = roleItems[role] ?? [];

    const sectionTitles = {
        employee: "Employee",
        supervisor: "Supervisor",
        hr_admin: "Administration",
    };

    const initials = [
        user?.employee?.first_name?.[0],
        user?.employee?.last_name?.[0],
    ]
        .filter(Boolean)
        .join("")
        .toUpperCase();

    return (
        <aside className="sidebar">

            <div className="sidebar-brand">
                <Brand light />
            </div>

            <nav className="sidebar-nav">

                <span className="sidebar-section-label">
                    Workspace
                </span>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `sidebar-nav-item ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <LayoutDashboard size={19} />

                    <span>Dashboard</span>
                </NavLink>

                <span className="sidebar-section-label">
                    {sectionTitles[role] ?? "Menu"}
                </span>

                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="sidebar-nav-item sidebar-nav-item-disabled"
                        >
                            <Icon size={19} />

                            <span>
                                {item.label}
                            </span>

                            <small>Soon</small>
                        </div>
                    );
                })}

            </nav>


            <div className="sidebar-user">

                <div className="user-avatar">
                    {initials || "U"}
                </div>

                <div className="sidebar-user-info">
                    <strong>
                        {user?.employee?.full_name}
                    </strong>

                    <span>
                        {user?.employee?.employee_number}
                    </span>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;