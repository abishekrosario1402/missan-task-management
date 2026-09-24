// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { register } from "../api/api";

// function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     setError("");

//     try {
//       await register(email, password);

//       navigate("/login");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">

//         <h1>Smart Task</h1>
//         <h1>Management</h1>

//         <p className="subtitle">Create Account</p>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button onClick={handleRegister}>
//           Register
//         </button>

//         <button
//           className="secondary-button"
//           onClick={() => navigate("/login")}
//         >
//           Back to Login
//         </button>

//         {error && <p className="error">{error}</p>}

//       </div>
//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await register(
        email.trim(),
        password
      );

      navigate("/login");
    } catch (err) {
      setError(
        err.message ||
          "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}

      <div className="auth-brand">

        <div className="brand-content">

          <div className="brand-logo">
            M
          </div>

          <h1>
            Smart Task
            <br />
            Management
          </h1>

          <p>
            Create your workspace,
            <br />
            organize your projects,
            <br />
            and manage your tasks.
          </p>

          <div className="brand-features">

            <div>
              <span>✓</span>
              Create unlimited projects
            </div>

            <div>
              <span>✓</span>
              Manage tasks and status
            </div>

            <div>
              <span>✓</span>
              Track your progress
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-section">

        <div className="auth-box register-box">

          <div className="mobile-logo">
            M
          </div>

          <div className="auth-heading">

            <h2>Create your account</h2>

            <p>
              Get started with Smart Task
              Management
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* EMAIL */}

            <div className="form-group">

              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <small>
                Use at least 6 characters
              </small>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                Confirm password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* REGISTER */}

            <button
              type="submit"
              className="primary-auth-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* LOGIN */}

          <div className="auth-footer">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
            </button>

          </div>

          <div className="auth-tech">
            React · FastAPI · PostgreSQL
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;