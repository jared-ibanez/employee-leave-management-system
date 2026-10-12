import {
    CalendarRange,
    WalletCards,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    getLeaveBalances,
} from "../../services/leaveService";


function LeaveBalances() {
    const currentYear =
        new Date().getFullYear();

    const [year, setYear] =
        useState(currentYear);

    const [balances, setBalances] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {
        const loadBalances =
            async () => {
                setLoading(true);
                setError("");

                try {
                    const response =
                        await getLeaveBalances(
                            year
                        );

                    setBalances(
                        response.data ?? []
                    );
                } catch (error) {
                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to load leave balances."
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadBalances();
    }, [year]);


    return (
        <div className="leave-page">

            <div className="page-header">

                <div>
                    <span className="eyebrow">
                        Leave Management
                    </span>

                    <h1>
                        Leave Balances
                    </h1>

                    <p>
                        Review your annual leave
                        entitlements, usage, pending
                        requests, and available days.
                    </p>
                </div>


                <div className="year-selector">

                    <CalendarRange
                        size={17}
                    />

                    <select
                        value={year}
                        onChange={(event) =>
                            setYear(
                                Number(
                                    event.target
                                        .value
                                )
                            )
                        }
                    >
                        {[
                            currentYear,
                            currentYear - 1,
                            currentYear - 2,
                        ].map(
                            (optionYear) => (
                                <option
                                    key={
                                        optionYear
                                    }
                                    value={
                                        optionYear
                                    }
                                >
                                    {
                                        optionYear
                                    }
                                </option>
                            )
                        )}
                    </select>

                </div>

            </div>


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            {loading ? (

                <div className="content-loading">
                    <div className="loading-spinner" />

                    <span>
                        Loading balances...
                    </span>
                </div>

            ) : balances.length === 0 ? (

                <div className="panel empty-state">
                    <WalletCards size={34} />

                    <h3>
                        No leave balances found
                    </h3>

                    <p>
                        No leave balances are available
                        for {year}.
                    </p>
                </div>

            ) : (

                <div className="balance-grid">

                    {balances.map(
                        (balance) => {
                            const total =
                                Number(
                                    balance
                                        .entitlement_days
                                )
                                +
                                Number(
                                    balance
                                        .carried_forward_days
                                )
                                +
                                Number(
                                    balance
                                        .adjustment_days
                                );

                            const available =
                                Number(
                                    balance
                                        .available_days
                                );

                            const percentage =
                                total > 0
                                    ? Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            (
                                                available
                                                /
                                                total
                                            )
                                            * 100
                                        )
                                    )
                                    : 0;

                            return (
                                <section
                                    className="balance-card"
                                    key={
                                        balance.id
                                    }
                                >

                                    <div className="balance-card-header">

                                        <div>
                                            <span className="balance-code">
                                                {
                                                    balance
                                                        .leave_type
                                                        ?.code
                                                }
                                            </span>

                                            <h2>
                                                {
                                                    balance
                                                        .leave_type
                                                        ?.name
                                                }
                                            </h2>
                                        </div>

                                        <div className="balance-available">
                                            <strong>
                                                {
                                                    balance
                                                        .available_days
                                                }
                                            </strong>

                                            <span>
                                                days available
                                            </span>
                                        </div>

                                    </div>


                                    <div className="balance-progress">
                                        <div
                                            style={{
                                                width:
                                                    `${percentage}%`,
                                            }}
                                        />
                                    </div>


                                    <div className="balance-metrics">

                                        <div>
                                            <span>
                                                Entitlement
                                            </span>

                                            <strong>
                                                {
                                                    balance
                                                        .entitlement_days
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Carried
                                            </span>

                                            <strong>
                                                {
                                                    balance
                                                        .carried_forward_days
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Used
                                            </span>

                                            <strong>
                                                {
                                                    balance
                                                        .used_days
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Pending
                                            </span>

                                            <strong>
                                                {
                                                    balance
                                                        .pending_days
                                                }
                                            </strong>
                                        </div>

                                    </div>

                                </section>
                            );
                        }
                    )}

                </div>

            )}

        </div>
    );
}

export default LeaveBalances;