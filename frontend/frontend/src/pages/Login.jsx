import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.access_token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Smart Task</h1>
        <h1>Management</h1>

        <p className="subtitle">FastAPI + React</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="auth-buttons">
          <button onClick={() => navigate("/register")}>
            Register
          </button>

          <button onClick={handleLogin}>
            Login
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;