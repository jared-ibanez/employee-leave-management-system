import { CalendarCheck2 } from "lucide-react";

function Brand({ light = false }) {
    return (
        <div className={`brand ${light ? "brand-light" : ""}`}>
            <div className="brand-mark">
                <CalendarCheck2 size={22} strokeWidth={2.2} />
            </div>

            <div className="brand-copy">
                <strong>LeaveFlow</strong>
                <span>Employee Leave Management</span>
            </div>
        </div>
    );
}

export default Brand;