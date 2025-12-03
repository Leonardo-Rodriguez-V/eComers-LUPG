import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

/*
  ProfileModal
  - Props:
    - show, onClose
    - user: object (fallback to auth.user if not provided)
    - updateProfile: async function ({ nombre, fechaNacimiento }) => Promise
    - requireAge: minimum age required (default 18)
  - Si no se pasa updateProfile, intenta actualizar localStorage como fallback
    (recomendado: pasar updateProfile que llame a tu API y actualice el AuthContext).
*/

export default function ProfileModal({ show, onClose, user: userProp, updateProfile, requireAge = 18 }) {
  const auth = useAuth();
  const user = userProp ?? auth?.user;
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [sending, setSending] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (show && user) {
      setNombre(user.nombre || user.username || "");
      // Prefer common keys: fechaNacimiento or birthdate
      setFecha(user.fechaNacimiento || user.birthdate || "");
      setTimeout(() => nameRef.current?.focus(), 70);
    }
    if (!show) {
      setNombre("");
      setFecha("");
      setSending(false);
    }
  }, [show, user]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (show) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show || !user) return null;

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

  const validate = () => {
    if (!nombre.trim()) {
      toast.error("Por favor ingresa tu nombre", { toastId: "prof-err-nombre" });
      nameRef.current?.focus();
      return false;
    }
    if (!fecha) {
      toast.error("Selecciona tu fecha de nacimiento", { toastId: "prof-err-fecha" });
      return false;
    }
    const age = calculateAge(fecha);
    if (age === null) {
      toast.error("Fecha de nacimiento inválida", { toastId: "prof-err-fecha-invalid" });
      return false;
    }
    if (requireAge && age < requireAge) {
      toast.error(`Debes tener al menos ${requireAge} años (actual: ${age})`, { toastId: "prof-err-age" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);

    try {
      if (typeof updateProfile === "function") {
        // Usa la función provista por el padre (recomendado: hace la llamada al backend y actualiza el contexto)
        const result = updateProfile({ nombre: nombre.trim(), fechaNacimiento: fecha });
        if (result && typeof result.then === "function") await result;
      } else {
        // Fallback: actualiza localStorage para reflejar el cambio de forma local
        try {
          const raw = localStorage.getItem("user");
          const parsed = raw ? JSON.parse(raw) : {};
          const updated = { ...(parsed || {}), nombre: nombre.trim(), fechaNacimiento: fecha };
          localStorage.setItem("user", JSON.stringify(updated));
          toast.info("Perfil actualizado localmente. Recarga para reflejar en toda la app.", { toastId: "prof-local" });
        } catch (err) {
          console.warn("Profile fallback update failed", err);
          toast.error("No se pudo actualizar el perfil localmente", { toastId: "prof-local-err" });
        }
      }

      toast.success("Perfil actualizado", { toastId: "profile-updated" });
      setTimeout(() => {
        setSending(false);
        onClose?.();
      }, 700);
    } catch (err) {
      console.error("profile update error", err);
      toast.error(err?.message || "Error al actualizar el perfil", { toastId: "profile-update-error" });
      setSending(false);
    }
  };

  return (
    <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="profileModalTitle" style={{ background: "rgba(0,0,0,0.6)" }}>
      <style>{`
        .profile-modal .modal-dialog { max-width: 480px; }
        .profile-modal .modal-content { background: linear-gradient(180deg,#161d22,#1c2835); color:#fff; border-radius: 10px; border: 1px solid rgba(255,255,255,0.09); }
        .profile-modal .form-control { background: rgba(255,255,255,0.02); color: #fff; border: 1px solid rgba(255,255,255,0.08); }
        .profile-modal .label-muted { color: rgba(255,255,255,0.6); }
        .profile-modal .btn-success { border-radius:8px; }
        @media (max-width: 700px) { .profile-modal .modal-dialog { margin: 16px; } }
      `}</style>
      <div className="modal-dialog profile-modal">
        <div className="modal-content">
          <div className="modal-header d-flex align-items-center justify-content-between">
            <div>
              <h5 id="profileModalTitle" className="mb-0">Mi perfil</h5>
              <div className="label-muted">Aquí puedes actualizar tu información</div>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="pro-nombre">Nombre</label>
                <input id="pro-nombre" ref={nameRef} className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label htmlFor="pro-fecha">Fecha nacimiento</label>
                <input id="pro-fecha" className="form-control" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                <div className="label-muted" style={{ marginTop: 5 }}>
                  <small>{fecha ? `Edad: ${calculateAge(fecha)} años` : `Debes tener al menos ${requireAge} años`}</small>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="pro-email">Correo</label>
                <input id="pro-email" className="form-control" value={user.email || user.username || ""} disabled />
              </div>

              <button className="btn btn-success w-100" disabled={sending}>{sending ? "Guardando..." : "Guardar"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}