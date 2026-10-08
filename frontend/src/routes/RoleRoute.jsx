import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RoleRoute({ allowedRoles }) {
    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return (
            <div className="page-loading">
                Loading...
            </div>
        );
    }

    const role = user?.role?.name;

    if (!allowedRoles.includes(role)) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return <Outlet />;
}

export default RoleRoute;