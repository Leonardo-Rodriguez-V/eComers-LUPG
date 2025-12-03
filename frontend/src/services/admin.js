import api from './api';

// Productos
export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    console.log('Service updateProduct:', { id, productData });
    try {
        const response = await api.put(`/products/${id}`, productData);
        console.log('Response de updateProduct:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error en updateProduct:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

// Usuarios
export const getUsers = async () => {
    const response = await api.get('/auth/users');
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/auth/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
};

// Órdenes
export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
};

export const deleteOrder = async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
};

// --- Ofertas ---
export const getOffers = async () => {
    const response = await api.get('/offers');
    return response.data;
};

export const createOffer = async (data) => {
    const response = await api.post('/offers', data);
    return response.data;
};

export const updateOffer = async (id, data) => {
    const response = await api.put(`/offers/${id}`, data);
    return response.data;
};

export const deleteOffer = async (id) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
};

// --- Eventos ---
export const getEvents = async () => {
    const response = await api.get('/events');
    return response.data;
};

export const createEvent = async (data) => {
    const response = await api.post('/events', data);
    return response.data;
};

export const updateEvent = async (id, data) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
};
