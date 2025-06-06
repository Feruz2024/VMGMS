import axios from 'axios';

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

// You can add more API functions here as needed
