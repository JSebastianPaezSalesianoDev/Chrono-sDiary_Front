import React from "react"; 
import "./Login.css"; 


const ForgotPassword = () => { 

  return (
    <div className="login-container">
      <h1 className="login-title">Restablecer Contraseña</h1>

  
      <form className="login-form">

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email" 
            placeholder="Introduce tu correo electrónico"
          
          />
        </div>

        <div className="form-actions">
          <button type="button"> 
            Enviar enlace de restablecimiento
          </button>
        </div>

   
        <div className="signup-link">
          <p>
            ¿Recordaste tu contraseña? <a href="#">Iniciar Sesión</a>
          </p>
          <p>
            ¿No tienes una cuenta? <a href="#">Registrarse</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;