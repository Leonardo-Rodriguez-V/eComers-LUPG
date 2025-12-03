import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";


/*
  LoginModal mejorado con "Olvidé mi contraseña" integrado.
  - Requiere react-toastify y que tengas <ToastContainer /> en App.jsx.
  - El flujo "olvidé mi contraseña" hace POST a /api/auth/forgot-password
    y muestra un mensaje genérico (por seguridad). Ajusta la URL si tu API es diferente.
*/

function ForgotPasswordModal({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => emailRef.current?.focus(), 60);
    } else {
      setEmail("");
      setSending(false);
    }
  }, [show]);

  if (!show) return null;

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      toast.error("Ingresa un correo válido", { toastId: "fp-err-format" });
      emailRef.current?.focus();
      return;
    }
    setSending(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      toast.success("Si existe una cuenta asociada, recibirás un correo con instrucciones.", { toastId: "fp-sent" });
      setEmail("");
      onClose?.();
    } catch (err) {
      console.error("forgot-password error:", err);
      toast.error("Error al solicitar recuperación. Intenta nuevamente más tarde.", { toastId: "fp-fail" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal d-block" role="dialog" aria-modal="true" style={{ background: "rgba(0,0,0,0.6)" }}>
      <style>{`
        .forgot-modal .modal-dialog { max-width: 420px; }
        .forgot-modal .modal-content { background: linear-gradient(180deg,#061018,#04101a); color: #fff; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
        .forgot-modal .form-control { background: rgba(255,255,255,0.03); color: #fff; border: 1px solid rgba(255,255,255,0.06); }
        .forgot-modal .btn-primary { border-radius: 8px; }
      `}</style>
      <div className="modal-dialog forgot-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="mb-0">Recuperar contraseña</h5>
            <button className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body ">
            <p className="text-white">Introduce el correo asociado a tu cuenta. Te enviaremos instrucciones si existe la cuenta.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 form-floating">
                <input
                  id="forgot-email"
                  ref={emailRef}
                  className="form-control"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="forgot-email" className="text-white">Correo electrónico</label>
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose} disabled={sending}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar instrucciones"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginModal({
  show,
  onClose,
  onLogin,
  onShowRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => emailRef.current?.focus(), 50);
    } else {
      setPassword("");
      setShowPassword(false);
    }
  }, [show]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showForgot) setShowForgot(false);
        else onClose?.();
      }
    };
    if (show || showForgot) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, showForgot, onClose]);

  if (!show) return null;

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

  const handleSocialLogin = (provider) => {
    toast.info(`Login con ${provider} (demo)`, { toastId: `social-${provider}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Ingresa tu correo electrónico", { toastId: "login-err-email" });
      emailRef.current?.focus();
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Ingresa un correo válido", { toastId: "login-err-email-format" });
      emailRef.current?.focus();
      return;
    }
    if (!password || password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres", { toastId: "login-err-pass" });
      return;
    }
    setSending(true);
    try {
      if (typeof onLogin === "function") {
        const result = onLogin.length >= 2 ? onLogin(email, password) : onLogin(email);
        if (result && typeof result.then === "function") {
          const res = await result;
          if (res === false) {
            toast.error("Credenciales incorrectas", { toastId: "login-failed" });
            setSending(false);
            return;
          }
        }
        toast.success("Has iniciado sesión correctamente", { toastId: "login-success" });
        setTimeout(() => {
          setSending(false);
          onClose?.();
        }, 700);
      } else {
        toast.success("Sesión iniciada (demo)", { toastId: "login-demo" });
        setTimeout(() => {
          setSending(false);
          onClose?.();
        }, 700);
      }
    } catch (err) {
      const msg = (err && (err.message || err.msg)) || "Error al iniciar sesión";
      toast.error(msg, { toastId: "login-exception" });
      setSending(false);
    }
  };

  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginModalTitle"
        style={{ background: "rgba(0,0,0,0.6)" }}
      >
        <style>{`
          .login-modal .modal-dialog { max-width: 420px; }
          .login-modal .modal-content { background: linear-gradient(180deg,#061018,#04101a); color: #fff; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
          .login-modal .modal-header { border-bottom: 1px solid rgba(255,255,255,0.03); }
          .login-modal .form-control { background: rgba(255,255,255,0.03); color: #fff; border: 1px solid rgba(255,255,255,0.06); }
          .login-modal .form-floating > label { color: rgba(255,255,255,0.85); }
          .login-modal .hint { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
          .login-modal .social-btn { border-radius: 8px; padding: 8px 10px; min-width: 48px; display:inline-flex; align-items:center; justify-content:center; }
          .login-modal .divider { height:1px; background: rgba(255,255,255,0.03); margin: 14px 0; }
          .login-modal .btn-submit { background: linear-gradient(90deg,#0ebf3b,#00ff72); color:#001b00; font-weight:700; border:none; border-radius:8px; padding:10px 12px; box-shadow: 0 10px 24px rgba(0,255,114,0.08); }
          .login-modal .btn-submit:disabled { opacity:0.7; filter:none; box-shadow:none; }
          .login-modal .small-link { color: #9fe9ff; cursor:pointer; text-decoration:underline; background: none; border: none; padding:0; }
        `}</style>
        <div className="modal-dialog login-modal">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between">
              <div>
                <h5 id="loginModalTitle" className="mb-0">Iniciar Sesión</h5>
                <div className="hint">Accede a tu cuenta para pedidos, historial y más</div>
              </div>
              <button className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} aria-describedby="login-hint">
                <div className="mb-3 form-floating">
                  <input
                    id="login-email"
                    ref={emailRef}
                    className="form-control"
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                  />
                  <label htmlFor="login-email">Correo</label>
                </div>
                <div className="mb-3 form-floating" style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    className="form-control"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    aria-required="true"
                  />
                  <label htmlFor="login-password">Contraseña</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="small-link"
                    style={{ position: "absolute", right: 12, top: 12 }}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="form-check">
                    <input id="remember" className="form-check-input" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <label className="form-check-label" htmlFor="remember" style={{ color: "rgba(255,255,255,0.9)" }}>
                      Recuérdame
                    </label>
                  </div>
                  <div>
                    <button type="button" className="small-link" onClick={() => setShowForgot(true)}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn-submit w-100" disabled={sending} aria-disabled={sending}>
                  {sending ? "Ingresando..." : "Ingresar"}
                </button>
              </form>
              <div className="divider" />
              <div className="d-flex align-items-center justify-content-between">
                <div className="hint">O ingresa con</div>
                <div>
                  <button className="btn social-btn me-2" onClick={() => handleSocialLogin("Facebook")} title="Facebook">
                    <i className="fab fa-facebook-f" />
                  </button>
                  <button className="btn social-btn me-2" onClick={() => handleSocialLogin("Google")} title="Google">
                    <i className="fab fa-google" />
                  </button>
                  <button className="btn social-btn" onClick={() => handleSocialLogin("Twitch")} title="Twitch">
                    <i className="fab fa-twitch" />
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ flex: 1, color: "rgba(255,255,255,0.75)" }}>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0 small-link"
                  onClick={() => {
                    toast.info("Registro (demo). Abre modal de registro si lo tienes.", { toastId: "open-register" });
                    onShowRegister?.(); // <<< Aquí conecta con tu App.jsx
                  }}
                >
                  Regístrate
                </button>
              </div>
              <div>
                <button className="btn btn-outline-secondary me-2" onClick={onClose}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModal show={showForgot} onClose={() => setShowForgot(false)} />
    </>
  );
}
