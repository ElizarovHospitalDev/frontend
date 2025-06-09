<template>
  <div class="comorbid-pathologies-page">
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
        <div class="menu-item" @click="goToTreatment">Лечение</div>
        <div class="menu-item active">Коморбидные патологии</div>
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
            placeholder="Поиск по патологиям" 
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
        
        <div class="pathologies-actions">
          <button class="add-btn" @click="startAdding">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Добавить данные
          </button>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных о патологиях...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="pathologies-list">
          <div v-if="filteredPathologies.length === 0" class="no-pathology">
            <h2 v-if="searchQuery">Ничего не найдено</h2>
            <h2 v-else>Данные о коморбидных патологиях отсутствуют</h2>
            <p v-if="searchQuery">Попробуйте изменить параметры поиска</p>
            <p v-else>Для этого пациента нет информации о сопутствующих патологиях.</p>
          </div>
          
          <div 
            v-for="(pathology, index) in filteredPathologies" 
            :key="pathology.id" 
            class="pathology-item"
          >
            <div class="pathology-header">
              <h3>Коморбидные патологии #{{ index + 1 }}</h3>
              <div class="pathology-actions">
                <button class="edit-btn" @click="startEditing(pathology)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  Редактировать
                </button>
                <button class="delete-btn" @click="confirmDelete(pathology.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Ожирение:</div>
              <div class="info-value">{{ pathology.obesity ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Сахарный диабет:</div>
              <div class="info-value">{{ pathology.diabetes_mellitus ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Гепатит:</div>
              <div class="info-value">{{ pathology.hepatitis ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">ВИЧ:</div>
              <div class="info-value">{{ pathology.hiv ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Гормональное лечение:</div>
              <div class="info-value">{{ pathology.hormonal_treatment ? 'Да' : 'Нет' }}</div>
            </div>
          </div>
        </div>
        
        <div v-if="isEditing" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingPathologyId ? 'Редактирование данных' : 'Добавление данных' }}</h2>
            
            <form @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.obesity">
                  Ожирение
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.diabetes_mellitus">
                  Сахарный диабет
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.hepatitis">
                  Гепатит
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.hiv">
                  ВИЧ
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.hormonal_treatment">
                  Гормональное лечение
                </label>
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
  name: 'PatientComorbidPathologies',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      pathologies: [],
      loading: true,
      error: null,
      isEditing: false,
      editingPathologyId: null,
      saving: false,
      searchQuery: '',
      editForm: {
        obesity: false,
        diabetes_mellitus: false,
        hepatitis: false,
        hiv: false,
        hormonal_treatment: false,
        treatment: null
      }
    };
  },
  computed: {
    filteredPathologies() {
      if (!this.searchQuery) return this.pathologies;
      
      const query = this.searchQuery.toLowerCase();
      return this.pathologies.filter(pathology => {
        return (
          (pathology.obesity && 'ожирение'.includes(query)) ||
          (pathology.diabetes_mellitus && 'сахарный диабет'.includes(query)) ||
          (pathology.hepatitis && 'гепатит'.includes(query)) ||
          (pathology.hiv && 'вич'.includes(query)) ||
          (pathology.hormonal_treatment && 'гормональное лечение'.includes(query))
        );
      });
    }
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    async fetchTreatmentId() {
      try {
        const treatments = await authService.getTreatments();
        const patientTreatment = treatments.find(t => String(t.patient) === String(this.patientId));
        if (patientTreatment) {
          this.editForm.treatment = patientTreatment.id;
          return patientTreatment.id;
        }
        return null;
      } catch (error) {
        console.error('Ошибка загрузки данных о лечении:', error);
        return null;
      }
    },
    
    async fetchPathologies() {
      this.loading = true;
      this.error = null;
      
      try {
        const treatmentId = await this.fetchTreatmentId();
        if (!treatmentId) {
          this.pathologies = [];
          return;
        }
        
        const response = await authService.getComorbidPathologies();
        this.pathologies = response.filter(p => p.treatment === treatmentId);
      } catch (error) {
        console.error('Ошибка загрузки данных о патологиях:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка загрузки данных';
        
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    startAdding() {
      this.editForm = {
        treatment: this.editForm.treatment,
        obesity: false,
        diabetes_mellitus: false,
        hepatitis: false,
        hiv: false,
        hormonal_treatment: false
      };
      this.editingPathologyId = null;
      this.isEditing = true;
    },
    
    startEditing(pathology) {
      this.editForm = {
        treatment: pathology.treatment,
        obesity: pathology.obesity,
        diabetes_mellitus: pathology.diabetes_mellitus,
        hepatitis: pathology.hepatitis,
        hiv: pathology.hiv,
        hormonal_treatment: pathology.hormonal_treatment
      };
      this.editingPathologyId = pathology.id;
      this.isEditing = true;
    },
    
    async saveChanges() {
      this.saving = true;
      this.error = null;

      try {
        const pathologyData = {
          treatment: this.editForm.treatment,
          obesity: this.editForm.obesity,
          diabetes_mellitus: this.editForm.diabetes_mellitus,
          hepatitis: this.editForm.hepatitis,
          hiv: this.editForm.hiv,
          hormonal_treatment: this.editForm.hormonal_treatment
        };

        if (this.editingPathologyId) {
          const updated = await authService.updateComorbidPathology(this.editingPathologyId, pathologyData);
          const index = this.pathologies.findIndex(p => p.id === this.editingPathologyId);
          this.pathologies.splice(index, 1, updated);
          this.showSuccessMessage('Данные о патологиях успешно обновлены');
        } else {
          const created = await authService.createComorbidPathology(pathologyData);
          this.pathologies.push(created);
          this.showSuccessMessage('Данные о патологиях успешно сохранены');
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
      if (confirm('Вы уверены, что хотите удалить эти данные о патологиях?')) {
        try {
          await authService.deleteComorbidPathology(id);
          this.pathologies = this.pathologies.filter(p => p.id !== id);
          this.showSuccessMessage('Данные о патологиях успешно удалены');
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
    }
  },
  async created() {
    await this.fetchTreatmentId();
    await this.fetchPathologies();
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchPathologies();
        }
      }
    }
  }
};
</script>

<style scoped>
.comorbid-pathologies-page {
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

.pathologies-actions {
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

.no-pathology {
  text-align: center;
  padding: 40px 20px;
}

.no-pathology h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-pathology p {
  color: #666;
  margin-bottom: 20px;
}

.pathologies-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pathology-item {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
}

.pathology-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.pathology-header h3 {
  margin: 0;
  color: #333;
}

.pathology-actions {
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
  max-width: 500px;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: #f5f5f5;
}

.checkbox-label input {
  width: auto;
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