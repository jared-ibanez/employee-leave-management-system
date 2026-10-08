import {
    createContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
    |--------------------------------------------------------------------------
    | Restore authenticated user when the application loads
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const data = await getCurrentUser();

                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const login = async (credentials) => {
        const data = await loginRequest(credentials);

        setUser(data.user);

        return data;
    };

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Refresh Current User
    |--------------------------------------------------------------------------
    */

    const refreshUser = async () => {
        const data = await getCurrentUser();

        setUser(data.user);

        return data.user;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
                isAuthenticated: Boolean(user),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}