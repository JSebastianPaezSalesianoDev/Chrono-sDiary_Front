import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import EventsService from "../../service/event.service";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setErrorMessage(null);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    try {
      await EventsService.aAuthLogin(username, password);

      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
         throw new Error("Authentication information missing after login.");
      }

      const userDetailsResponse = await EventsService.aGetUserById(token, userId);

      const userData = userDetailsResponse.data;

      let isAdmin = false;
      if (userData && userData.roles && Array.isArray(userData.roles)) {
         isAdmin = userData.roles.some(role => role.name === "ADMIN");
      }

      if (isAdmin) {
        navigate("/AllUserEvents");
      } else {
        navigate("/calendar");
      }

    } catch (error: any) {
      console.error("Login or user data fetch failed:", error);
      setErrorMessage(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Iniciar Sesión</h1>

      <form className="login-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            placeholder="Introduce tu usuario"
            value={username}
            onChange={handleUsernameChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={handlePasswordChange}
            disabled={loading}
          />
        </div>

        {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{errorMessage}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
          </button>
        </div>

        <div className="forgot-password-link">
           <p><a href="/ForgotPassword">¿Olvidaste tu contraseña?</a></p>
        </div>

        <div className="signup-link">
          <p>
            ¿No tienes una cuenta? <a href="/Register">Registrarse</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;