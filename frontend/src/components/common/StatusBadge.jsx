function StatusBadge({ status }) {
    const normalized =
        status?.toLowerCase() || "unknown";

    const labels = {
        draft: "Draft",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        cancelled: "Cancelled",
    };

    return (
        <span
            className={
                `status-badge ` +
                `status-${normalized}`
            }
        >
            <span className="status-badge-dot" />

            {labels[normalized] ?? status}
        </span>
    );
}

export default StatusBadge;