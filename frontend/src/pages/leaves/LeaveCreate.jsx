import {
    ArrowLeft,
    CalendarDays,
    FileText,
    Info,
    Send,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    createLeaveRequest,
    getLeaveBalances,
    getLeaveTypes,
} from "../../services/leaveService";

import {
    calculateWeekdays,
} from "../../utils/dateUtils";


function LeaveCreate() {
    const navigate = useNavigate();

    const [leaveTypes, setLeaveTypes] =
        useState([]);

    const [balances, setBalances] =
        useState([]);

    const [loadingData, setLoadingData] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [fieldErrors, setFieldErrors] =
        useState({});

    const [form, setForm] =
        useState({
            leave_type_id: "",
            start_date: "",
            end_date: "",
            reason: "",
        });


    useEffect(() => {
        const loadReferenceData =
            async () => {
                try {
                    const [
                        typesResponse,
                        balancesResponse,
                    ] = await Promise.all([
                        getLeaveTypes(),
                        getLeaveBalances(),
                    ]);

                    setLeaveTypes(
                        typesResponse.data ?? []
                    );

                    setBalances(
                        balancesResponse.data ?? []
                    );
                } catch (error) {
                    setError(
                        error.response?.data?.message ||
                        "Unable to load leave information."
                    );
                } finally {
                    setLoadingData(false);
                }
            };

        loadReferenceData();
    }, []);


    const estimatedDays = useMemo(
        () =>
            calculateWeekdays(
                form.start_date,
                form.end_date
            ),
        [
            form.start_date,
            form.end_date,
        ]
    );


    const selectedBalance = useMemo(
        () =>
            balances.find(
                (balance) =>
                    String(
                        balance.leave_type?.id
                    )
                    ===
                    String(
                        form.leave_type_id
                    )
            ),
        [
            balances,
            form.leave_type_id,
        ]
    );


    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: null,
        }));
    };


    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setSubmitting(true);
        setError("");
        setFieldErrors({});

        try {
            const response =
                await createLeaveRequest({
                    leave_type_id:
                        Number(
                            form.leave_type_id
                        ),

                    start_date:
                        form.start_date,

                    end_date:
                        form.end_date,

                    reason:
                        form.reason,
                });

            navigate(
                `/leaves/${response.data.id}`,
                {
                    replace: true,
                    state: {
                        message:
                            response.message,
                    },
                }
            );
        } catch (error) {
            if (
                error.response?.status
                === 422
            ) {
                setFieldErrors(
                    error.response?.data
                        ?.errors ?? {}
                );
            }

            setError(
                error.response?.data?.message ||
                "Unable to submit the leave request."
            );
        } finally {
            setSubmitting(false);
        }
    };


    if (loadingData) {
        return (
            <div className="content-loading">
                <div className="loading-spinner" />

                <span>
                    Loading leave information...
                </span>
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
                        Leave Management
                    </span>

                    <h1>
                        Apply for Leave
                    </h1>

                    <p>
                        Complete the form below to
                        submit a leave request.
                    </p>

                </div>

            </div>


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            <div className="form-page-grid">

                <section className="panel">

                    <div className="panel-header">
                        <div>
                            <h2>
                                Leave request
                            </h2>

                            <p>
                                Provide the details of
                                your requested leave.
                            </p>
                        </div>

                        <FileText size={21} />
                    </div>


                    <form
                        className="leave-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-field">

                            <label htmlFor="leave_type_id">
                                Leave type
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <select
                                id="leave_type_id"
                                name="leave_type_id"
                                value={
                                    form.leave_type_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >
                                <option value="">
                                    Select leave type
                                </option>

                                {leaveTypes.map(
                                    (type) => (
                                        <option
                                            value={
                                                type.id
                                            }
                                            key={
                                                type.id
                                            }
                                        >
                                            {
                                                type.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {fieldErrors
                                .leave_type_id && (
                                <span className="field-error">
                                    {
                                        fieldErrors
                                            .leave_type_id[0]
                                    }
                                </span>
                            )}

                        </div>


                        <div className="form-row">

                            <div className="form-field">

                                <label htmlFor="start_date">
                                    Start date
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    value={
                                        form.start_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                {fieldErrors
                                    .start_date && (
                                    <span className="field-error">
                                        {
                                            fieldErrors
                                                .start_date[0]
                                        }
                                    </span>
                                )}

                            </div>


                            <div className="form-field">

                                <label htmlFor="end_date">
                                    End date
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    value={
                                        form.end_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min={
                                        form.start_date ||
                                        undefined
                                    }
                                    required
                                />

                                {fieldErrors
                                    .end_date && (
                                    <span className="field-error">
                                        {
                                            fieldErrors
                                                .end_date[0]
                                        }
                                    </span>
                                )}

                            </div>

                        </div>


                        <div className="form-field">

                            <label htmlFor="reason">
                                Reason
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <textarea
                                id="reason"
                                name="reason"
                                value={
                                    form.reason
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Briefly explain the reason for your leave request..."
                                rows={6}
                                maxLength={2000}
                                required
                            />

                            <div className="field-footer">

                                {fieldErrors.reason ? (
                                    <span className="field-error">
                                        {
                                            fieldErrors
                                                .reason[0]
                                        }
                                    </span>
                                ) : (
                                    <span>
                                        Minimum 10
                                        characters
                                    </span>
                                )}

                                <span>
                                    {
                                        form.reason
                                            .length
                                    }
                                    /2000
                                </span>

                            </div>

                        </div>


                        <div className="form-actions">

                            <Link
                                to="/leaves"
                                className="button button-secondary"
                            >
                                Cancel
                            </Link>

                            <button
                                className="button button-primary"
                                type="submit"
                                disabled={
                                    submitting
                                }
                            >
                                <Send size={17} />

                                {
                                    submitting
                                        ? "Submitting..."
                                        : "Submit Request"
                                }
                            </button>

                        </div>

                    </form>

                </section>


                <aside className="leave-summary">

                    <section className="panel">

                        <div className="summary-heading">
                            <CalendarDays
                                size={20}
                            />

                            <h3>
                                Request summary
                            </h3>
                        </div>


                        <div className="summary-row">
                            <span>
                                Estimated days
                            </span>

                            <strong>
                                {estimatedDays}
                            </strong>
                        </div>


                        <div className="summary-row">
                            <span>
                                Available balance
                            </span>

                            <strong>
                                {
                                    selectedBalance
                                        ? `${selectedBalance.available_days} days`
                                        : "—"
                                }
                            </strong>
                        </div>


                        {selectedBalance && (
                            <>
                                <div className="summary-row">
                                    <span>
                                        Pending
                                    </span>

                                    <strong>
                                        {
                                            selectedBalance
                                                .pending_days
                                        }
                                        {" "}days
                                    </strong>
                                </div>

                                <div className="summary-row">
                                    <span>
                                        Used
                                    </span>

                                    <strong>
                                        {
                                            selectedBalance
                                                .used_days
                                        }
                                        {" "}days
                                    </strong>
                                </div>
                            </>
                        )}

                    </section>


                    <div className="info-callout">

                        <Info size={18} />

                        <p>
                            The displayed total is an
                            estimate based on weekdays.
                            Laravel will calculate and
                            validate the official number
                            of leave days when the
                            request is submitted.
                        </p>

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default LeaveCreate;