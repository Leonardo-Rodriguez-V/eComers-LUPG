import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("¡Bienvenido de nuevo!");
      navigate("/");
    } catch (error) {
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="glass-panel p-0 overflow-hidden w-100" style={{ maxWidth: "900px" }}>
        <div className="row g-0">
          {/* Columna Izquierda: Formulario */}
          <div className="col-md-6 p-5">
            <div className="text-center mb-4">
              <h5 className="text-white-50 text-uppercase small letter-spacing-2">Ingresa a</h5>
              <h2 className="fw-bold text-white">LEVEL UP</h2>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Dummy inputs to prevent browser autofill */}
              <input type="text" style={{ display: 'none' }} />
              <input type="password" style={{ display: 'none' }} />

              <div className="mb-3">
                <label className="form-label text-white-50 small">E-MAIL</label>
                <input
                  type="email"
                  className="input-premium"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  name="email_login_no_autofill"
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-white-50 small">CONTRASEÑA</label>
                <input
                  type="password"
                  className="input-premium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  name="password_login_no_autofill"
                />
              </div>

              <button type="submit" className="btn btn-premium w-100 rounded-pill mb-3">
                Iniciar Sesión
              </button>

              <div className="text-center">
                <Link to="/forgot-password" className="text-info small text-decoration-none">Restablecer mi Clave</Link>
              </div>
            </form>
          </div>

          {/* Columna Derecha: Invitación a Registro */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center align-items-center text-center"
            style={{ background: "rgba(255, 255, 255, 0.03)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="fw-bold text-white mb-3">¿ERES NUEVO EN LEVEL UP?</h3>
            <p className="text-white-50 mb-4 fw-medium">
              Al registrarte, podrás agilizar tu proceso de compra, editar tus datos, revisar tu historial y mucho más.
            </p>
            <Link to="/register" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}