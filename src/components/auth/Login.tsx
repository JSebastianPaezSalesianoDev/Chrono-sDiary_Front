import React, { useState } from "react";
import "./Login.css";
import EventsService from "../../service/event.service";
import { useNavigate } from "react-router-dom";
import Calendar from "../calendar/Calendar";


const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate()
  

  const handleLogin = async () => {
    try {
      const { accessToken } = await EventsService.aAuthLogin(username, password);
      
  
      if (accessToken) {
        localStorage.setItem("authToken", accessToken);
        navigate("/calendar"); 
        console.log("Token de acceso guardado:", accessToken);
      } else {
        alert("Error en autenticación");
        console.log("token:", accessToken);
      }
    } catch (error) {
      alert("Credenciales incorrectas");
    }
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
            required
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
            Don’t have an account? <a onClick={()=> navigate("/Register")}>Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
