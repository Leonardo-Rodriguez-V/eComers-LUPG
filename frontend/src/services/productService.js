import api, { setAuth } from './api';

function getToken() {
  return localStorage.getItem('token');
}

export async function fetchProducts() {
  const res = await api.get('/products');
  return res.data;
}

export async function createProduct(data) {
  setAuth(getToken());
  const res = await api.post('/products', data);
  return res.data;
}

export async function updateProduct(id, data) {
  setAuth(getToken());
  const res = await api.put(`/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id) {
  setAuth(getToken());
  const res = await api.delete(`/products/${id}`);
  return res.data;
}