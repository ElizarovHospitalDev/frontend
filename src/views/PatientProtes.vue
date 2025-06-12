<template>
  <div class="prosthesis-detail-page">
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
        <div class="menu-item active">Протез</div>
        <div class="menu-item" @click="goToTreatment">Лечение</div>
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
            placeholder="Поиск по типу, производителю, партии или дате" 
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
        
        <div class="prosthesis-actions">
          <button class="add-btn" @click="startAdding">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Добавить протез
          </button>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных протезов...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="prosthesis-list">
          <div v-if="filteredProstheses.length === 0" class="no-prosthesis">
            <h2 v-if="searchQuery">Ничего не найдено</h2>
            <h2 v-else>Данные о протезах отсутствуют</h2>
            <p v-if="searchQuery">Попробуйте изменить параметры поиска</p>
            <p v-else>Для этого пациента нет информации о протезах.</p>
          </div>
          
          <div 
            v-for="(prosthesis, index) in filteredProstheses" 
            :key="prosthesis.id" 
            class="prosthesis-item"
          >
            <div class="prosthesis-header">
              <h3>Протез #{{ index + 1 }}</h3>
              <div class="prosthesis-actions">
                <button class="edit-btn" @click="startEditing(prosthesis)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  Редактировать
                </button>
                <button class="delete-btn" @click="confirmDelete(prosthesis.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Вид:</div>
              <div class="info-value">{{ getProsthesisTypeName(prosthesis.type) || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Производитель:</div>
              <div class="info-value">{{ getProsthesisVendorName(prosthesis.vendor) || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Партия:</div>
              <div class="info-value">{{ prosthesis.batch || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Дата установки:</div>
              <div class="info-value">{{ formatDate(prosthesis.date) || 'Не указана' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Форма:</div>
              <div class="info-value">{{ getProsthesisFormName(prosthesis.form) || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Стабильность:</div>
              <div class="info-value">{{ prosthesisStabilityName(prosthesis.stable) || 'Не указана' }}</div>
            </div>
          </div>
        </div>

        <div v-if="isEditing" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingProsthesisId ? 'Редактирование протеза' : 'Добавление нового протеза' }}</h2>
            
            <form @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label for="type">Вид эндопротеза *</label>
                <select id="type" v-model="editForm.type" required>
                  <option value="" disabled>Выберите вид</option>
                  <option v-for="type in prosthesisTypes" 
                          :key="type.id" 
                          :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="vendor">Производитель</label>
                <select id="vendor" v-model="editForm.vendor">
                  <option value="" disabled>Выберите производителя</option>
                  <option v-for="vendor in prosthesisVendors" 
                          :key="vendor.id" 
                          :value="vendor.id">
                    {{ vendor.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="batch">Партия</label>
                <input id="batch" v-model="editForm.batch" type="text" placeholder="Введите номер партии">
              </div>
              
              <div class="form-group">
                <label for="date">Дата установки *</label>
                <input id="date" v-model="editForm.date" type="date" required>
              </div>
              
              <div class="form-group">
                <label for="form">Форма</label>
                <select id="form" v-model="editForm.form">
                  <option value="" disabled>Выберите форму</option>
                  <option v-for="form in prosthesisForms" 
                          :key="form.id" 
                          :value="form.id">
                    {{ form.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="stable">Стабильность *</label>
                <select id="stable" v-model="editForm.stable" required>
                  <option value="" disabled>Выберите стабильность</option>
                  <option :value="true">Стабилен</option>
                  <option :value="false">Нестабилен</option>
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
  name: 'PatientProtes',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      prostheses: [],
      loading: true,
      error: null,
      isEditing: false,
      editingProsthesisId: null,
      saving: false,
      searchQuery: '',
      editForm: {
        type: '',
        vendor: '',
        batch: '',
        date: '',
        form: '',
        stable: '',
        patient: null
      },
      prosthesisTypes: [],
      prosthesisVendors: [],
      prosthesisForms: []
    };
  },
  computed: {
    filteredProstheses() {
      if (!this.searchQuery) return this.prostheses;
      
      const query = this.searchQuery.toLowerCase();
      return this.prostheses.filter(prosthesis => {
        return (
          (prosthesis.batch && prosthesis.batch.toLowerCase().includes(query)) ||
          (this.getProsthesisTypeName(prosthesis.type) && 
            this.getProsthesisTypeName(prosthesis.type).toLowerCase().includes(query)) ||
          (this.getProsthesisVendorName(prosthesis.vendor) && 
            this.getProsthesisVendorName(prosthesis.vendor).toLowerCase().includes(query)) ||
          (prosthesis.date && this.formatDate(prosthesis.date).toLowerCase().includes(query))
        );
      });
    }
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    async loadReferenceData() {
      try {
        const [types, vendors, forms] = await Promise.all([
          authService.getProsthesisTypes(),
          authService.getProsthesisVendors(),
          authService.getProsthesisForms()
        ]);
        
        this.prosthesisTypes = types;
        this.prosthesisVendors = vendors;
        this.prosthesisForms = forms;
      } catch (error) {
        console.error('Ошибка загрузки справочных данных:', error);
        this.error = 'Ошибка загрузки справочных данных';
      }
    },
    
    async fetchProstheses() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authService.getProstheses();
        this.prostheses = response.filter(p => String(p.patient) === String(this.patientId));
      } catch (error) {
        console.error('Ошибка загрузки данных протезов:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка загрузки данных';
        
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    getProsthesisTypeName(typeId) {
      const type = this.prosthesisTypes.find(t => t.id === typeId);
      return type ? type.name : null;
    },
    
    getProsthesisVendorName(vendorId) {
      const vendor = this.prosthesisVendors.find(v => v.id === vendorId);
      return vendor ? vendor.name : null;
    },
    
    getProsthesisFormName(formId) {
      const form = this.prosthesisForms.find(f => f.id === formId);
      return form ? form.name : null;
    },
    
    prosthesisStabilityName(stable) {
      if (stable === true) return 'Стабилен';
      if (stable === false) return 'Нестабилен';
      return null;
    },
    
    formatDate(dateString) {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    },
    
    startAdding() {
      this.editForm = {
        type: '',
        vendor: '',
        batch: '',
        date: '',
        form: '',
        stable: '',
        patient: this.patientId
      };
      this.editingProsthesisId = null;
      this.isEditing = true;
    },
    
    startEditing(prosthesis) {
      this.editForm = {
        type: prosthesis.type,
        vendor: prosthesis.vendor,
        batch: prosthesis.batch,
        date: prosthesis.date ? prosthesis.date.split('T')[0] : '',
        form: prosthesis.form,
        stable: prosthesis.stable,
        patient: this.patientId
      };
      this.editingProsthesisId = prosthesis.id;
      this.isEditing = true;
    },
    
    async saveChanges() {
      if (!this.editForm.type || !this.editForm.date || this.editForm.stable === '') {
        this.error = 'Заполните все обязательные поля (Тип, Дата установки, Стабильность)';
        return;
      }

      this.saving = true;
      this.error = null;

      try {
        const prosthesisData = {
          type: this.editForm.type,
          vendor: this.editForm.vendor || null,
          batch: this.editForm.batch || null,
          date: this.editForm.date,
          form: this.editForm.form || null,
          stable: Boolean(this.editForm.stable),
          patient: this.patientId
        };

        if (this.editingProsthesisId) {
          const updated = await authService.updateProsthesis(this.editingProsthesisId, prosthesisData);
          const index = this.prostheses.findIndex(p => p.id === this.editingProsthesisId);
          this.prostheses.splice(index, 1, updated);
          this.showSuccessMessage('Данные протеза успешно обновлены');
        } else {
          const created = await authService.createProsthesis(prosthesisData);
          this.prostheses.push(created);
          this.showSuccessMessage('Данные протеза успешно сохранены');
        }

        this.isEditing = false;
      } catch (error) {
        console.error('Ошибка сохранения:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка при сохранении данных';
      } finally {
        this.saving = false;
      }
    },
    
    showSuccessMessage(message) {
      alert(message);
    },
    
    cancelEditing() {
      this.isEditing = false;
    },
    
    async confirmDelete(id) {
      if (confirm('Вы уверены, что хотите удалить этот протез?')) {
        try {
          await authService.deleteProsthesis(id);
          this.prostheses = this.prostheses.filter(p => p.id !== id);
          this.showSuccessMessage('Протез успешно удален');
        } catch (error) {
          console.error('Ошибка удаления:', error);
          this.error = error.response?.data?.message || error.message || 'Ошибка при удалении';
        }
      }
    },
    
    handleSearch: debounce(function() {
    }, 300),
    
    clearSearch() {
      this.searchQuery = '';
    },
    
    goToPatient() {
      this.$router.push({ name: 'PatientDetail', params: { id: this.patientId } });
    },
    
    goToProsthesis() {
      this.$router.push({ name: 'ProsthesisInfo', params: { id: this.patientId } });
    },
    
    goToTreatment() {
      this.$router.push({ name: 'PatientTreatment', params: { id: this.patientId } });
    },
    
    goToComorbidPathologies() {
      this.$router.push({ name: 'PatientComorbidPathologies', params: { id: this.patientId } });
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
    }
  },
  async created() {
    await this.loadReferenceData();
    await this.fetchProstheses();
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchProstheses();
        }
      }
    }
  }
};
</script>

<style scoped>
.prosthesis-detail-page {
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

.prosthesis-actions {
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

.no-prosthesis {
  text-align: center;
  padding: 40px 20px;
}

.no-prosthesis h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-prosthesis p {
  color: #666;
  margin-bottom: 20px;
}

.prosthesis-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.prosthesis-item {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
}

.prosthesis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.prosthesis-header h3 {
  margin: 0;
  color: #333;
}

.prosthesis-actions {
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
  width: 150px;
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
  max-width: 600px;
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