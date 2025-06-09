import axios from 'axios';
// Service API
export const fetchServices = async () => {
  const { data } = await api.get(`/services/`);
  return data;
};

export const createService = async (service) => {
  const { data } = await api.post(`/services/`, service);
  return data;
};

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
        localStorage.setItem('access', data.access);
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/token/`, {
    username,
    password,
  });
  return response.data;
};

export const fetchCustomers = async () => {
  const { data } = await api.get(`/customers/`);
  return data;
};

export const createCustomer = async (customer) => {
  const { data } = await api.post(`/customers/`, customer);
  return data;
};

export const fetchVehicles = async () => {
  const { data } = await api.get(`/vehicles/`);
  return data;
};

export const createVehicle = async (vehicle) => {
  const { data } = await api.post(`/vehicles/`, vehicle);
  return data;
};

export const fetchWorkOrders = async () => {
  const { data } = await api.get(`/workorders/`);
  return data;
};

export const createWorkOrder = async (workorder) => {
  const { data } = await api.post(`/workorders/`, workorder);
  return data;
};

// Fix endpoint to match backend: workorder-items
export const createWorkOrderItem = async (item) => {
  const { data } = await api.post(`/workorder-items/`, item);
  return data;
};

// Add work order item with part
export const createWorkOrderPartItem = async (item) => {
  // item: { work_order, item_type: 'PART', description, quantity, unit_price, catalog_part }
  const { data } = await api.post(`/workorder-items/`, item);
  return data;
};

export const updateWorkOrder = async (id, data) => {
  const { data: updated } = await api.patch(`/workorders/${id}/`, data);
  return updated;
};

export const deleteWorkOrder = async (id) => {
  await api.delete(`/workorders/${id}/`);
};

export const fetchAppointments = async (params = {}) => {
  const { data } = await api.get('/appointments/', { params });
  return data;
};

export const createAppointment = async (appointment) => {
  // Convert services to array of IDs if not already
  const payload = {
    ...appointment,
    services: Array.isArray(appointment.services)
      ? appointment.services
      : (appointment.services ? [appointment.services] : [])
  };
  const response = await api.post('/appointments/', payload);
  return response.data;
};

export const updateAppointment = async (id, appointment) => {
  // Convert services to array of IDs if not already
  const payload = {
    ...appointment,
    services: Array.isArray(appointment.services)
      ? appointment.services
      : (appointment.services ? [appointment.services] : [])
  };
  const response = await api.patch(`/appointments/${id}/`, payload);
  return response.data;
};

export const deleteAppointment = async (id) => {
  await api.delete(`/appointments/${id}/`);
};

// PARTS INVENTORY API
export const fetchParts = async () => {
  const { data } = await api.get('/parts/');
  return data;
};

export const createPart = async (part) => {
  const { data } = await api.post('/parts/', part);
  return data;
};

export const updatePart = async (id, part) => {
  const { data } = await api.patch(`/parts/${id}/`, part);
  return data;
};

export const adjustPartStock = async (id, payload) => {
  const { data } = await api.post(`/parts/${id}/adjust_stock/`, payload);
  return data;
};

export const deactivatePart = async (id) => {
  await api.patch(`/parts/${id}/`, { is_active: false });
};

// You can add more API functions here as needed
