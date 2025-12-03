import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

/*
  RegisterModal
  - Props:
    - show, onClose
    - onRegister (optional) - function to call to register (should return a Promise or sync value)
    - onLogin (optional) - function to login after register (optional)
    - requireAge (default 18)
  - If no onRegister provided, modal will POST to /api/auth/register (assumes backend endpoint exists).
  - If AuthContext available we try to auto-login with auth.login after successful registration.
*/

export default function RegisterModal({
  show,
  onClose,
  onRegister,
  onLogin,
  requireAge = 18,
}) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => nameRef.current?.focus(), 50);
    } else {
      setPassword("");
      setConfirm("");
      setShowPassword(false);
      setAcceptTerms(false);
      setFechaNacimiento("");
    }
  }, [show]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (show) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birth = new Date(dateString);
    if (Number.isNaN(birth.getTime())) return null;
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const passwordStrength = (pw) => {
    let score = 0;
    if (!pw) return { score, label: "Muy débil" };
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"];
    return { score, label: labels[Math.min(score, labels.length - 1)] };
  };
  const pw = passwordStrength(password);

  const validate = () => {
    if (!nombre.trim()) {
      toast.error("Por favor ingresa tu nombre", { toastId: "reg-err-nombre" });
      nameRef.current?.focus();
      return false;
    }
    if (!isValidEmail(email)) {
      toast.error("Ingresa un correo válido", { toastId: "reg-err-email" });
      return false;
    }
    if (!fechaNacimiento) {
      toast.error("Por favor selecciona tu fecha de nacimiento", { toastId: "reg-err-fecha" });
      return false;
    }
    const age = calculateAge(fechaNacimiento);
    if (age === null) {
      toast.error("Fecha de nacimiento inválida", { toastId: "reg-err-fecha-invalid" });
      return false;
    }
    if (requireAge && age < requireAge) {
      toast.error(`Debes tener al menos ${requireAge} años para registrarte (edad detectada: ${age})`, { toastId: "reg-err-age" });
      return false;
    }
    if (!password || password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres", { toastId: "reg-err-passlen" });
      return false;
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden", { toastId: "reg-err-match" });
      return false;
    }
    if (!acceptTerms) {
      toast.error("Debes aceptar los Términos y la Política de Privacidad", { toastId: "reg-err-terms" });
      return false;
    }
    return true;
  };

  const doRegisterWithApi = async () => {
    // Fallback register against backend endpoint /api/auth/register
    const payload = { username: nombre.trim(), email: email.trim().toLowerCase(), password, birthdate: fechaNacimiento };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || "Error al registrar");
    }
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      let result;
      if (typeof onRegister === "function") {
        // soporta diferentes firmas: onRegister(email,nombre,fecha,password) o onRegister(obj)
        try {
          if (onRegister.length >= 4) {
            result = onRegister(email.trim().toLowerCase(), nombre.trim(), fechaNacimiento || null, password);
          } else {
            result = onRegister({ email: email.trim().toLowerCase(), nombre: nombre.trim(), fechaNacimiento: fechaNacimiento || null, password });
          }
        } catch (syncErr) {
          throw syncErr;
        }
      } else {
        // fallback: llamar a la API pública /api/auth/register
        result = doRegisterWithApi();
      }

      if (result && typeof result.then === "function") {
        const res = await result;
        // Si la respuesta entregó token, lo guardamos y hacemos login si auth.login está disponible
        if (res?.token) {
          // guardar token y user en localStorage (AuthProvider inicializará en reload)
          localStorage.setItem("token", res.token);
          if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
          // intenta usar auth.login si existe para sincronizar contexto
          if (auth?.login) {
            try {
              // auth.login espera usernameOrEmail,password según nuestra implementación; si no tenemos password, skip
              await auth.login(email.trim().toLowerCase(), password);
            } catch (err) {
              // ignore, token already stored
            }
          }
        } else if (auth?.login) {
          // intentar login automático con credenciales recién creadas
          try {
            await auth.login(email.trim().toLowerCase(), password);
          } catch (err) {
            // ignore
          }
        }
        toast.success("Registro exitoso. Bienvenido 🎉", { toastId: "reg-success" });
      } else {
        // resultado sin Promise (sincrónico)
        toast.success("Registro realizado (demo)", { toastId: "reg-success-sync" });
      }

      setTimeout(() => {
        setSending(false);
        onClose?.();
      }, 700);
    } catch (err) {
      console.error("register error", err);
      toast.error((err && (err.message || err.msg)) || "Error al registrarse", { toastId: "reg-exception" });
      setSending(false);
    }
  };

  return (
    <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="registerModalTitle" style={{ background: "rgba(0,0,0,0.6)" }}>
      <style>{`
        .register-modal .modal-dialog { max-width: 540px; }
        .register-modal .modal-content { background: linear-gradient(180deg,#061018,#04101a); color:#fff; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
        .register-modal .form-control { background: rgba(255,255,255,0.03); color: #fff; border: 1px solid rgba(255,255,255,0.06); }
        .register-modal .label-muted { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
        .register-modal .pw-meter { height: 8px; border-radius: 6px; background: rgba(255,255,255,0.06); overflow: hidden; margin-top:6px; }
        .register-modal .pw-meter > i { display:block; height:100%; transition: width 180ms ease; background: linear-gradient(90deg,#ff6b6b,#00ff72); }
        .register-modal .btn-primary { border-radius:8px; }
        .register-modal .small-link { color: #9fe9ff; cursor:pointer; text-decoration:underline; background:none; border:none; padding:0; }
        .register-modal .terms { display:flex; gap:8px; align-items:center; }
        @media (max-width: 700px) { .register-modal .modal-dialog { margin: 16px; } }
      `}</style>

      <div className="modal-dialog register-modal">
        <div className="modal-content">
          <div className="modal-header d-flex align-items-center justify-content-between">
            <div>
              <h5 id="registerModalTitle" className="mb-0">Crear cuenta</h5>
              <div className="label-muted">Regístrate para comprar, seguir pedidos y participar en eventos</div>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Dummy inputs to prevent browser autofill */}
              <input type="text" style={{ display: 'none' }} />
              <input type="password" style={{ display: 'none' }} />
              <div className="row g-2">
                <div className="col-12 mb-3">
                  <div className="form-floating">
                    <input id="reg-nombre" ref={nameRef} className="form-control" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    <label htmlFor="reg-nombre" className="text-white">Nombre</label>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input id="reg-fecha" className="form-control" type="date" placeholder="Fecha de nacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required aria-required="true" />
                    <label htmlFor="reg-fecha" className="text-white">Fecha de nacimiento (requerida)</label>
                  </div>
                  <div className="label-muted" style={{ marginTop: 6 }}>
                    <small>{fechaNacimiento ? `Edad: ${calculateAge(fechaNacimiento)} años` : `Debes tener al menos ${requireAge} años`}</small>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input id="reg-email" className="form-control" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="reg-email" className="text-white">Correo</label>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating" style={{ position: "relative" }}>
                    <input id="reg-password" className="form-control" type={showPassword ? "text" : "password"} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                    <label htmlFor="reg-password" className="text-white">Contraseña</label>
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="small-link" style={{ position: "absolute", right: 12, top: 10 }} aria-pressed={showPassword}>
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>

                    <div className="pw-meter" aria-hidden>
                      <i style={{ width: `${(pw.score / 4) * 100}%` }} />
                    </div>
                    <div className="label-muted" style={{ marginTop: 6 }}>
                      <small>Fuerza: {pw.label}</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input id="reg-confirm" className="form-control" type={showPassword ? "text" : "password"} placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
                    <label htmlFor="reg-confirm" className="text-white">Confirmar contraseña</label>
                  </div>
                </div>
              </div>

              <div className="terms mt-2 mb-3">
                <input id="accept-terms" type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                <label htmlFor="accept-terms" style={{ color: "rgba(255,255,255,0.9)" }}>
                  Acepto los <a href="/terminos" style={{ color: "#9fe9ff" }}>Términos</a> y la <a href="/privacidad" style={{ color: "#9fe9ff" }}>Política de Privacidad</a>
                </label>
              </div>

              <div className="d-flex align-items-center justify-content-between mt-3">
                <div>
                  <small className="label-muted">Al registrarte aceptas nuestros Términos y la Política de Privacidad.</small>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? "Registrando..." : "Registrarse"}</button>
                </div>
              </div>
            </form>

            <div style={{ marginTop: 14 }} className="label-muted">
              ¿Ya tienes cuenta?{" "}
              <button type="button" className="small-link" onClick={() => {
                toast.info("Abriendo inicio de sesión...", { toastId: "open-login" });
                onLogin?.();
              }}>
                Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}