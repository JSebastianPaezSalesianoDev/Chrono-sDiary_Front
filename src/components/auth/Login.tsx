import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import EventsService from "../../service/event.service";

// Componente de inicio de sesión
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Maneja el cambio de usuario
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setErrorMessage(null);
  };

  // Maneja el cambio de contraseña
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrorMessage(null);
  };

  // Envía el formulario de login
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await EventsService.aAuthLogin(username, password);
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
         throw new Error("Falta información de autenticación después del inicio de sesión.");
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
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
        } else if (error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(`Error del servidor: ${error.response.status}. Inténtalo más tarde.`);
        }
      } else if (error.request) {
        setErrorMessage("No se pudo conectar con el servidor. Revisa tu conexión a internet.");
      } else {
        setErrorMessage(error.message || "Error al iniciar sesión. Verifica tus credenciales o inténtalo más tarde.");
      }
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
            required 
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
            required 
          />
        </div>
        {errorMessage && <p className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{errorMessage}</p>}
        <div className="form-actions">
          <button type="submit" disabled={loading || !username || !password}> 
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