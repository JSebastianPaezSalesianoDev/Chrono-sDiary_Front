import React, { useState } from "react";
import "./Login.css"; 
const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>(""); 
  const [isError, setIsError] = useState<boolean>(false); 

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setMessage(""); 
    setIsError(false);

    if (!username || !email || !password) {
      setMessage("All fields are required.");
      setIsError(true);
      return;
    }

    const userRequestDto = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8081/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequestDto),
      });

      const data = await response.json(); 

      if (response.ok) {
        setMessage(data.message || "User registered successfully!"); 
        setIsError(false);
        setUsername("");
        setEmail("");
        setPassword("");
        // window.location.href = '/login'; // redirige al login
      } else {

        let errorMessage = "Registration failed.";
        if (data && data.message) {
            errorMessage = data.message;
        } else if (data && data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map((err: any) => err.defaultMessage || err.msg).join(", ");
        } else if (data && data.error) {
            errorMessage = data.error;
        }
        setMessage(errorMessage);
        setIsError(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Chrono's Diary</h1>
      <form className="login-form" onSubmit={handleRegister}>
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> 
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">
            Sign up 
          </button>
          {/* <a href="#" className="forgot-password">
            Forgot Password?
          </a> */}
        </div>
        <div className="signup-link">
          <p>
            Do you have an account? <a href="/login">Log in</a> 
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;