import axios from 'axios';

const API_BASE_URL = 'https://online-food-ordering-backend-tq2v.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// Menu Items API
// ========================

export const getAllMenuItems = () => api.get('/api/menu-items');

export const getMenuItemById = (id) => api.get(`/api/menu-items/${id}`);

export const getMenuItemsByCategory = (category) =>
    api.get(`/api/menu-items/category/${category}`);

export const searchMenuItems = (name) =>
    api.get(`/api/menu-items/search?name=${name}`);

export const createMenuItem = (menuItem) =>
    api.post('/api/menu-items', menuItem);

export const updateMenuItem = (id, menuItem) =>
    api.put(`/api/menu-items/${id}`, menuItem);

export const deleteMenuItem = (id) =>
    api.delete(`/api/menu-items/${id}`);

// ========================
// Orders API
// ========================

export const getAllOrders = () => api.get('/api/orders');

export const getOrderById = (id) => api.get(`/api/orders/${id}`);

export const createOrder = (orderRequest) =>
    api.post('/api/orders', orderRequest);

export const updateOrderStatus = (id, status) =>
    api.put(`/api/orders/${id}`, { status });

export const deleteOrder = (id) =>
    api.delete(`/api/orders/${id}`);

export default api;