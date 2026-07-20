import axios from 'axios';

const API_BASE_URL = 'https://online-food-ordering-system-5-wy4l.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// Menu Items API
// ========================

export const getAllMenuItems = () => api.get('/menu-items');

export const getMenuItemById = (id) => api.get(`/menu-items/${id}`);

export const getMenuItemsByCategory = (category) => api.get(`/menu-items/category/${category}`);

export const searchMenuItems = (name) => api.get(`/menu-items/search?name=${name}`);

export const createMenuItem = (menuItem) => api.post('/menu-items', menuItem);

export const updateMenuItem = (id, menuItem) => api.put(`/menu-items/${id}`, menuItem);

export const deleteMenuItem = (id) => api.delete(`/menu-items/${id}`);

// ========================
// Orders API
// ========================

export const getAllOrders = () => api.get('/orders');

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const createOrder = (orderRequest) => api.post('/orders', orderRequest);

export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });

export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
