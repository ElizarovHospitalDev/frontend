import axios from 'axios';
import { isTokenExpired } from '@/utils/jwt';
import store from '@/store';

const API_URL = process.env.VUE_APP_API_URL || 'http://109.120.157.120:8000/v1';

console.log('API URL:', API_URL);

// Create axios instance with timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    const accessToken = store.getters['auth/accessToken'];
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        await store.dispatch('auth/refreshToken');
        
        // Retry the original request with new token
        const accessToken = store.getters['auth/accessToken'];
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        store.dispatch('auth/logout');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  async checkAndRefreshToken() {
    const accessToken = store.getters['auth/accessToken'];
    console.log('Checking token:', { hasAccessToken: !!accessToken });
    
    if (accessToken && isTokenExpired(accessToken)) {
      console.log('Token is expired, attempting refresh');
      try {
        await store.dispatch('auth/refreshToken');
        console.log('Token refresh successful');
        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        store.dispatch('auth/logout');
        return false;
      }
    }
    return true;
  }

  async login(credentials) {
    console.log('AuthService.login called:', { credentials });
    try {
      // Use exact format from API documentation
      const loginData = {
        username: credentials.username,
        password: credentials.password
      };
      console.log('Sending login request with data:', loginData);
      
      const response = await axiosInstance.post('/users/tokens/', loginData);
      console.log('Login response:', response.data);
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user
      };
    } catch (error) {
      console.error('Login error in service:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      throw this.handleError(error);
    }
  }
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

async updateProsthesis(id, prosthesisData) {
  try {
    const response = await axiosInstance.put(`/endoprosthetics/${id}/`, prosthesisData);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}
async createProsthesis(prosthesisData) {
  try {
    const response = await axiosInstance.post('/endoprosthetics/', prosthesisData);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}
async getProsthesisTypes() {
  try {
    const response = await axiosInstance.get('/endoprosthetics/types/');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async getProsthesisVendors() {
  try {
    const response = await axiosInstance.get('/endoprosthetics/vendors/');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async getProsthesisForms() {
  try {
    const response = await axiosInstance.get('/endoprosthetics/forms/');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

  async getCsrfToken() {
    try {
      const response = await axiosInstance.get('/users/csrf/');
      return response.data.csrfToken;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      throw error;
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
        refresh: response.data.refresh,
        user: response.data.user
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPatients() {
    try {
      const response = await axiosInstance.get('/treatments/patients/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteEndoprosthetic(id) {
    try {
      const response = await axiosInstance.delete(`/endoprosthetics/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting endoprosthetic:', error);
      throw this.handleError(error);
    }
  }

  async deletePatient(id) {
    const url = `/treatments/patients/${id}/`;
    try {
      console.log('Starting patient deletion process for ID:', id);
      
      // First, get all endoprosthetics for this patient
      const endoprosthetics = await this.getProstheses();
      console.log('Retrieved endoprosthetics:', endoprosthetics);
      
      if (!Array.isArray(endoprosthetics)) {
        throw new Error('Failed to retrieve endoprosthetics: Invalid response format');
      }
      
      const patientEndoprosthetics = endoprosthetics.filter(ep => {
        const patientId = typeof ep.patient === 'object' ? ep.patient.id : ep.patient;
        console.log('Checking endoprosthetic:', {
          id: ep.id,
          patientId,
          targetId: id,
          matches: patientId === id
        });
        return patientId === id;
      });
      
      console.log('Found endoprosthetics for patient:', patientEndoprosthetics);
      
      // Delete all related endoprosthetics first
      for (const ep of patientEndoprosthetics) {
        console.log(`Attempting to delete endoprosthetic ${ep.id}`);
        try {
          await this.deleteEndoprosthetic(ep.id);
          console.log(`Successfully deleted endoprosthetic ${ep.id}`);
        } catch (deleteError) {
          console.error(`Failed to delete endoprosthetic ${ep.id}:`, deleteError);
          throw new Error(`Failed to delete endoprosthetic ${ep.id}: ${deleteError.message}`);
        }
      }
      
      // Now delete the patient
      console.log('All endoprosthetics deleted, proceeding to delete patient');
      const response = await axiosInstance.delete(url);
      console.log('Patient deletion successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in deletePatient:', error);
      if (error.response) {
        console.error('Server response:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers
        });
      }
      throw this.handleError(error);
    }
  }

  async createPatient(patientData) {
    try {
      const response = await axiosInstance.post('/treatments/patients/', patientData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePatient(id, patientData) {
    try {
      console.log(`Making PUT request to /treatments/patients/${id}/`);
      console.log('Request data:', patientData);
      
      // Make sure we're sending the exact format the API expects
      const cleanedData = {
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        middle_name: patientData.middle_name,
        birthday: patientData.birthday,
        mobile_phone: patientData.mobile_phone,
        // Convert 'F' to 'W' for female gender
        sex: patientData.sex === 'F' ? 'W' : patientData.sex,
        address: patientData.address
      };
      
      console.log('Cleaned data being sent:', cleanedData);
      
      const response = await axiosInstance.put(`/treatments/patients/${id}/`, cleanedData);
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updatePatient:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw this.handleError(error);
    }
  }

  handleError(error) {
    console.log('Handling error:', {
      code: error.code,
      message: error.message,
      response: error.response,
      request: error.request,
      data: error.response?.data
    });

    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Превышено время ожидания ответа от сервера',
        status: 0
      };
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 
                     error.response.data?.detail || 
                     error.response.data?.error ||
                     'Произошла ошибка при выполнении запроса';
      return {
        message,
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
        message: error.message || 'Произошла ошибка при отправке запроса',
        status: -1
      };
    }
  }
}

export default new AuthService();