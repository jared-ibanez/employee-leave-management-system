import api from "../api/axios";

const getCsrfCookie = async () => {
    await api.get("/sanctum/csrf-cookie");
};

export const login = async (credentials) => {
    await getCsrfCookie();

    const response = await api.post(
        "/api/login",
        credentials
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/api/me");

    return response.data;
};

export const logout = async () => {
    const response = await api.post("/api/logout");

    return response.data;
};