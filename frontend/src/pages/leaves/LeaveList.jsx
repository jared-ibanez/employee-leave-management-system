import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    FilePlus2,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import StatusBadge from "../../components/common/StatusBadge";

import {
    getLeaveRequests,
} from "../../services/leaveService";

import {
    formatDate,
} from "../../utils/dateUtils";


function LeaveList() {
    const currentYear =
        new Date().getFullYear();

    const [requests, setRequests] =
        useState([]);

    const [meta, setMeta] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [filters, setFilters] =
        useState({
            status: "",
            year: currentYear,
            page: 1,
        });


    const loadRequests = async () => {
        setLoading(true);
        setError("");

        try {
            const params = {
                page: filters.page,
            };

            if (filters.status) {
                params.status =
                    filters.status;
            }

            if (filters.year) {
                params.year =
                    filters.year;
            }

            const response =
                await getLeaveRequests(
                    params
                );

            setRequests(
                response.data ?? []
            );

            setMeta(
                response.meta ?? null
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load leave requests."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadRequests();
    }, [
        filters.status,
        filters.year,
        filters.page,
    ]);


    const handleFilterChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
            page: 1,
        }));
    };


    return (
        <div className="leave-page">

            <div className="page-header">

                <div>
                    <span className="eyebrow">
                        Leave Management
                    </span>

                    <h1>
                        My Leave Requests
                    </h1>

                    <p>
                        Track your submitted leave
                        requests and their current
                        approval status.
                    </p>
                </div>

                <Link
                    to="/leaves/create"
                    className="button button-primary"
                >
                    <FilePlus2 size={18} />

                    Apply for Leave
                </Link>

            </div>


            <div className="filter-bar">

                <div className="filter-group">
                    <label>
                        Status
                    </label>

                    <select
                        name="status"
                        value={filters.status}
                        onChange={
                            handleFilterChange
                        }
                    >
                        <option value="">
                            All statuses
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="approved">
                            Approved
                        </option>

                        <option value="rejected">
                            Rejected
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>
                </div>


                <div className="filter-group">
                    <label>
                        Year
                    </label>

                    <select
                        name="year"
                        value={filters.year}
                        onChange={
                            handleFilterChange
                        }
                    >
                        {[
                            currentYear,
                            currentYear - 1,
                            currentYear - 2,
                        ].map((year) => (
                            <option
                                value={year}
                                key={year}
                            >
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

            </div>


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            <section className="panel leave-list-panel">

                {loading ? (
                    <div className="content-loading">
                        <div className="loading-spinner" />

                        <span>
                            Loading leave requests...
                        </span>
                    </div>
                ) : requests.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            <CalendarDays
                                size={30}
                            />
                        </div>

                        <h3>
                            No leave requests found
                        </h3>

                        <p>
                            You don't have leave
                            requests matching these
                            filters.
                        </p>

                        <Link
                            to="/leaves/create"
                            className="button button-primary"
                        >
                            <FilePlus2 size={17} />

                            Create Leave Request
                        </Link>

                    </div>

                ) : (

                    <>
                        <div className="table-wrapper">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>
                                            Leave Type
                                        </th>

                                        <th>
                                            Dates
                                        </th>

                                        <th>
                                            Days
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Submitted
                                        </th>

                                        <th />
                                    </tr>
                                </thead>

                                <tbody>

                                    {requests.map(
                                        (request) => (
                                            <tr key={request.id}>

                                                <td>
                                                    <div className="table-primary">
                                                        {
                                                            request
                                                                .leave_type
                                                                ?.name
                                                        }
                                                    </div>

                                                    <div className="table-secondary">
                                                        {
                                                            request
                                                                .leave_type
                                                                ?.code
                                                        }
                                                    </div>
                                                </td>


                                                <td>
                                                    <div className="leave-date-range">
                                                        {
                                                            formatDate(
                                                                request.start_date
                                                            )
                                                        }

                                                        <span>
                                                            →
                                                        </span>

                                                        {
                                                            formatDate(
                                                                request.end_date
                                                            )
                                                        }
                                                    </div>
                                                </td>


                                                <td>
                                                    <strong>
                                                        {
                                                            request
                                                                .total_days
                                                        }
                                                    </strong>
                                                </td>


                                                <td>
                                                    <StatusBadge
                                                        status={
                                                            request.status
                                                        }
                                                    />
                                                </td>


                                                <td>
                                                    {
                                                        request
                                                            .submitted_at
                                                            ? new Date(
                                                                request.submitted_at
                                                            ).toLocaleDateString()
                                                            : "—"
                                                    }
                                                </td>


                                                <td className="table-action">
                                                    <Link
                                                        to={
                                                            `/leaves/${request.id}`
                                                        }
                                                        className="text-link"
                                                    >
                                                        View
                                                    </Link>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {meta && (
                            <div className="pagination">

                                <span>
                                    Page{" "}
                                    {meta.current_page}
                                    {" "}of{" "}
                                    {meta.last_page}
                                </span>

                                <div className="pagination-buttons">

                                    <button
                                        className="pagination-button"
                                        disabled={
                                            meta.current_page
                                            <= 1
                                        }
                                        onClick={() =>
                                            setFilters(
                                                (
                                                    previous
                                                ) => ({
                                                    ...previous,
                                                    page:
                                                        previous.page
                                                        - 1,
                                                })
                                            )
                                        }
                                    >
                                        <ChevronLeft
                                            size={17}
                                        />
                                    </button>

                                    <button
                                        className="pagination-button"
                                        disabled={
                                            meta.current_page
                                            >= meta.last_page
                                        }
                                        onClick={() =>
                                            setFilters(
                                                (
                                                    previous
                                                ) => ({
                                                    ...previous,
                                                    page:
                                                        previous.page
                                                        + 1,
                                                })
                                            )
                                        }
                                    >
                                        <ChevronRight
                                            size={17}
                                        />
                                    </button>

                                </div>

                            </div>
                        )}

                    </>

                )}

            </section>

        </div>
    );
}

export default LeaveList;