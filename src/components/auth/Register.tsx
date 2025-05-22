import React, { useState } from "react";
import "./Login.css"; 
import { useNavigate } from "react-router-dom";
import EventsService from "../../service/event.service";
const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>(""); 
  const [isError, setIsError] = useState<boolean>(false); 
   const navigate = useNavigate()

const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        setMessage(""); 
        setIsError(false);

        if (!username || !email || !password) {
            setMessage("All fields are required.");
            setIsError(true);
            return;
        }

        try {
            const data = await EventsService.aRegisterUser({ username, email, password });

            setMessage(data.message || "User registered successfully!");
            setIsError(false);
            setUsername("");
            setEmail("");
            setPassword("");

            navigate("/"); 

        } catch (error: any) {
            // Manejo de errores específicos
            if (error?.message?.toLowerCase().includes("username") && error?.message?.toLowerCase().includes("exist")) {
                setMessage("El usuario ya existe. Por favor, elige otro nombre de usuario.");
            } else if (error?.message?.toLowerCase().includes("email") && error?.message?.toLowerCase().includes("exist")) {
                setMessage("El correo electrónico ya está registrado.");
            } else if (error?.message?.toLowerCase().includes("password")) {
                setMessage("La contraseña no cumple con los requisitos.");
            } else {
                setMessage(error.message || "Registration failed.");
            }
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
            id="usernameRegister"
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
            id="passwordRegister"
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
            Do you have an account? <a onClick={()=>  navigate("/") }>Log in</a> 
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;