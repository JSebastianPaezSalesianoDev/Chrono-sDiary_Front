import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import EventsService from "../../service/event.service";

// Componente de registro de usuario
const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  // Envía el formulario de registro
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (!username || !email || !password) {
      setMessage("Todos los campos son requeridos.");
      setIsError(true);
      return;
    }

    try {
      const data = await EventsService.aRegisterUser({ username, email, password });

      setMessage(data.message || "Usuario registrado exitosamente!");
      setIsError(false);
      setUsername("");
      setEmail("");
      setPassword("");

      
      setTimeout(() => {
        navigate("/");
     }, 1500);
 

    } catch (error: any) {
      setIsError(true); 

      if (error.response && error.response.status === 401) {
        setMessage("El correo electrónico ya existe. Por favor, intenta con otro.");
      } else {
       
        const errorMessage = error.response?.data?.message || 
                             error.message ||                 
                             "Error en el registro. Por favor, inténtalo de nuevo.";
        setMessage(errorMessage);
      }
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
          <label htmlFor="usernameRegister">Username</label> 
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
          <label htmlFor="passwordRegister">Password</label> 
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
        </div>
        <div className="signup-link">
          <p>
            ¿Ya tienes una cuenta? <a onClick={() => navigate("/")}>Inicia sesión</a> 
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;