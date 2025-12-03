import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../services/checkout';
import { toast } from 'react-toastify';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar el historial de compras');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container py-5 text-center">Cargando historial...</div>;

    return (
        <div className="container py-5">
            <h2 className="mb-4">Mis Compras</h2>
            {orders.length === 0 ? (
                <div className="alert alert-info">No has realizado ninguna compra aún.</div>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order._id} className="col-12 mb-4">
                            <div className="card bg-dark text-white border-secondary">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <span>Orden #{order._id.slice(-6)}</span>
                                    <span className={`badge ${order.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                                        {order.status === 'paid' ? 'Pagado' : order.status}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted small mb-2">Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <ul className="list-group list-group-flush bg-transparent">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="list-group-item bg-transparent text-white border-secondary d-flex justify-content-between">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>${item.price?.toLocaleString('es-CL')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <hr className="border-secondary" />
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total</span>
                                        <span>${order.total?.toLocaleString('es-CL')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
