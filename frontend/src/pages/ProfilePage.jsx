import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../services/checkout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado local para datos de usuario y direcciones
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', email: '' });

    // Estado para modal de dirección
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({ alias: '', address: '', city: '', region: '' });

    useEffect(() => {
        fetchProfile();
        if (activeTab === 'orders') {
            loadOrders();
        }
    }, [activeTab]);

    const fetchProfile = async () => {
        try {
            // api ya tiene el baseURL '/api' y el header Authorization configurado por AuthContext
            const res = await api.get('/auth/me');
            setProfileData(res.data);
            setEditForm({ username: res.data.username, email: res.data.email });
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar el historial de compras');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/profile', editForm);
            toast.success('Perfil actualizado');
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar perfil');
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/address', addressForm);
            toast.success('Dirección agregada');
            setShowAddressModal(false);
            setAddressForm({ alias: '', address: '', city: '', region: '' });
            fetchProfile();
        } catch (error) {
            toast.error('Error al agregar dirección');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta dirección?')) return;
        try {
            await api.delete(`/auth/address/${id}`);
            toast.success('Dirección eliminada');
            fetchProfile();
        } catch (error) {
            toast.error('Error al eliminar dirección');
        }
    };

    // Usar profileData si existe, sino user del contexto
    const displayUser = profileData || user;

    return (
        <div className="container py-5" style={{ minHeight: '80vh' }}>
            {/* Header del Perfil */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="fw-bold text-white mb-0">
                    {displayUser?.username || 'Usuario'}
                </h2>
                <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4">
                    Cerrar Sesión
                </button>
            </div>

            {/* Tabs de Navegación */}
            <div className="d-flex gap-4 mb-4 border-bottom border-secondary pb-2">
                <button
                    className={`btn btn-link text-decoration-none fw-bold px-0 ${activeTab === 'orders' ? 'text-primary border-bottom border-primary border-3' : 'text-white-50'}`}
                    onClick={() => setActiveTab('orders')}
                    style={{ borderRadius: 0 }}
                >
                    <i className="fas fa-shopping-bag me-2"></i>
                    Pedidos
                </button>
                <button
                    className={`btn btn-link text-decoration-none fw-bold px-0 ${activeTab === 'details' ? 'text-primary border-bottom border-primary border-3' : 'text-white-50'}`}
                    onClick={() => setActiveTab('details')}
                    style={{ borderRadius: 0 }}
                >
                    <i className="fas fa-user-cog me-2"></i>
                    Detalles
                </button>
            </div>

            {/* Contenido de Pestañas */}
            <div className="tab-content">
                {activeTab === 'orders' && (
                    <div className="fade-in">
                        {loading ? (
                            <div className="text-center py-5 text-white-50">Cargando pedidos...</div>
                        ) : orders.length === 0 ? (
                            <div className="glass-panel text-center py-5">
                                <h4 className="fw-bold mb-3 text-white">No has realizado ninguna compra.</h4>
                                <p className="text-white-50 mb-4">¡Explora nuestro catálogo y encuentra lo que buscas!</p>
                                <button onClick={() => navigate('/catalogo')} className="btn btn-premium px-5 rounded-pill" style={{ maxWidth: '300px' }}>
                                    Empieza A Comprar
                                </button>
                            </div>
                        ) : (
                            <div className="row">
                                {orders.map((order) => (
                                    <div key={order._id} className="col-12 mb-4">
                                        <div className="glass-panel p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <span className="fw-bold text-primary">Orden #{order._id.slice(-6)}</span>
                                                    <span className="text-white-50 ms-3 small">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className={`badge ${order.status === 'paid' ? 'bg-success' : 'bg-warning'} rounded-pill px-3`}>
                                                    {order.status === 'paid' ? 'Pagado' : order.status}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="d-flex justify-content-between text-white-50 mb-1">
                                                        <span>{item.quantity}x {item.name}</span>
                                                        <span>${item.price?.toLocaleString('es-CL')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <hr className="border-secondary" />
                                            <div className="d-flex justify-content-between fw-bold text-white fs-5">
                                                <span>Total</span>
                                                <span>${order.total?.toLocaleString('es-CL')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="fade-in row g-4">
                        {/* Detalles de Contacto */}
                        <div className="col-md-6">
                            <div className="glass-panel h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold text-white mb-0">Detalles de contacto</h5>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="btn btn-outline-light rounded-pill btn-sm px-3"
                                    >
                                        <i className={`fas ${isEditing ? 'fa-times' : 'fa-pen'} me-2`}></i>
                                        {isEditing ? 'Cancelar' : 'Editar'}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="mb-3">
                                            <label className="text-white-50 small d-block mb-1">NOMBRE DE USUARIO</label>
                                            <input
                                                type="text"
                                                className="input-premium w-100"
                                                value={editForm.username}
                                                onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="text-white-50 small d-block mb-1">CORREO ELECTRÓNICO</label>
                                            <input
                                                type="email"
                                                className="input-premium w-100"
                                                value={editForm.email}
                                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-premium w-100 rounded-pill mt-2">
                                            Guardar Cambios
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <label className="text-white-50 small d-block">CORREO ELECTRÓNICO</label>
                                            <div className="text-white fw-medium">{displayUser?.email}</div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-white-50 small d-block">NOMBRE DE USUARIO</label>
                                            <div className="text-white fw-medium">{displayUser?.username || 'No especificado'}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Direcciones */}
                        <div className="col-md-6">
                            <div className="glass-panel h-100">
                                <h5 className="mb-4 fw-bold text-white">Direcciones guardadas</h5>

                                {displayUser?.addresses && displayUser.addresses.length > 0 ? (
                                    <div className="d-flex flex-column gap-3 mb-4">
                                        {displayUser.addresses.map((addr) => (
                                            <div key={addr._id} className="p-3 border border-secondary rounded position-relative" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr._id)}
                                                    className="btn btn-link text-danger position-absolute top-0 end-0 p-2"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                                <div className="fw-bold text-white">{addr.alias}</div>
                                                <div className="text-white-50 small">{addr.address}</div>
                                                <div className="text-white-50 small">{addr.city}, {addr.region}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white-50 small mb-4">
                                        No tienes direcciones guardadas.
                                    </p>
                                )}

                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="btn btn-outline-light rounded-pill btn-sm px-4"
                                >
                                    <i className="fas fa-plus me-2"></i>Añadir Dirección
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Añadir Dirección (Simple Overlay) */}
            {showAddressModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 2000, background: 'rgba(0,0,0,0.8)' }}>
                    <div className="glass-panel p-4 w-100" style={{ maxWidth: '500px' }}>
                        <h4 className="text-white fw-bold mb-4">Nueva Dirección</h4>
                        <form onSubmit={handleAddAddress}>
                            <div className="mb-3">
                                <label className="text-white-50 small">ALIAS (Ej: Casa)</label>
                                <input
                                    type="text" className="input-premium w-100" required
                                    value={addressForm.alias}
                                    onChange={e => setAddressForm({ ...addressForm, alias: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-white-50 small">DIRECCIÓN</label>
                                <input
                                    type="text" className="input-premium w-100" required
                                    value={addressForm.address}
                                    onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
                                />
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="text-white-50 small">CIUDAD</label>
                                    <input
                                        type="text" className="input-premium w-100" required
                                        value={addressForm.city}
                                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="text-white-50 small">REGIÓN</label>
                                    <input
                                        type="text" className="input-premium w-100" required
                                        value={addressForm.region}
                                        onChange={e => setAddressForm({ ...addressForm, region: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="d-flex gap-2 justify-content-end mt-4">
                                <button type="button" onClick={() => setShowAddressModal(false)} className="btn btn-outline-light rounded-pill">Cancelar</button>
                                <button type="submit" className="btn btn-premium rounded-pill">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
