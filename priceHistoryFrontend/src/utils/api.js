import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('[API] Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
};


export const productAPI = {
  addProduct: (url) => api.post('/product/add', { url }),
  getProducts: () => api.get('/product/getAll'),
  deleteProduct: (id) => api.delete(`/product/delete/${id}`),
};

export default api;