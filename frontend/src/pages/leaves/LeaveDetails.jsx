import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    FileText,
    UserRoundCheck,
    XCircle,
} from "lucide-react";

import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import StatusBadge from "../../components/common/StatusBadge";

import {
    cancelLeaveRequest,
    getLeaveRequest,
} from "../../services/leaveService";

import {
    formatDate,
    formatDateTime,
} from "../../utils/dateUtils";


function LeaveDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const location = useLocation();

    const [request, setRequest] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState(
            location.state?.message || ""
        );

    const [showCancel, setShowCancel] =
        useState(false);

    const [
        cancellationReason,
        setCancellationReason,
    ] = useState("");

    const [cancelling, setCancelling] =
        useState(false);


    const loadRequest = async () => {
        setLoading(true);

        try {
            const response =
                await getLeaveRequest(id);

            setRequest(
                response.data ?? response
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load this leave request."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadRequest();
    }, [id]);


    const handleCancel = async () => {
        setCancelling(true);
        setError("");

        try {
            const response =
                await cancelLeaveRequest(
                    id,
                    cancellationReason
                );

            setRequest(
                response.data
            );

            setMessage(
                response.message
            );

            setShowCancel(false);
            setCancellationReason("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to cancel the leave request."
            );
        } finally {
            setCancelling(false);
        }
    };


    if (loading) {
        return (
            <div className="content-loading">
                <div className="loading-spinner" />

                <span>
                    Loading request...
                </span>
            </div>
        );
    }


    if (!request) {
        return (
            <div className="empty-state">
                <h3>
                    Leave request unavailable
                </h3>

                <Link
                    to="/leaves"
                    className="text-link"
                >
                    Return to requests
                </Link>
            </div>
        );
    }


    return (
        <div className="leave-page">

            <div className="page-header">

                <div>

                    <Link
                        to="/leaves"
                        className="back-link"
                    >
                        <ArrowLeft size={16} />

                        My Leave Requests
                    </Link>

                    <span className="eyebrow">
                        Request #{request.id}
                    </span>

                    <h1>
                        {
                            request.leave_type
                                ?.name
                        }
                    </h1>

                    <p>
                        Review the details and approval
                        progress of this request.
                    </p>

                </div>


                <StatusBadge
                    status={request.status}
                />

            </div>


            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            <div className="details-page-grid">

                <section className="panel">

                    <div className="panel-header">
                        <div>
                            <h2>
                                Leave details
                            </h2>

                            <p>
                                Submitted leave
                                information.
                            </p>
                        </div>

                        <FileText size={21} />
                    </div>


                    <div className="request-detail-grid">

                        <div className="request-detail-item">

                            <span>
                                Leave type
                            </span>

                            <strong>
                                {
                                    request
                                        .leave_type
                                        ?.name
                                }
                            </strong>

                        </div>


                        <div className="request-detail-item">

                            <span>
                                Total days
                            </span>

                            <strong>
                                {
                                    request
                                        .total_days
                                }
                            </strong>

                        </div>


                        <div className="request-detail-item">

                            <span>
                                Start date
                            </span>

                            <strong>
                                {
                                    formatDate(
                                        request.start_date
                                    )
                                }
                            </strong>

                        </div>


                        <div className="request-detail-item">

                            <span>
                                End date
                            </span>

                            <strong>
                                {
                                    formatDate(
                                        request.end_date
                                    )
                                }
                            </strong>

                        </div>


                        <div className="request-detail-item">

                            <span>
                                Submitted
                            </span>

                            <strong>
                                {
                                    formatDateTime(
                                        request.submitted_at
                                    )
                                }
                            </strong>

                        </div>


                        <div className="request-detail-item">

                            <span>
                                Status
                            </span>

                            <StatusBadge
                                status={
                                    request.status
                                }
                            />

                        </div>

                    </div>


                    <div className="reason-box">

                        <span>
                            Reason
                        </span>

                        <p>
                            {request.reason}
                        </p>

                    </div>


                    {request.cancellation_reason && (
                        <div className="reason-box cancellation-box">

                            <span>
                                Cancellation reason
                            </span>

                            <p>
                                {
                                    request
                                        .cancellation_reason
                                }
                            </p>

                        </div>
                    )}

                </section>


                <aside className="details-sidebar">

                    <section className="panel">

                        <div className="summary-heading">
                            <UserRoundCheck
                                size={20}
                            />

                            <h3>
                                Approval progress
                            </h3>
                        </div>


                        {request.approvals?.length
                            ? (
                                <div className="approval-timeline">

                                    {
                                        request
                                            .approvals
                                            .map(
                                                (
                                                    approval
                                                ) => (
                                                    <div
                                                        className="approval-step"
                                                        key={
                                                            approval.id
                                                        }
                                                    >
                                                        <div className="approval-marker">
                                                            {
                                                                approval
                                                                    .level
                                                            }
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    approval
                                                                        .approver ||
                                                                    "Approver"
                                                                }
                                                            </strong>

                                                            <StatusBadge
                                                                status={
                                                                    approval
                                                                        .status
                                                                }
                                                            />

                                                            {
                                                                approval
                                                                    .acted_at && (
                                                                    <small>
                                                                        {
                                                                            formatDateTime(
                                                                                approval
                                                                                    .acted_at
                                                                            )
                                                                        }
                                                                    </small>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            )
                                    }

                                </div>
                            )
                            : (
                                <div className="mini-empty">
                                    No approval steps
                                    available.
                                </div>
                            )
                        }

                    </section>


                    {request.can_cancel && (
                        <section className="panel danger-panel">

                            <div className="summary-heading">
                                <XCircle size={20} />

                                <h3>
                                    Cancel request
                                </h3>
                            </div>

                            <p>
                                A pending leave request
                                can be cancelled before
                                it is approved.
                            </p>

                            {!showCancel ? (
                                <button
                                    className="button button-danger-outline"
                                    onClick={() =>
                                        setShowCancel(
                                            true
                                        )
                                    }
                                >
                                    Cancel Leave Request
                                </button>
                            ) : (
                                <div className="cancel-form">

                                    <textarea
                                        value={
                                            cancellationReason
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCancellationReason(
                                                event.target
                                                    .value
                                            )
                                        }
                                        placeholder="Optional cancellation reason..."
                                        rows={4}
                                    />

                                    <div className="cancel-actions">

                                        <button
                                            className="button button-secondary"
                                            onClick={() =>
                                                setShowCancel(
                                                    false
                                                )
                                            }
                                            disabled={
                                                cancelling
                                            }
                                        >
                                            Keep Request
                                        </button>

                                        <button
                                            className="button button-danger"
                                            onClick={
                                                handleCancel
                                            }
                                            disabled={
                                                cancelling
                                            }
                                        >
                                            {
                                                cancelling
                                                    ? "Cancelling..."
                                                    : "Confirm Cancellation"
                                            }
                                        </button>

                                    </div>

                                </div>
                            )}

                        </section>
                    )}

                </aside>

            </div>

        </div>
    );
}

export default LeaveDetails;