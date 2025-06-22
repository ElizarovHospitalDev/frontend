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

  // ==================== Auth Methods ====================
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


  async getOperationStages() {
    try {
      const response = await axiosInstance.get('/treatments/operations-stages/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  // ==================== Patient Methods ====================
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
      this.cache.patients = null;
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePatient(id, patientData) {
    try {
      const response = await axiosInstance.put(`/treatments/patients/${id}/`, patientData);
      this.cache.patients = null;
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePatient(id) {
    const url = `/treatments/patients/${id}/`;
    try {
      // First, get all endoprosthetics for this patient
      const endoprosthetics = await this.getProstheses();
      
      if (!Array.isArray(endoprosthetics)) {
        throw new Error('Failed to retrieve endoprosthetics: Invalid response format');
      }
      
      const patientEndoprosthetics = endoprosthetics.filter(ep => {
        const patientId = typeof ep.patient === 'object' ? ep.patient.id : ep.patient;
        return patientId === id;
      });
      
      // Delete all related endoprosthetics first
      for (const ep of patientEndoprosthetics) {
        try {
          await this.deleteProsthesis(ep.id);
        } catch (deleteError) {
          console.error(`Failed to delete endoprosthetic ${ep.id}:`, deleteError);
          throw new Error(`Failed to delete endoprosthetic ${ep.id}: ${deleteError.message}`);
        }
      }
      
      // Now delete the patient
      const response = await axiosInstance.delete(url);
      this.cache.patients = null;
      return response.data;
    } catch (error) {
      console.error('Error in deletePatient:', error);
      throw this.handleError(error);
    }
  }

  // ==================== Prosthesis Methods ====================
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

  // ==================== Reference Data Methods ====================
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

  async createProsthesisType(data) {
    try {
      const response = await axiosInstance.post('/endoprosthetics/types/', data);
      this.cache.prosthesisTypes = null;
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProsthesisVendor(data) {
    try {
      const response = await axiosInstance.post('/endoprosthetics/vendors/', data);
      this.cache.prosthesisVendors = null;
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProsthesisForm(data) {
    try {
      const response = await axiosInstance.post('/endoprosthetics/forms/', data);
      this.cache.prosthesisForms = null;
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

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

  // ==================== Treatment Methods ====================
  async getTreatments(params = {}) {
    try {
      const response = await axiosInstance.get('/treatments/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTreatment(id) {
    try {
      const response = await axiosInstance.get(`/treatments/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTreatment(data) {
    try {
      const response = await axiosInstance.post('/treatments/', {
        reason: data.reason,
        form: data.form,
        therapy: data.therapy || '',
        form_pjl: data.form_pjl || '',
        local_status: data.local_status || '',
        thigh_defect: data.thigh_defect || '',
        shin_defect: data.shin_defect || '',
        therapy_option: data.therapy_option || '',
        patient: data.patient
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTreatment(id, data) {
    try {
      const response = await axiosInstance.put(`/treatments/${id}/`, {
        reason: data.reason,
        form: data.form,
        therapy: data.therapy || '',
        form_pjl: data.form_pjl || '',
        local_status: data.local_status || '',
        thigh_defect: data.thigh_defect || '',
        shin_defect: data.shin_defect || '',
        therapy_option: data.therapy_option || '',
        patient: data.patient
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTreatment(id) {
    try {
      await axiosInstance.delete(`/treatments/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== Comorbid Pathologies Methods ====================
  async getComorbidPathologies() {
    try {
      const response = await axiosInstance.get('/treatments/comobrid-pathologies/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComorbidPathology(id) {
    try {
      const response = await axiosInstance.get(`/treatments/comobrid-pathologies/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createComorbidPathology(data) {
    try {
      const response = await axiosInstance.post('/treatments/comobrid-pathologies/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateComorbidPathology(id, data) {
    try {
      const response = await axiosInstance.put(`/treatments/comobrid-pathologies/${id}/`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteComorbidPathology(id) {
    try {
      await axiosInstance.delete(`/treatments/comobrid-pathologies/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== Microflora Methods ====================
  async getMicrofloras() {
    try {
      const response = await axiosInstance.get('/treatments/microfloras/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMicroflora(id) {
    try {
      const response = await axiosInstance.get(`/treatments/microfloras/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMicroflora(data) {
    try {
      const response = await axiosInstance.post('/treatments/microfloras/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMicroflora(id, data) {
    try {
      const response = await axiosInstance.put(`/treatments/microfloras/${id}/`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMicroflora(id) {
    try {
      await axiosInstance.delete(`/treatments/microfloras/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== Surgical Interventions Methods ====================
  async getSurgicalInterventions() {
    try {
      const response = await axiosInstance.get('/treatments/surgical-interventions/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSurgicalIntervention(id) {
    try {
      const response = await axiosInstance.get(`/treatments/surgical-interventions/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createSurgicalIntervention(data) {
    try {
      const response = await axiosInstance.post('/treatments/surgical-interventions/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSurgicalIntervention(id, data) {
    try {
      const response = await axiosInstance.put(`/treatments/surgical-interventions/${id}/`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteSurgicalIntervention(id) {
    try {
      await axiosInstance.delete(`/treatments/surgical-interventions/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== Analysis Methods ====================
  async getAnalysisDatas() {
    try {
      const response = await axiosInstance.get('/treatments/analysis-datas/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAnalysisData(id) {
    try {
      const response = await axiosInstance.get(`/treatments/analysis-datas/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createAnalysisData(data) {
    try {
      const response = await axiosInstance.post('/treatments/analysis-datas/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateAnalysisData(id, data) {
    try {
      const response = await axiosInstance.put(`/treatments/analysis-datas/${id}/`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteAnalysisData(id) {
    try {
      await axiosInstance.delete(`/treatments/analysis-datas/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== Treatment Outcomes Methods ====================
  async getTreatmentOutcomes() {
    try {
      const response = await axiosInstance.get('/treatments/outcome/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTreatmentOutcome(id) {
    try {
      const response = await axiosInstance.get(`/treatments/outcome/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTreatmentOutcome(data) {
    try {
      const response = await axiosInstance.post('/treatments/outcome/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTreatmentOutcome(id, data) {
    try {
      const response = await axiosInstance.put(`/treatments/outcome/${id}/`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTreatmentOutcome(id) {
    try {
      await axiosInstance.delete(`/treatments/outcome/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== Arthroplasty Methods ====================
  async getArthroplastyForms() {
    try {
      const response = await axiosInstance.get('/treatments/arthroplasty_form/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getArthroplastyForm(id) {
    try {
      const response = await axiosInstance.get(`/treatments/arthroplasty_form/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createArthroplastyForm(data) {
    try {
      const response = await axiosInstance.post('/treatments/arthroplasty_form/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateArthroplastyForm(id, data) {
    try {
      const response = await axiosInstance.put(`/treatments/arthroplasty_form/${id}/`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteArthroplastyForm(id) {
    try {
      await axiosInstance.delete(`/treatments/arthroplasty_form/${id}/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== Helper Methods ====================
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