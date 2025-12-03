import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/checkout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Formulario de envío
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: user?.email || '',
        telefono: '',
        direccion: '',
        ciudad: '',
        region: '',
        codigoPostal: ''
    });

    // Cargar carrito desde localStorage al montar
    useEffect(() => {
        try {
            const saved = localStorage.getItem('levelup_cart_v1');
            if (saved) {
                setCart(JSON.parse(saved));
            }
        } catch (err) {
            console.error(err);
        }

        // Pre-llenar datos si el usuario tiene info en su perfil
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.username || '',
                email: user.email || ''
            }));
            // Si tuviera direcciones guardadas, podríamos pre-llenar la primera aquí
            if (user.addresses && user.addresses.length > 0) {
                const addr = user.addresses[0];
                setFormData(prev => ({
                    ...prev,
                    direccion: addr.address,
                    ciudad: addr.city,
                    region: addr.region,
                    codigoPostal: addr.zip || ''
                }));
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const shipping = subtotal > 0 ? 2500 : 0;
        return { subtotal, shipping, total: subtotal + shipping };
    };

    const { subtotal, shipping, total } = calculateTotal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error("Tu carrito está vacío");
            return;
        }

        setLoading(true);
        try {
            // Concatenar dirección para el backend actual
            const fullAddress = `${formData.direccion}, ${formData.ciudad}, ${formData.region}. Tel: ${formData.telefono}`;

            await createOrder(cart, fullAddress);

            toast.success("¡Pedido realizado con éxito!");
            localStorage.removeItem('levelup_cart_v1'); // Limpiar carrito

            // Hack simple para limpiar el carrito en App.jsx si no usamos Context:
            window.dispatchEvent(new Event('storage'));

            navigate('/order-success');
            window.location.reload(); // Para asegurar que el carrito visual se vacíe en el Navbar
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error al procesar el pedido");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
                <h2 className="text-white fw-bold mb-4">Tu carrito está vacío</h2>
                <button onClick={() => navigate('/catalogo')} className="btn btn-premium px-5 rounded-pill">
                    Volver al Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row g-5">
                {/* Columna Izquierda: Formulario */}
                <div className="col-lg-7">
                    <h4 className="mb-4 text-white fw-bold">1. Detalles de Facturación y Envío</h4>
                    <form id="checkout-form" onSubmit={handleSubmit} className="glass-panel p-4 mb-4">
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label text-white-50 small">NOMBRE</label>
                                <input type="text" className="input-premium w-100" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label text-white-50 small">APELLIDOS</label>
                                <input type="text" className="input-premium w-100" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label text-white-50 small">EMAIL</label>
                                <input type="email" className="input-premium w-100" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label text-white-50 small">TELÉFONO</label>
                                <input type="tel" className="input-premium w-100" name="telefono" value={formData.telefono} onChange={handleChange} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label text-white-50 small">DIRECCIÓN</label>
                                <input type="text" className="input-premium w-100" name="direccion" value={formData.direccion} onChange={handleChange} required placeholder="Calle, número, depto..." />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label text-white-50 small">CIUDAD</label>
                                <input type="text" className="input-premium w-100" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label text-white-50 small">REGIÓN</label>
                                <input type="text" className="input-premium w-100" name="region" value={formData.region} onChange={handleChange} required />
                            </div>
                        </div>
                    </form>

                    <h4 className="mb-4 text-white fw-bold">2. Método de Pago</h4>
                    <div className="glass-panel p-4 mb-4">
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="radio" name="paymentMethod" id="credit" defaultChecked />
                            <label className="form-check-label text-white" htmlFor="credit">
                                Tarjeta de Crédito / Débito (WebPay)
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="radio" name="paymentMethod" id="transfer" />
                            <label className="form-check-label text-white" htmlFor="transfer">
                                Transferencia Bancaria
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="paymentMethod" id="paypal" />
                            <label className="form-check-label text-white" htmlFor="paypal">
                                PayPal
                            </label>
                        </div>
                    </div>

                    <h4 className="mb-4 text-white fw-bold">3. Instrucciones Especiales</h4>
                    <div className="glass-panel p-4">
                        <textarea
                            className="input-premium w-100"
                            rows="3"
                            placeholder="¿Alguna indicación para el repartidor? (Opcional)"
                        ></textarea>
                    </div>
                </div>

                {/* Columna Derecha: Resumen */}
                <div className="col-lg-5">
                    <h4 className="mb-4 text-white fw-bold">Tu Pedido</h4>
                    <div className="glass-panel p-4">
                        <ul className="list-group list-group-flush mb-3">
                            {cart.map((item) => (
                                <li key={item.id} className="list-group-item bg-transparent text-white d-flex justify-content-between lh-sm px-0 border-secondary">
                                    <div>
                                        <h6 className="my-0">{item.nombre}</h6>
                                        <small className="text-white-50">Cantidad: {item.cantidad}</small>
                                    </div>
                                    <span className="text-white">${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                                </li>
                            ))}
                            <li className="list-group-item bg-transparent text-white d-flex justify-content-between px-0 border-secondary">
                                <span>Subtotal</span>
                                <strong>${subtotal.toLocaleString('es-CL')}</strong>
                            </li>
                            <li className="list-group-item bg-transparent text-white d-flex justify-content-between px-0 border-secondary">
                                <span>Envío</span>
                                <strong>${shipping.toLocaleString('es-CL')}</strong>
                            </li>
                            <li className="list-group-item bg-transparent text-white d-flex justify-content-between px-0 border-0 fs-5 fw-bold">
                                <span>Total (CLP)</span>
                                <span>${total.toLocaleString('es-CL')}</span>
                            </li>
                        </ul>

                        {/* Código de Descuento */}
                        <div className="input-group mb-3">
                            <input type="text" className="form-control input-premium" placeholder="Código de descuento" />
                            <button className="btn btn-outline-light" type="button">Aplicar</button>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="btn btn-premium w-100 rounded-pill py-3 fw-bold mt-3"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Realizar Pedido'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
