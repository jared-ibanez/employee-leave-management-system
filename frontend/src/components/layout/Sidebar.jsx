import {
    NavLink,
} from "react-router-dom";

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

    const role =
        user?.role?.name;

    const employee =
        user?.employee;


    const initials = [
        employee?.first_name?.[0],
        employee?.last_name?.[0],
    ]
        .filter(Boolean)
        .join("")
        .toUpperCase();


    const getLinkClass =
        ({ isActive }) =>
            `sidebar-nav-item ${
                isActive
                    ? "active"
                    : ""
            }`;


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
                    className={
                        getLinkClass
                    }
                >
                    <LayoutDashboard
                        size={19}
                    />

                    <span>
                        Dashboard
                    </span>
                </NavLink>


                <span className="sidebar-section-label">
                    My Leave
                </span>

                <NavLink
                    to="/leaves"
                    end
                    className={getLinkClass}
                >
                    <CalendarDays size={19} />

                    <span>
                        Leave Requests
                    </span>
                </NavLink>


                <NavLink
                    to="/leaves/create"
                    className={
                        getLinkClass
                    }
                >
                    <FilePlus2
                        size={19}
                    />

                    <span>
                        Apply for Leave
                    </span>
                </NavLink>


                <NavLink
                    to="/leave-balances"
                    className={
                        getLinkClass
                    }
                >
                    <WalletCards
                        size={19}
                    />

                    <span>
                        Leave Balance
                    </span>
                </NavLink>

                


                {role === "supervisor" && (
                    <>
                        <span className="sidebar-section-label">
                            Team Management
                        </span>

                        <div className="sidebar-nav-item sidebar-nav-item-disabled">
                            <ClipboardCheck
                                size={19}
                            />

                            <span>
                                Pending Approvals
                            </span>

                            <small>
                                Soon
                            </small>
                        </div>

                        <div className="sidebar-nav-item sidebar-nav-item-disabled">
                            <Users
                                size={19}
                            />

                            <span>
                                My Team
                            </span>

                            <small>
                                Soon
                            </small>
                        </div>
                    </>
                )}


                {role === "hr_admin" && (
                    <>
                        <span className="sidebar-section-label">
                            Administration
                        </span>

                        <div className="sidebar-nav-item sidebar-nav-item-disabled">
                            <Users size={19} />

                            <span>
                                Employees
                            </span>

                            <small>
                                Soon
                            </small>
                        </div>

                        <div className="sidebar-nav-item sidebar-nav-item-disabled">
                            <Building2
                                size={19}
                            />

                            <span>
                                Departments
                            </span>

                            <small>
                                Soon
                            </small>
                        </div>

                        <div className="sidebar-nav-item sidebar-nav-item-disabled">
                            <Tags size={19} />

                            <span>
                                Leave Types
                            </span>

                            <small>
                                Soon
                            </small>
                        </div>

                        <div className="sidebar-nav-item sidebar-nav-item-disabled">
                            <BarChart3
                                size={19}
                            />

                            <span>
                                Reports
                            </span>

                            <small>
                                Soon
                            </small>
                        </div>
                    </>
                )}

            </nav>


            <div className="sidebar-user">

                <div className="user-avatar">
                    {initials || "U"}
                </div>

                <div className="sidebar-user-info">

                    <strong>
                        {employee?.full_name}
                    </strong>

                    <span>
                        {
                            employee
                                ?.employee_number
                        }
                    </span>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;