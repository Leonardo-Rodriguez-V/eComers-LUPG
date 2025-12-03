import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        birthdate: "",
        referralCode: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const validate = () => {
        const newErrors = {};
        const username = formData.username.trim();
        const email = formData.email.trim();
        const password = formData.password;
        const birthdate = formData.birthdate;

        if (!username) newErrors.username = "El nombre de usuario es obligatorio";
        else if (username.length < 3) newErrors.username = "Debe tener al menos 3 caracteres";
        else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) newErrors.username = "Solo letras, números y _ . -";

        if (!email) newErrors.email = "El email es obligatorio";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Formato de email inválido";

        if (!password) newErrors.password = "La contraseña es obligatoria";
        else {
            const hasMin = password.length >= 8;
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasDigit = /\d/.test(password);
            if (!(hasMin && hasUpper && hasLower && hasDigit)) {
                newErrors.password = "Min. 8, con mayúscula, minúscula y número";
            }
        }

        if (!birthdate) newErrors.birthdate = "La fecha de nacimiento es obligatoria";
        else if (Number.isNaN(new Date(birthdate).getTime())) newErrors.birthdate = "Fecha inválida";
        else if (calculateAge(birthdate) < 18) newErrors.birthdate = "Debes tener al menos 18 años";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Revisa los campos marcados en rojo.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post("/auth/register", formData);
            toast.success("¡Registro exitoso! Ahora puedes iniciar sesión.");
            navigate("/login");
        } catch (error) {
            const message = error.response?.data?.message || "Error al registrarse";
            // Mapear posibles errores del backend a campos
            if (message.includes("Usuario") || message.includes("usuario")) {
                setErrors((prev) => ({ ...prev, username: "El usuario ya existe" }));
            }
            if (message.includes("email")) {
                setErrors((prev) => ({ ...prev, email: "El email ya está en uso" }));
            }
            toast.error(message);
        }
        finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "80vh" }}>
            <div className="glass-panel p-0 overflow-hidden w-100" style={{ maxWidth: "900px" }}>
                <div className="row g-0">
                    {/* Columna Izquierda: Invitación a Login */}
                    <div className="col-md-6 p-5 d-flex flex-column justify-content-center align-items-center text-center order-2 order-md-1"
                        style={{ background: "rgba(255, 255, 255, 0.03)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                        <h3 className="fw-bold text-white mb-3">¿YA TIENES CUENTA?</h3>
                        <p className="text-white-50 mb-4 fw-medium">
                            Ingresa para acceder a tu historial de compras, lista de deseos y configuración de perfil.
                        </p>
                        <Link to="/login" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold">
                            Iniciar Sesión
                        </Link>
                    </div>

                    {/* Columna Derecha: Formulario Registro */}
                    <div className="col-md-6 p-5 order-1 order-md-2">
                        <div className="text-center mb-4">
                            <h5 className="text-muted text-uppercase small letter-spacing-2">Crea tu cuenta en</h5>
                            <h2 className="fw-bold text-white">LEVEL UP</h2>
                        </div>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            {/* Dummy inputs to prevent browser autofill */}
                            <input type="text" style={{ display: 'none' }} />
                            <input type="password" style={{ display: 'none' }} />
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">NOMBRE DE USUARIO</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="input-premium"
                                    placeholder="Tu nombre gamer"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    aria-invalid={!!errors.username}
                                    aria-describedby="error-username"
                                />
                                {errors.username && (
                                    <div id="error-username" className="text-danger small mt-1">{errors.username}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">E-MAIL</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input-premium"
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                    aria-invalid={!!errors.email}
                                    aria-describedby="error-email"
                                />
                                {errors.email && (
                                    <div id="error-email" className="text-danger small mt-1">{errors.email}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">CONTRASEÑA</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input-premium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    aria-invalid={!!errors.password}
                                    aria-describedby="error-password"
                                />
                                <div className="text-white-50 small">Debe tener 8+ caracteres, mayúscula, minúscula y número.</div>
                                {errors.password && (
                                    <div id="error-password" className="text-danger small mt-1">{errors.password}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">FECHA DE NACIMIENTO</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    className="input-premium"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    required
                                    aria-invalid={!!errors.birthdate}
                                    aria-describedby="error-birthdate"
                                />
                                {errors.birthdate && (
                                    <div id="error-birthdate" className="text-danger small mt-1">{errors.birthdate}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white-50 small">CÓDIGO DE REFERIDO (OPCIONAL)</label>
                                <input
                                    type="text"
                                    name="referralCode"
                                    className="input-premium"
                                    placeholder="Código de amigo"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-premium w-100 rounded-pill" disabled={submitting} aria-busy={submitting}>
                                {submitting ? "Registrando..." : "Registrarse"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
