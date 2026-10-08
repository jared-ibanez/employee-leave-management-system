import { useState } from "react";

import {
    Navigate,
    useNavigate,
} from "react-router-dom";

import {
    ArrowRight,
    CalendarCheck2,
    CheckCircle2,
    Clock3,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Brand from "../../components/common/Brand";

function Login() {
    const navigate = useNavigate();

    const {
        login,
        isAuthenticated,
        loading,
    } = useAuth();

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");

    const [submitting, setSubmitting] =
        useState(false);

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loading-spinner" />

                <span>
                    Preparing your workspace...
                </span>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setCredentials((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await login(credentials);

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            const message =
                error.response?.data?.errors?.email?.[0] ||
                error.response?.data?.message ||
                "Unable to sign in. Please check your credentials.";

            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">

            <section className="auth-visual">

                <div className="auth-brand">
                    <Brand light />
                </div>

                <div className="auth-visual-content">
                    <span className="eyebrow">
                        Simple. Clear. Organized.
                    </span>

                    <h1>
                        Leave management
                        without the paperwork.
                    </h1>

                    <p>
                        Submit requests, track balances,
                        manage approvals, and keep your
                        team informed from one workspace.
                    </p>

                    <div className="auth-feature-list">

                        <div className="auth-feature">
                            <CheckCircle2 />

                            <div>
                                <strong>
                                    Simple approvals
                                </strong>

                                <span>
                                    Clear request and
                                    approval workflows.
                                </span>
                            </div>
                        </div>

                        <div className="auth-feature">
                            <Clock3 />

                            <div>
                                <strong>
                                    Real-time tracking
                                </strong>

                                <span>
                                    Know the status of every
                                    leave request.
                                </span>
                            </div>
                        </div>

                        <div className="auth-feature">
                            <ShieldCheck />

                            <div>
                                <strong>
                                    Secure access
                                </strong>

                                <span>
                                    Role-based access for
                                    employees and managers.
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="login-illustration">

                    <div className="illustration-orbit" />

                    <div className="illustration-main">
                        <CalendarCheck2 size={46} />
                    </div>

                    <div className="illustration-card illustration-approved">
                        <CheckCircle2 size={18} />

                        <div>
                            <small>Request status</small>
                            <strong>Approved</strong>
                        </div>
                    </div>

                    <div className="illustration-card illustration-balance">
                        <span>12</span>

                        <div>
                            <small>Vacation leave</small>
                            <strong>Days available</strong>
                        </div>
                    </div>

                </div>

            </section>


            <section className="auth-form-panel">

                <div className="auth-form-container">

                    <div className="mobile-brand">
                        <Brand />
                    </div>

                    <div className="auth-form-heading">
                        <span className="eyebrow">
                            Welcome back
                        </span>

                        <h2>Sign in to your account</h2>

                        <p>
                            Enter your account credentials
                            to continue.
                        </p>
                    </div>

                    {error && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="input-control">
                                <Mail
                                    size={18}
                                    className="input-icon"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    autoFocus
                                />
                            </div>

                        </div>


                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-control">

                                <LockKeyhole
                                    size={18}
                                    className="input-icon"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>


                        <button
                            className="button button-primary login-submit"
                            type="submit"
                            disabled={submitting}
                        >
                            <span>
                                {submitting
                                    ? "Signing in..."
                                    : "Sign in"}
                            </span>

                            {!submitting && (
                                <ArrowRight size={18} />
                            )}
                        </button>

                    </form>

                    <div className="auth-security-note">
                        <ShieldCheck size={16} />

                        <span>
                            Your session is protected using
                            secure authentication.
                        </span>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;