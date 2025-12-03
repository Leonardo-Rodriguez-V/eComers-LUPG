import api from './api';

const API_URL = '/orders'; // api.js ya tiene baseURL /api

export const createOrder = async (items, shippingAddress) => {
    // api.js inyecta el token automáticamente
    const response = await api.post(API_URL, { items, shippingAddress });
    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get(`${API_URL}/mine`);
    return response.data;
};
