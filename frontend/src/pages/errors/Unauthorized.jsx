import {
    Link,
} from "react-router-dom";

function Unauthorized() {
    return (
        <div className="error-page">
            <h1>403</h1>

            <h2>Unauthorized</h2>

            <p>
                You do not have permission to access
                this page.
            </p>

            <Link to="/dashboard">
                Return to Dashboard
            </Link>
        </div>
    );
}

export default Unauthorized;