<template>
  <div class="treatment-page">
    <div class="header">
      <div class="header-content">
        <img src="@/assets/2025-03-10_18-35-17-picaai-Photoroom-1.png" alt="Logo" class="logo">
        <h1>ЦИФРОВОЙ РЕГИСТР ПАЦИЕНТОВ ЦЕНТРА ИЛИЗАРОВА</h1>
      </div>
      <button class="logout-btn" @click="logout">Выход</button>
    </div>
    
    <div class="content">
      <div class="sidebar">
        <div class="menu-item" @click="goToPatient">Пациент</div>
        <div class="menu-item" @click="goToProsthesis">Протез</div>
        <div class="menu-item active">Лечение</div>
        <div class="menu-item" @click="goToComorbidPathologies">Коморбидные патологии</div>
        <div class="menu-item" @click="goToMicroflora">Микрофлора</div>
        <div class="menu-item" @click="goToOperations">Операции</div>
        <div class="menu-item" @click="goToAnalysis">Анализы</div>
        <div class="menu-item" @click="goToOutcomes">Итоги лечения</div>
        
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          Назад
        </button>
      </div>
      
      <div class="main-content">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по причине артропластики или варианту лечения" 
            class="search-input"
            @input="handleSearch"
          >
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-search-btn"
          >
            ×
          </button>
          <button class="search-btn" @click="handleSearch">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#666"/>
            </svg>
          </button>
        </div>
        
        <div class="treatment-actions">
          <button class="add-btn" @click="startAdding">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Добавить лечение
          </button>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных о лечении...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="treatment-list">
          <div v-if="filteredTreatments.length === 0" class="no-treatment">
            <h2 v-if="searchQuery">Ничего не найдено</h2>
            <h2 v-else>Данные о лечении отсутствуют</h2>
            <p v-if="searchQuery">Попробуйте изменить параметры поиска</p>
            <p v-else>Для этого пациента нет информации о лечении.</p>
          </div>
          
          <div 
            v-for="(treatment, index) in filteredTreatments" 
            :key="treatment.id" 
            class="treatment-item"
          >
            <div class="treatment-header">
              <h3>Лечение #{{ index + 1 }}</h3>
              <div class="treatment-actions">
                <button class="edit-btn" @click="startEditing(treatment)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  Редактировать
                </button>
                <button class="delete-btn" @click="confirmDelete(treatment.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <div class="info-section">
              <div class="info-row">
                <div class="info-label">Причина артропластики:</div>
                <div class="info-value">{{ getReasonName(treatment.reason) }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Вид артропластики:</div>
                <div class="info-value">{{ getArthroplastyFormName(treatment.form) || 'Не указан' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Вид ППИ:</div>
                <div class="info-value">{{ getPjlTypeName(treatment.form_pjl) || 'Не указан' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Локальный статус:</div>
                <div class="info-value">{{ getLocalStatusName(treatment.local_status) || 'Не указан' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Дефект бедра по AORI:</div>
                <div class="info-value">{{ getAoriDefectName(treatment.thigh_defect) || 'Не указан' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Дефект голени по AORI:</div>
                <div class="info-value">{{ getAoriDefectName(treatment.shin_defect) || 'Не указан' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Вариант лечения:</div>
                <div class="info-value">{{ getTreatmentOptionName(treatment.therapy_option) || 'Не указан' }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isEditing" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingTreatmentId ? 'Редактирование лечения' : 'Добавление лечения' }}</h2>
            
            <form @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label for="reason">Причина артропластики *</label>
                <select 
                  id="reason" 
                  v-model="editForm.reason" 
                  required
                  :class="{ 'error-field': errors.reason }"
                >
                  <option value="" disabled>Выберите причину</option>
                  <option value="травма">Травма</option>
                  <option value="гонартроз">Гонартроз</option>
                  <option value="дисплазия">Дисплазия</option>
                  <option value="онкология">Онкология</option>
                </select>
                <span v-if="errors.reason" class="error-message">{{ errors.reason }}</span>
              </div>
              
              <div class="form-group">
                <label for="form">Вид артропластики *</label>
                <select 
                  id="form" 
                  v-model="editForm.form" 
                  required
                  :class="{ 'error-field': errors.form }"
                >
                  <option value="" disabled>Выберите вид</option>
                  <option v-for="form in arthroplastyForms" 
                          :key="form.id" 
                          :value="form.id">
                    {{ form.name }}
                  </option>
                </select>
                <span v-if="errors.form" class="error-message">{{ errors.form }}</span>
              </div>
              
              <div class="form-group">
                <label for="form_pjl">Вид ППИ</label>
                <select 
                  id="form_pjl" 
                  v-model="editForm.form_pjl"
                >
                  <option value="" disabled>Выберите вид ППИ</option>
                  <option value="острая">Острая</option>
                  <option value="хроническая">Хроническая</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="local_status">Локальный статус</label>
                <select 
                  id="local_status" 
                  v-model="editForm.local_status"
                >
                  <option value="" disabled>Выберите локальный статус</option>
                  <option value="свищ">Свищ</option>
                  <option value="открытая рана">Открытая рана</option>
                  <option value="рана со швами">Рана со швами</option>
                  <option value="без дефектов">Без дефектов</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="thigh_defect">Дефект бедра по AORI (F)</label>
                <select 
                  id="thigh_defect" 
                  v-model="editForm.thigh_defect"
                >
                  <option value="" disabled>Выберите дефект</option>
                  <option value="1">Тип 1</option>
                  <option value="2а">Тип 2а</option>
                  <option value="2b">Тип 2b</option>
                  <option value="3">Тип 3</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="shin_defect">Дефект голени по AORI (T)</label>
                <select 
                  id="shin_defect" 
                  v-model="editForm.shin_defect"
                >
                  <option value="" disabled>Выберите дефект</option>
                  <option value="1">Тип 1</option>
                  <option value="2а">Тип 2а</option>
                  <option value="2b">Тип 2b</option>
                  <option value="3">Тип 3</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="therapy_option">Вариант лечения</label>
                <select 
                  id="therapy_option" 
                  v-model="editForm.therapy_option"
                >
                  <option value="" disabled>Выберите вариант</option>
                  <option value="дебридмент">Дебридмент</option>
                  <option value="одноэтапное">Одноэтапное</option>
                  <option value="двухэтапное">Двухэтапное</option>
                  <option value="артродез">Артродез</option>
                  <option value="ампутация">Ампутация</option>
                </select>
              </div>
              
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="cancelEditing">Отмена</button>
                <button type="submit" class="save-btn" :disabled="saving">
                  {{ saving ? 'Сохранение...' : 'Сохранить' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import authService from '@/services/auth.service';
import debounce from 'lodash/debounce';

export default {
  name: 'PatientTreatment',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      treatments: [],
      loading: true,
      error: null,
      isEditing: false,
      editingTreatmentId: null,
      saving: false,
      searchQuery: '',
      errors: {},
      prostheses: [],
      prosthesisTypes: [],
      prosthesisVendors: [],
      prosthesisForms: [],
      arthroplastyForms: [],
      
      editForm: {
        reason: null,
        form: null,
        form_pjl: null,
        local_status: null,
        thigh_defect: null,
        shin_defect: null,
        therapy_option: null,
        patient: null
      }
    };
  },
  computed: {
    filteredTreatments() {
      if (!this.searchQuery) return this.treatments;

      const query = this.searchQuery.toLowerCase();
      return this.treatments.filter(treatment => {
        return (
          this.getReasonName(treatment.reason)?.toLowerCase().includes(query) ||
          this.getArthroplastyFormName(treatment.form)?.toLowerCase().includes(query) ||
          this.getPjlTypeName(treatment.form_pjl)?.toLowerCase().includes(query) ||
          this.getLocalStatusName(treatment.local_status)?.toLowerCase().includes(query) ||
          this.getAoriDefectName(treatment.thigh_defect)?.toLowerCase().includes(query) ||
          this.getAoriDefectName(treatment.shin_defect)?.toLowerCase().includes(query) ||
          this.getTreatmentOptionName(treatment.therapy_option)?.toLowerCase().includes(query)
        );
      });
    }
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    getArthroplastyFormName(id) {
      if (!id) return 'Не указан';
      const form = this.arthroplastyForms.find(f => f.id === Number(id));
      return form ? form.name : 'Неизвестная форма';
    },
    
    getReasonName(reason) {
      const reasons = {
        'травма': 'Травма',
        'гонартроз': 'Гонартроз',
        'дисплазия': 'Дисплазия',
        'онкология': 'Онкология'
      };
      return reasons[reason] || 'Не указано';
    },
    
    getFormName(formId) {
      const forms = {
        1: "Первичная",
        2: "Ревизионная"
      };
      return forms[formId] || null;
    },
    
    getPjlTypeName(type) {
      if (!type) return null;
      return type === 'острая' ? 'Острая' : 
             type === 'хроническая' ? 'Хроническая' : 
             type;
    },
    
    getLocalStatusName(status) {
      if (!status) return null;
      return status === 'свищ' ? 'Свищ' : 
             status === 'открытая рана' ? 'Открытая рана' : 
             status === 'рана со швами' ? 'Рана со швами' : 
             status === 'без дефектов' ? 'Без дефектов' : 
             status;
    },
    
    getAoriDefectName(defect) {
      if (!defect) return null;
      return defect === '1' ? 'Тип 1' : 
             defect === '2а' ? 'Тип 2а' : 
             defect === '2b' ? 'Тип 2b' : 
             defect === '3' ? 'Тип 3' : 
             defect;
    },
    
    getTreatmentOptionName(option) {
      if (!option) return null;
      return option === 'дебридмент' ? 'Дебридмент' : 
             option === 'одноэтапное' ? 'Одноэтапное' : 
             option === 'двухэтапное' ? 'Двухэтапное' : 
             option === 'артродез' ? 'Артродез' : 
             option === 'ампутация' ? 'Ампутация' : 
             option;
    },
    
    async loadInitialData() {
      this.loading = true;
      try {
        const [prostheses, types, vendors, forms, arthroplastyForms] = await Promise.all([
          authService.getProstheses(),
          authService.getProsthesisTypes(),
          authService.getProsthesisVendors(),
          authService.getProsthesisForms(),
          authService.getArthroplastyTypes()
        ]);
        
        this.prostheses = prostheses;
        this.prosthesisTypes = types;
        this.prosthesisVendors = vendors;
        this.prosthesisForms = forms;
        this.arthroplastyForms = arthroplastyForms;

        await this.fetchTreatments();
      } catch (error) {
        this.handleApiError(error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchTreatments() {
      try {
        const response = await authService.getTreatments();
        this.treatments = response.filter(t => String(t.patient) === String(this.patientId));
      } catch (error) {
        this.handleApiError(error);
      }
    },
    
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.editForm.reason) {
        this.errors.reason = 'Выберите причину артропластики';
        isValid = false;
      }

      if (!this.editForm.form) {
        this.errors.form = 'Выберите вид артропластики';
        isValid = false;
      }

      return isValid;
    },
    
    async saveChanges() {
      if (!this.validateForm()) return;

      this.saving = true;
      try {
        const treatmentData = {
          reason: this.editForm.reason,
          form: this.editForm.form,
          therapy: this.editForm.therapy || '',
          form_pjl: this.editForm.form_pjl || '',
          local_status: this.editForm.local_status || '',
          thigh_defect: this.editForm.thigh_defect || '',
          shin_defect: this.editForm.shin_defect || '',
          therapy_option: this.editForm.therapy_option || '',
          patient: this.patientId
        };

        if (this.editingTreatmentId) {
          await authService.updateTreatment(this.editingTreatmentId, treatmentData);
        } else {
          await authService.createTreatment(treatmentData);
        }

        await this.fetchTreatments();
        this.isEditing = false;
      } catch (error) {
        this.handleApiError(error);
      } finally {
        this.saving = false;
      }
    },
    
    handleApiError(error) {
      if (error.response?.status === 401) {
        this.logout();
      } else {
        this.error = error.response?.data?.message || error.message || 'Ошибка запроса';
      }
    },
    
    startAdding() {
      this.editForm = {
        reason: null,
        form: null,
        form_pjl: null,
        local_status: null,
        thigh_defect: null,
        shin_defect: null,
        therapy_option: null,
        patient: this.patientId
      };
      this.editingTreatmentId = null;
      this.isEditing = true;
      this.errors = {};
    },
    
    startEditing(treatment) {
      this.editForm = {
        reason: treatment.reason || '',
        form: treatment.form,
        form_pjl: treatment.form_pjl,
        local_status: treatment.local_status,
        thigh_defect: treatment.thigh_defect,
        shin_defect: treatment.shin_defect,
        therapy_option: treatment.therapy_option,
        patient: this.patientId
      };
      this.editingTreatmentId = treatment.id;
      this.isEditing = true;
      this.errors = {};
    },
    
    cancelEditing() {
      this.isEditing = false;
      this.errors = {};
    },
    
    async confirmDelete(id) {
      if (confirm('Вы уверены, что хотите удалить это лечение?')) {
        try {
          await authService.deleteTreatment(id);
          await this.fetchTreatments();
        } catch (error) {
          this.handleApiError(error);
        }
      }
    },
    
    goToPatient() {
      this.$router.push({ name: 'PatientDetail', params: { id: this.patientId } });
    },
    goToProsthesis() {
      this.$router.push({ name: 'ProsthesisInfo', params: { id: this.patientId } });
    },
    goToComorbidPathologies() {
      this.$router.push({ name: 'PatientComorbidPathologies', params: { id: this.patientId } });
    },
    goToMicroflora() {
      this.$router.push({ name: 'PatientMicroflora', params: { id: this.patientId } });
    },
    goToOperations() {
      this.$router.push({ name: 'PatientOperations', params: { id: this.patientId } });
    },
    goToAnalysis() {
      this.$router.push({ name: 'PatientAnalysis', params: { id: this.patientId } });
    },
    goToOutcomes() {
      this.$router.push({ name: 'PatientOutcomes', params: { id: this.patientId } });
    },
    goBack() {
      this.$router.push('/patients');
    },
    
    logout() {
      this.logoutAction().then(() => {
        this.$router.push('/');
      });
    },
    
    handleSearch: debounce(function() {
    }, 300),
    
    clearSearch() {
      this.searchQuery = '';
    }
  },
  created() {
    this.loadInitialData();
  },
  watch: {
    patientId() {
      this.loadInitialData();
    }
  }
};
</script>

<style scoped>
.treatment-page {
  font-family: "JetBrains Mono", Helvetica, Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e6eec6;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  height: 40px;
  width: auto;
}

.header h1 {
  font-size: 18px;
  color: #666;
  margin: 0;
  font-weight: normal;
}

.logout-btn {
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
}

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px;
  background-color: #f8f8f8;
  border-right: 1px solid #e6eec6;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #333;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.menu-item.active {
  border-left-color: #9ac531;
  background-color: #f0f0f0;
  font-weight: 600;
}

.back-btn {
  margin-top: auto;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e6eec6;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  color: #333;
}

.back-icon {
  font-size: 18px;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #e6eec6;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  padding-right: 40px;
  border: none;
  outline: none;
  font-size: 16px;
}

.clear-search-btn {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 18px;
  padding: 0 8px;
}

.search-btn {
  background: none;
  border: none;
  padding: 0 16px;
  cursor: pointer;
}

.treatment-actions {
  margin-bottom: 30px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #7fa11e;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #ff4444;
}

.no-treatment {
  text-align: center;
  padding: 40px 20px;
}

.no-treatment h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-treatment p {
  color: #666;
  margin-bottom: 20px;
}

.treatment-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.treatment-item {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
}

.treatment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.treatment-header h3 {
  margin: 0;
  color: #333;
}

.treatment-actions {
  display: flex;
  gap: 10px;
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #7fa11e;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #cc0000;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-label {
  width: 200px;
  font-weight: 600;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.edit-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn {
  padding: 10px 16px;
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn:hover {
  background: #7fa11e;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>