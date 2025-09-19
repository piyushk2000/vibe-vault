import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_END_POINT } from '../constants';

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_END_POINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // Always use Bearer format for tokens
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      // Could redirect to login page here if needed
    }
    return Promise.reject(error);
  }
);

// Generic GET request function
export const get = async <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T | null> => {
  try {
    const response: AxiosResponse<T> = await api.get(url, { 
      ...config,
      params 
    });
    return response.data;
  } catch (error) {
    console.error(`Error making GET request to ${url}:`, error);
    return null;
  }
};

// Generic POST request function
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | null> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error making POST request to ${url}:`, error);
    return null;
  }
};

// Generic PUT request function
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | null> => {
  try {
    const response: AxiosResponse<T> = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error making PUT request to ${url}:`, error);
    return null;
  }
};

// Generic DELETE request function
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T | null> => {
  try {
    const response: AxiosResponse<T> = await api.delete(url, config);
    return response.data;
  } catch (error) {
    console.error(`Error making DELETE request to ${url}:`, error);
    return null;
  }
};

export default api;
