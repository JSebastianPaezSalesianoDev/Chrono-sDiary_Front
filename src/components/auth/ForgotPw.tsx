import React, { useState } from "react";
import "./Login.css";
import EventsService from "../../service/event.service";
import { useNavigate } from "react-router-dom";

// Componente para solicitar restablecimiento de contraseña
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Maneja el cambio de email
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(null);
    setMessage(null);
  };

  // Envía la solicitud de restablecimiento
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Por favor, introduce tu correo electrónico.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await EventsService.aResetPassword(email);
      setMessage(response.message || "Si el correo electrónico existe, se ha enviado un enlace de restablecimiento.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Error al solicitar el restablecimiento de contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Restablecer Contraseña</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="Introduce tu correo electrónico"
            value={email}
            onChange={handleEmailChange}
            disabled={loading}
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace de restablecimiento"}
          </button>
        </div>
        {message && <p className="success-message" style={{ color: 'green' }}>{message}</p>}
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        <div className="signup-link">
          <p className="link-text">
            ¿Recordaste tu contraseña?{" "}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Iniciar Sesión
            </a>
          </p>
          <p className="link-text">
            ¿No tienes una cuenta?{" "}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Registrarse
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;