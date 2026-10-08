import {
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
    Users,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

function Dashboard() {
    const { user } = useAuth();

    const employee = user?.employee;

    const cards = [
        {
            label: "Employee Number",
            value: employee?.employee_number,
            icon: BadgeCheck,
            tone: "indigo",
        },
        {
            label: "Department",
            value:
                employee?.department?.code ||
                "—",
            icon: Building2,
            tone: "blue",
        },
        {
            label: "Position",
            value: employee?.position,
            icon: BriefcaseBusiness,
            tone: "emerald",
        },
        {
            label: "Access Role",
            value: user?.role?.display_name,
            icon: ShieldCheck,
            tone: "amber",
        },
    ];

    return (
        <div className="dashboard-page">

            <div className="page-header">

                <div>
                    <span className="eyebrow">
                        Dashboard
                    </span>

                    <h1>
                        Welcome back,{" "}
                        {employee?.first_name}.
                    </h1>

                    <p>
                        Here's an overview of your
                        employee profile and workspace.
                    </p>
                </div>

                <div className="page-header-badge">
                    <span className="status-dot" />

                    Account active
                </div>

            </div>


            <div className="stats-grid">

                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            className="stat-card"
                            key={card.label}
                        >
                            <div
                                className={
                                    `stat-icon ` +
                                    `stat-icon-${card.tone}`
                                }
                            >
                                <Icon size={21} />
                            </div>

                            <div>
                                <span className="stat-label">
                                    {card.label}
                                </span>

                                <strong className="stat-value">
                                    {card.value || "—"}
                                </strong>
                            </div>
                        </div>
                    );
                })}

            </div>


            <div className="dashboard-columns">

                <section className="panel">

                    <div className="panel-header">
                        <div>
                            <h2>
                                Employee information
                            </h2>

                            <p>
                                Your current personal and
                                employment details.
                            </p>
                        </div>

                        <UserRound size={21} />
                    </div>


                    <div className="details-list">

                        <div className="details-row">
                            <div className="details-icon">
                                <UserRound size={17} />
                            </div>

                            <div>
                                <span>
                                    Full name
                                </span>

                                <strong>
                                    {
                                        employee
                                            ?.full_name
                                    }
                                </strong>
                            </div>
                        </div>


                        <div className="details-row">
                            <div className="details-icon">
                                <Mail size={17} />
                            </div>

                            <div>
                                <span>
                                    Email address
                                </span>

                                <strong>
                                    {user?.email}
                                </strong>
                            </div>
                        </div>


                        <div className="details-row">
                            <div className="details-icon">
                                <Phone size={17} />
                            </div>

                            <div>
                                <span>
                                    Contact number
                                </span>

                                <strong>
                                    {
                                        employee
                                            ?.contact_number ||
                                        "Not provided"
                                    }
                                </strong>
                            </div>
                        </div>


                        <div className="details-row">
                            <div className="details-icon">
                                <Users size={17} />
                            </div>

                            <div>
                                <span>
                                    Supervisor
                                </span>

                                <strong>
                                    {
                                        employee
                                            ?.supervisor
                                            ?.full_name ||
                                        "Not assigned"
                                    }
                                </strong>
                            </div>
                        </div>

                    </div>

                </section>


                <section className="panel workspace-card">

                    <div className="workspace-icon">
                        <ShieldCheck size={30} />
                    </div>

                    <span className="eyebrow">
                        Workspace ready
                    </span>

                    <h2>
                        Your leave workspace
                        is ready.
                    </h2>

                    <p>
                        Leave requests, balances,
                        approval workflows, and team
                        management will appear here as
                        we build the next modules.
                    </p>

                </section>

            </div>

        </div>
    );
}

export default Dashboard;