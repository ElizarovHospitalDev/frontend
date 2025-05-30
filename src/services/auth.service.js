import axios from 'axios';
import { isTokenExpired } from '@/utils/jwt';
import store from '@/store';

const API_URL = process.env.VUE_APP_API_URL || 'http://109.120.157.120:8000/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = store.getters['auth/accessToken'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await store.dispatch('auth/refreshToken');
        const newToken = store.getters['auth/accessToken'];
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await store.dispatch('auth/logout');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  constructor() {
    this.cache = {
      prosthesisTypes: null,
      prosthesisVendors: null,
      prosthesisForms: null,
      patients: null
    };
  }

  // Auth methods
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/users/tokens/', {
        username: credentials.username,
        password: credentials.password
      });
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axiosInstance.post('/users/token/refresh/', {
        refresh: refreshToken
      });
      return response.data.access;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await axiosInstance.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async checkAndRefreshToken() {
    const token = store.getters['auth/accessToken'];
    if (!token) return false;
    
    if (isTokenExpired(token)) {
      try {
        await store.dispatch('auth/refreshToken');
        return true;
      } catch (error) {
        await store.dispatch('auth/logout');
        return false;
      }
    }
    return true;
  }

  // Patient methods
  async getPatients() {
    if (this.cache.patients) {
      return this.cache.patients;
    }

    try {
      const response = await axiosInstance.get('/treatments/patients/');
      this.cache.patients = response.data;
      return this.cache.patients;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPatient(id) {
    try {
      const response = await axiosInstance.get(`/treatments/patients/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPatient(patientData) {
    try {
      const response = await axiosInstance.post('/treatments/patients/', patientData);
      this.cache.patients = null; // Invalidate cache
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePatient(id, patientData) {
    try {
      const response = await axiosInstance.put(`/treatments/patients/${id}/`, patientData);
      this.cache.patients = null; // Invalidate cache
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Prosthesis methods
  async getProstheses() {
    try {
      const response = await axiosInstance.get('/endoprosthetics/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProsthesis(id) {
    try {
      const response = await axiosInstance.get(`/endoprosthetics/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async saveProsthesis(data, id = null) {
    try {
      if (!(await this.checkAndRefreshToken())) {
        throw new Error('Authentication failed');
      }

      // Prepare data according to API schema
      const requestData = {
        type: await this.resolveTypeId(data.type),
        vendor: data.vendor ? await this.resolveVendorId(data.vendor) : null,
        batch: data.batch || null,
        date: this.formatDateForAPI(data.date),
        form: data.form ? await this.resolveFormId(data.form) : null,
        stable: Boolean(data.stable),
        patient: Number(data.patient)
      };

      if (id) {
        return await this.updateProsthesis(id, requestData);
      } else {
        return await this.createProsthesis(requestData);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProsthesis(data) {
    try {
      const response = await axiosInstance.post('/endoprosthetics/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProsthesis(id, data) {
    try {
      const response = await axiosInstance.put(`/endoprosthetics/${id}/`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProsthesis(id) {
    try {
      await axiosInstance.delete(`/endoprosthetics/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reference data methods
  async getProsthesisTypes() {
    if (this.cache.prosthesisTypes) {
      return this.cache.prosthesisTypes;
    }

    try {
      const response = await axiosInstance.get('/endoprosthetics/types/');
      this.cache.prosthesisTypes = response.data;
      return this.cache.prosthesisTypes;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProsthesisVendors() {
    if (this.cache.prosthesisVendors) {
      return this.cache.prosthesisVendors;
    }

    try {
      const response = await axiosInstance.get('/endoprosthetics/vendors/');
      this.cache.prosthesisVendors = response.data;
      return this.cache.prosthesisVendors;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProsthesisForms() {
    if (this.cache.prosthesisForms) {
      return this.cache.prosthesisForms;
    }

    try {
      const response = await axiosInstance.get('/endoprosthetics/forms/');
      this.cache.prosthesisForms = response.data;
      return this.cache.prosthesisForms;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper methods
  async resolveTypeId(type) {
    if (!type) return null;
    if (typeof type === 'number') return type;
    
    const types = await this.getProsthesisTypes();
    const found = types.find(t => t.id === type || t.name === type);
    return found?.id || null;
  }

  async resolveVendorId(vendor) {
    if (!vendor) return null;
    if (typeof vendor === 'number') return vendor;
    
    const vendors = await this.getProsthesisVendors();
    const found = vendors.find(v => v.id === vendor || v.name === vendor);
    return found?.id || null;
  }

  async resolveFormId(form) {
    if (!form) return null;
    if (typeof form === 'number') return form;
    
    const forms = await this.getProsthesisForms();
    const found = forms.find(f => f.id === form || f.name === form);
    return found?.id || null;
  }

  formatDateForAPI(date) {
    if (!date) return null;
    if (typeof date === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return null;
  }

  handleError(error) {
    console.error('API Error:', error);
    
    if (error.response) {
      const { data, status } = error.response;
      let message = 'Request failed';
      let details = [];

      if (typeof data === 'string') {
        message = data;
      } else if (data?.detail) {
        message = data.detail;
      } else if (data?.message) {
        message = data.message;
      } else if (Array.isArray(data)) {
        message = 'Validation errors';
        details = data;
      } else if (typeof data === 'object') {
        message = 'Validation errors';
        details = Object.entries(data).map(
          ([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
        );
      }

      return {
        message,
        details,
        status,
        data
      };
    }

    if (error.request) {
      return {
        message: 'No response from server',
        status: 0
      };
    }

    return {
      message: error.message || 'Request setup failed',
      status: -1
    };
  }
}

export default new AuthService();