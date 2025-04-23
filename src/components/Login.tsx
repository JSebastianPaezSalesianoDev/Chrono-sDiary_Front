import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => { 
    console.log("Login with:", username, password);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Chrono's Diary</h1>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
        </div>
        <div className="signup-link">
          <p>
            Don’t have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
