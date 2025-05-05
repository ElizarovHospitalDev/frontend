import axios from 'axios';
import { isTokenExpired } from '@/utils/jwt';
import store from '@/store';

const API_URL = process.env.VUE_APP_API_URL || 'http://109.120.157.120:8000/v1';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = store.getters['auth/accessToken'];
    
    if (accessToken) {
      // Check if token is expired
      if (isTokenExpired(accessToken)) {
        try {
          // Try to refresh the token
          await store.dispatch('auth/refreshToken');
        } catch (error) {
          // If refresh fails, redirect to login
          store.dispatch('auth/logout');
          window.location.href = '/';
          return Promise.reject(error);
        }
      }
      
      // Add token to request headers
      config.headers.Authorization = `Bearer ${store.getters['auth/accessToken']}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await store.dispatch('auth/refreshToken');
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${store.getters['auth/accessToken']}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        store.dispatch('auth/logout');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/users/tokens/', credentials);
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async confirmPasswordReset(data) {
    try {
      const response = await axiosInstance.post('/users/password/reset/confirm/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axiosInstance.post('/users/token/refresh/', {
        refresh: refreshToken
      });
      return {
        access: response.data.access,
        refresh: response.data.refresh
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        message: error.response.data.message || 'Произошла ошибка при выполнении запроса',
        status: error.response.status
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'Сервер не отвечает. Пожалуйста, попробуйте позже',
        status: 0
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: 'Произошла ошибка при отправке запроса',
        status: -1
      };
    }
  }
}

export default new AuthService(); 