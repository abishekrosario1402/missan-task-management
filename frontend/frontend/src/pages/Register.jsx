import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    try {
      await register(email, password);

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Smart Task</h1>
        <h1>Management</h1>

        <p className="subtitle">Create Account</p>

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

        <button onClick={handleRegister}>
          Register
        </button>

        <button
          className="secondary-button"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>

        {error && <p className="error">{error}</p>}

      </div>
    </div>
  );
}

export default Register;