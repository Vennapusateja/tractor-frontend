import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://tractor-backend-eey5.onrender.com/api';

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default API;