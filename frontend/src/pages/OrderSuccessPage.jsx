import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccessPage() {
    const navigate = useNavigate();

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel p-5 text-center" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="mb-4">
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #0ebf3b, #00ff72)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 0 20px rgba(14, 191, 59, 0.5)'
                    }}>
                        <i className="fas fa-check text-dark display-4"></i>
                    </div>
                </div>

                <h2 className="text-white fw-bold mb-3">¡Gracias por tu compra!</h2>
                <p className="text-white-50 mb-4 fs-5">
                    Tu pedido ha sido procesado exitosamente. Hemos enviado un correo de confirmación con los detalles.
                </p>

                <div className="d-flex flex-column gap-3 justify-content-center">
                    <button
                        onClick={() => navigate('/mis-ordenes')}
                        className="btn btn-premium rounded-pill px-5 py-2 fw-bold"
                    >
                        Ver Mis Pedidos
                    </button>
                    <button
                        onClick={() => navigate('/catalogo')}
                        className="btn btn-outline-light rounded-pill px-5 py-2"
                    >
                        Seguir Comprando
                    </button>
                </div>
            </div>
        </div>
    );
}
