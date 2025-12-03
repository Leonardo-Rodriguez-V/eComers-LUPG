import React, { useState } from "react";
import { toast } from "react-toastify";

/*
  Componente Contacto mejorado.
  Pega en src/components/Contacto.jsx
*/

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.nombre.trim()) {
      toast.error("Por favor ingresa tu nombre", { toastId: "err-nombre" });
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Por favor ingresa tu correo", { toastId: "err-email" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Ingresa un correo válido", { toastId: "err-email-format" });
      return false;
    }
    if (!form.mensaje.trim()) {
      toast.error("Escribe un mensaje", { toastId: "err-mensaje" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    // Simulación de envío (aquí llamarías a tu API)
    setTimeout(() => {
      toast.success("Mensaje enviado con éxito. ¡Gracias por contactarnos!", { toastId: "contact-success" });
      setForm({ nombre: "", email: "", mensaje: "" });
      setSending(false);
    }, 900);
  };

  return (
    <section id="contacto" className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg" style={{ background: "#0f1720", border: "1px solid rgba(0,123,255,0.15)" }}>
              <div className="card-header text-center py-4" style={{ background: "linear-gradient(90deg,#061022,#0b1b2b)" }}>
                <h2 className="mb-1" style={{ color: "var(--azul-electrico)" }}>📩 Contáctanos</h2>
                <p className="mb-0 text-white-50">¿Tienes dudas o quieres soporte? Escríbenos y te responderemos pronto.</p>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit} style={{ maxWidth: 720, margin: "0 auto" }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          id="nombre"
                          name="nombre"
                          type="text"
                          className="form-control text-white"
                          style={{ 
                            background: "rgba(255,255,255,0.05)", 
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: "none"
                          }}
                          placeholder="Nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          required
                          aria-label="Nombre"
                        />
                        <label htmlFor="nombre" className="text-white-50">Nombre</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="form-control text-white"
                          style={{ 
                            background: "rgba(255,255,255,0.05)", 
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: "none"
                          }}
                          placeholder="Correo"
                          value={form.email}
                          onChange={handleChange}
                          required
                          aria-label="Correo"
                        />
                        <label htmlFor="email" className="text-white-50">Correo</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          id="mensaje"
                          name="mensaje"
                          className="form-control text-white"
                          style={{ 
                            background: "rgba(255,255,255,0.05)", 
                            border: "1px solid rgba(255,255,255,0.2)",
                            height: 140,
                            boxShadow: "none"
                          }}
                          placeholder="Mensaje"
                          value={form.mensaje}
                          onChange={handleChange}
                          required
                          aria-label="Mensaje"
                        />
                        <label htmlFor="mensaje" className="text-white-50">Mensaje</label>
                      </div>
                    </div>

                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="badge bg-info text-dark me-2">Soporte rápido</span>
                        <small className="text-white-50">Respondemos en 24-48 hrs</small>
                      </div>

                      <button
                        type="submit"
                        className="btn"
                        style={{
                          background: "linear-gradient(135deg, #00ff88, #00cc6a)",
                          color: "#000",
                          fontWeight: "bold",
                          border: "none",
                          boxShadow: "0 0 20px rgba(0,255,136,0.5)",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.boxShadow = "0 0 30px rgba(0,255,136,0.8)";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.boxShadow = "0 0 20px rgba(0,255,136,0.5)";
                          e.target.style.transform = "translateY(0)";
                        }}
                        disabled={sending}
                        aria-disabled={sending}
                      >
                        {sending ? "Enviando..." : "Enviar mensaje"}
                      </button>
                    </div>
                  </div>
                </form>

                <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-white-50 mt-3">
                  <div>
                    <i className="fas fa-map-marker-alt me-2"></i> Santiago, Chile
                  </div>
                  <div>
                    <i className="fas fa-phone-alt me-2"></i> +56 9 1234 5678
                  </div>
                  <div>
                    <i className="fas fa-envelope me-2"></i> contacto@levelupgamer.cl
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}