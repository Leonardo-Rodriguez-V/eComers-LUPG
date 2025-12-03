import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica real de recuperación (llamada a API)
        // Por ahora simulamos el envío exitoso
        toast.success("Si el correo existe, recibirás instrucciones para restablecer tu clave.");
        setEmail("");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="glass-panel p-5 w-100" style={{ maxWidth: "500px" }}>
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-white">Recuperar Contraseña</h3>
                    <p className="text-white-50 small">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu clave.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label text-white-50 small">E-MAIL</label>
                        <input
                            type="email"
                            className="input-premium"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-premium w-100 rounded-pill mb-3">
                        Enviar Enlace
                    </button>

                    <div className="text-center">
                        <Link to="/login" className="text-white-50 small text-decoration-none">
                            <i className="fas fa-arrow-left me-2"></i>Volver al Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
