import api from "../api/axios";

/*
|--------------------------------------------------------------------------
| Leave Types
|--------------------------------------------------------------------------
*/

export const getLeaveTypes = async () => {
    const response = await api.get("/api/leave-types");

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Leave Balances
|--------------------------------------------------------------------------
*/

export const getLeaveBalances = async (year = null) => {
    const params = {};

    if (year) {
        params.year = year;
    }

    const response = await api.get(
        "/api/leave-balances",
        {
            params,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Leave Requests
|--------------------------------------------------------------------------
*/

export const getLeaveRequests = async (
    filters = {}
) => {
    const response = await api.get(
        "/api/leave-requests",
        {
            params: filters,
        }
    );

    return response.data;
};


export const getLeaveRequest = async (id) => {
    const response = await api.get(
        `/api/leave-requests/${id}`
    );

    return response.data;
};


export const createLeaveRequest = async (
    data
) => {
    const response = await api.post(
        "/api/leave-requests",
        data
    );

    return response.data;
};


export const cancelLeaveRequest = async (
    id,
    cancellationReason = ""
) => {
    const response = await api.post(
        `/api/leave-requests/${id}/cancel`,
        {
            cancellation_reason:
                cancellationReason || null,
        }
    );

    return response.data;
};