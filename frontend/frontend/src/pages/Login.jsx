// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../api/api";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setError("");

//     if (!email || !password) {
//       setError("Please enter email and password");
//       return;
//     }

//     try {
//       const data = await login(email, password);

//       localStorage.setItem("token", data.access_token);

//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h1>Smart Task</h1>
//         <h1>Management</h1>

//         <p className="subtitle">FastAPI + React</p>

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

//         <div className="auth-buttons">
//           <button onClick={() => navigate("/register")}>
//             Register
//           </button>

//           <button onClick={handleLogin}>
//             Login
//           </button>
//         </div>

//         {error && <p className="error">{error}</p>}
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const data = await login(
        email.trim(),
        password
      );

      localStorage.setItem(
        "token",
        data.access_token
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Invalid email or password"
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
            Organize your projects,
            <br />
            manage your tasks,
            <br />
            and get things done.
          </p>

          <div className="brand-features">

            <div>
              <span>✓</span>
              Manage projects easily
            </div>

            <div>
              <span>✓</span>
              Track task progress
            </div>

            <div>
              <span>✓</span>
              Stay organized
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-section">

        <div className="auth-box">

          <div className="mobile-logo">
            M
          </div>

          <div className="auth-heading">

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your
              dashboard
            </p>

          </div>

          <form onSubmit={handleLogin}>

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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
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

            </div>

            {/* ERROR */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* LOGIN */}

            <button
              type="submit"
              className="primary-auth-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

          {/* REGISTER */}

          <div className="auth-footer">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create account
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

export default Login;