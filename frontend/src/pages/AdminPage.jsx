import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getProducts, deleteProduct, createProduct, updateProduct,
  getUsers, deleteUser, updateUser,
  getOrders, updateOrderStatus, deleteOrder,
  getOffers, createOffer, updateOffer, deleteOffer,
  getEvents, createEvent, updateEvent, deleteEvent
} from "../services/admin";
import { toast } from "react-toastify";
import ProductFormModal from "../components/admin/ProductFormModal";
import OfferFormModal from "../components/admin/OfferFormModal";
import EventFormModal from "../components/admin/EventFormModal";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Data States
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [events, setEvents] = useState([]);

  // Modals State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error("Acceso denegado");
      navigate("/");
      return;
    }
    loadAllData();
  }, [user, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [p, u, o, off, evt] = await Promise.all([
        getProducts(),
        getUsers(),
        getOrders(),
        getOffers(),
        getEvents()
      ]);
      setProducts(p);
      setUsers(u);
      setOrders(o);
      setOffers(off);
      setEvents(evt);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando datos del admin");
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCTS ---
  const handleSaveProduct = async (formData) => {
    try {
      console.log('handleSaveProduct recibió:', formData);
      if (editingProduct) {
        console.log('Actualizando producto:', editingProduct._id);
        await updateProduct(editingProduct._id, formData);
        toast.success("Producto actualizado");
      } else {
        console.log('Creando nuevo producto');
        await createProduct(formData);
        toast.success("Producto creado");
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadAllData();
    } catch (error) {
      toast.error("Error guardando producto");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Seguro de eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado");
      loadAllData();
    } catch (error) {
      toast.error("Error eliminando producto");
    }
  };

  // --- USERS ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Seguro de eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      toast.success("Usuario eliminado");
      loadAllData();
    } catch (error) {
      toast.error("Error eliminando usuario");
    }
  };

  // --- ORDERS ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Estado actualizado");
      loadAllData();
    } catch (error) {
      toast.error("Error actualizando estado");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("¿Seguro de eliminar esta orden?")) return;
    try {
      await deleteOrder(id);
      toast.success("Orden eliminada");
      loadAllData();
    } catch (error) {
      toast.error("Error eliminando orden");
    }
  };

  // --- OFFERS ---
  const handleSaveOffer = async (formData) => {
    try {
      if (editingOffer) {
        await updateOffer(editingOffer._id, formData);
        toast.success("Oferta actualizada");
      } else {
        await createOffer(formData);
        toast.success("Oferta creada");
      }
      setShowOfferModal(false);
      setEditingOffer(null);
      loadAllData();
    } catch (error) {
      toast.error("Error guardando oferta");
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm("¿Seguro de eliminar esta oferta?")) return;
    try {
      await deleteOffer(id);
      toast.success("Oferta eliminada");
      loadAllData();
    } catch (error) {
      toast.error("Error eliminando oferta");
    }
  };

  // --- EVENTS ---
  const handleSaveEvent = async (formData) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, formData);
        toast.success("Evento actualizado");
      } else {
        await createEvent(formData);
        toast.success("Evento creado");
      }
      setShowEventModal(false);
      setEditingEvent(null);
      loadAllData();
    } catch (error) {
      toast.error("Error guardando evento");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("¿Seguro de eliminar este evento?")) return;
    try {
      await deleteEvent(id);
      toast.success("Evento eliminado");
      loadAllData();
    } catch (error) {
      toast.error("Error eliminando evento");
    }
  };


  if (loading) return <div className="text-white text-center py-5">Cargando panel...</div>;

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-white">Panel de Administración</h2>
        <div className="text-white-50">Hola, {user?.username}</div>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active bg-primary' : 'bg-dark text-white'}`}
            onClick={() => setActiveTab('products')}
          >
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active bg-primary' : 'bg-dark text-white'}`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active bg-primary' : 'bg-dark text-white'}`}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'offers' ? 'active bg-primary' : 'bg-dark text-white'}`}
            onClick={() => setActiveTab('offers')}
          >
            Ofertas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'events' ? 'active bg-primary' : 'bg-dark text-white'}`}
            onClick={() => setActiveTab('events')}
          >
            Eventos
          </button>
        </li>
      </ul>

      {/* Content Area */}
      <div className="glass-panel p-4">

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div>
            <div className="d-flex justify-content-between mb-3">
              <h4 className="text-white">Gestión de Productos</h4>
              <button className="btn btn-success btn-sm" onClick={() => { setEditingProduct(null); setShowProductModal(true); }}>
                + Nuevo Producto
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>Img</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td><img src={p.images?.[0] ? `/assets/imag/${p.images[0]}` : '/assets/imag/logoNew.png'} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /></td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>${p.price?.toLocaleString('es-CL')}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => { setEditingProduct(p); setShowProductModal(true); }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(p._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
          <div>
            <h4 className="text-white mb-3">Gestión de Usuarios</h4>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Puntos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.points || 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          disabled={u.role === 'admin'}
                          onClick={() => {
                            const newRole = u.role === 'admin' ? 'user' : 'admin';
                            updateUser(u._id, { ...u, role: newRole })
                              .then(() => {
                                toast.success(`Rol actualizado a ${newRole}`);
                                loadAllData();
                              })
                              .catch(() => toast.error('Error al actualizar rol'));
                          }}
                          title="Cambiar rol"
                        >
                          <i className="fas fa-user-shield"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={u.role === 'admin'}
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div>
            <h4 className="text-white mb-3">Gestión de Pedidos</h4>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td><small>{o._id.slice(-6)}</small></td>
                      <td>{o.user?.username || 'Anónimo'}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>${o.total?.toLocaleString('es-CL')}</td>
                      <td>
                        <select
                          className="form-select form-select-sm bg-dark text-white border-secondary"
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="paid">Pagado</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-light me-2">Ver</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteOrder(o._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- OFFERS TAB --- */}
        {activeTab === 'offers' && (
          <div>
            <div className="d-flex justify-content-between mb-3">
              <h4 className="text-white">Gestión de Ofertas</h4>
              <button className="btn btn-success btn-sm" onClick={() => { setEditingOffer(null); setShowOfferModal(true); }}>
                + Nueva Oferta
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>Img</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Activa</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(off => (
                    <tr key={off._id}>
                      <td><img src={off.image} alt="" style={{ width: 50, height: 30, objectFit: 'cover', borderRadius: 4 }} /></td>
                      <td>{off.title}</td>
                      <td>${off.price}</td>
                      <td>
                        <span className={`badge ${off.active ? 'bg-success' : 'bg-secondary'}`}>
                          {off.active ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => { setEditingOffer(off); setShowOfferModal(true); }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteOffer(off._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- EVENTS TAB --- */}
        {activeTab === 'events' && (
          <div>
            <div className="d-flex justify-content-between mb-3">
              <h4 className="text-white">Gestión de Eventos</h4>
              <button className="btn btn-success btn-sm" onClick={() => { setEditingEvent(null); setShowEventModal(true); }}>
                + Nuevo Evento
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>Img</th>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Ubicación</th>
                    <th>Coords</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev._id}>
                      <td><img src={ev.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /></td>
                      <td>{ev.title}</td>
                      <td>{new Date(ev.date).toLocaleDateString()}</td>
                      <td>{ev.location}</td>
                      <td><small>{ev.lat}, {ev.lng}</small></td>
                      <td>
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => { setEditingEvent(ev); setShowEventModal(true); }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteEvent(ev._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <ProductFormModal
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
      <OfferFormModal
        show={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onSave={handleSaveOffer}
        offer={editingOffer}
      />
      <EventFormModal
        show={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
      />
    </div>
  );
}