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
          <button class="add-btn" @click="showAddModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Добавить данные
          </button>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных о патологиях...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="pathologies-list">
          <div v-if="!filteredPathologies || filteredPathologies.length === 0" class="no-pathology">
            <h2 v-if="searchQuery">Ничего не найдено</h2>
            <h2 v-else>Данные о коморбидных патологиях отсутствуют</h2>
            <p v-if="searchQuery">Попробуйте изменить параметры поиска</p>
            <p v-else>Для этого пациента нет информации о сопутствующих патологиях.</p>
          </div>
          
          <div 
            v-for="(pathology, index) in filteredPathologies" 
            :key="pathology?.id" 
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
                <button class="delete-btn" @click="confirmDelete(pathology?.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <template v-if="pathology?.treatment">
              <div class="info-row">
                <div class="info-label">Лечение:</div>
                <div class="info-value">{{ pathology?.treatment ? getTreatmentInfo(pathology.treatment) : 'Не указано' }}</div>
              </div>
            </template>
            
            <div class="info-row">
              <div class="info-label">Ожирение:</div>
              <div class="info-value">{{ pathology?.obesity ? 'Да' : 'Нет' }}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Сахарный диабет:</div>
              <div class="info-value">{{ pathology?.diabetes_mellitus ? 'Да' : 'Нет' }}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Гепатит:</div>
              <div class="info-value">{{ pathology?.hepatitis ? 'Да' : 'Нет' }}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">ВИЧ:</div>
              <div class="info-value">{{ pathology?.hiv ? 'Да' : 'Нет' }}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Гормональное лечение:</div>
              <div class="info-value">{{ pathology?.hormonal_treatment ? 'Да' : 'Нет' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Pathology Modal -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <h2>{{ showEditModal ? 'Редактировать' : 'Добавить' }} коморбидную патологию</h2>
        
        <div class="form-group">
          <label>Лечение:</label>
          <select :value="showEditModal ? editingPathology.treatment : newPathology.treatment" @input="e => showEditModal ? editingPathology.treatment = e.target.value : newPathology.treatment = e.target.value" class="form-control">
            <option :value="null">Выберите лечение</option>
            <option 
              v-for="treatment in treatments" 
              :key="treatment.id" 
              :value="treatment.id"
            >
              {{ getTreatmentInfo(treatment.id) }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" :checked="showEditModal ? editingPathology.obesity : newPathology.obesity" @change="e => showEditModal ? editingPathology.obesity = e.target.checked : newPathology.obesity = e.target.checked">
            Ожирение
          </label>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" :checked="showEditModal ? editingPathology.diabetes_mellitus : newPathology.diabetes_mellitus" @change="e => showEditModal ? editingPathology.diabetes_mellitus = e.target.checked : newPathology.diabetes_mellitus = e.target.checked">
            Сахарный диабет
          </label>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" :checked="showEditModal ? editingPathology.hepatitis : newPathology.hepatitis" @change="e => showEditModal ? editingPathology.hepatitis = e.target.checked : newPathology.hepatitis = e.target.checked">
            Гепатит
          </label>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" :checked="showEditModal ? editingPathology.hiv : newPathology.hiv" @change="e => showEditModal ? editingPathology.hiv = e.target.checked : newPathology.hiv = e.target.checked">
            ВИЧ
          </label>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" :checked="showEditModal ? editingPathology.hormonal_treatment : newPathology.hormonal_treatment" @change="e => showEditModal ? editingPathology.hormonal_treatment = e.target.checked : newPathology.hormonal_treatment = e.target.checked">
            Гормональное лечение
          </label>
        </div>

        <div class="modal-actions">
          <button @click="showEditModal ? updatePathology() : createPathology()" class="save-btn">Сохранить</button>
          <button @click="closeModal" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h2>Подтверждение удаления</h2>
        <p>Вы уверены, что хотите удалить эти данные о патологиях?</p>
        <div class="modal-actions">
          <button @click="deletePathology" class="delete-btn">Удалить</button>
          <button @click="showDeleteModal = false" class="cancel-btn">Отмена</button>
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
      treatments: [],
      arthroplastyForms: [],
      loading: true,
      error: null,
      searchQuery: '',
      editingPathology: null,
      showDeleteModal: false,
      pathologyToDelete: null,
      showEditModal: false,
      showAddModal: false,
      newPathology: {
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
      if (!this.pathologies) return [];
      if (!this.searchQuery) return this.pathologies.filter(p => p);
      
      const query = this.searchQuery.toLowerCase();
      return this.pathologies.filter(pathology => {
        if (!pathology) return false;
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
    
    async loadInitialData() {
      try {
        this.loading = true;
        await Promise.all([
          this.fetchPathologies(),
          this.fetchTreatments(),
          this.fetchArthroplastyForms()
        ]);
      } catch (error) {
        this.error = 'Ошибка при загрузке данных';
        console.error('Error loading initial data:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPathologies() {
      try {
        const response = await authService.getComorbidPathologies();
        this.pathologies = response;
      } catch (error) {
        console.error('Error fetching pathologies:', error);
        this.error = 'Ошибка при загрузке данных о патологиях';
      }
    },

    async fetchTreatments() {
      try {
        const response = await authService.getTreatments({ patient: this.patientId });
        this.treatments = response;
      } catch (error) {
        console.error('Error fetching treatments:', error);
        this.error = 'Ошибка при загрузке данных о лечении';
      }
    },

    async fetchArthroplastyForms() {
      try {
        const response = await authService.getArthroplastyForms();
        this.arthroplastyForms = response;
      } catch (error) {
        console.error('Error fetching arthroplasty forms:', error);
        this.error = 'Ошибка при загрузке форм артропластики';
      }
    },

    getTreatmentInfo(treatmentId) {
      if (!treatmentId) return 'Не указано';
      const treatment = this.treatments.find(t => t.id === treatmentId);
      if (!treatment) return 'Неизвестное лечение';
      
      const reasonName = this.getReasonName(treatment.reason);
      const formName = this.getArthroplastyFormName(treatment.form);
      
      return `${reasonName} - ${formName}`;
    },

    getReasonName(reason) {
      const reasons = {
        'травма': 'Травма',
        'гонартроз': 'Гонартроз',
        'дисплазия': 'Дисплазия',
        'онкология': 'Онкология'
      };
      return reasons[reason] || 'Неизвестная причина';
    },

    getArthroplastyFormName(formId) {
      const form = this.arthroplastyForms.find(f => f.id === formId);
      return form ? form.name : 'Неизвестная форма';
    },

    startEditing(pathology) {
      this.editingPathology = { ...pathology };
      this.showEditModal = true;
    },

    async updatePathology() {
      try {
        const pathologyData = {
          obesity: this.editingPathology.obesity,
          diabetes_mellitus: this.editingPathology.diabetes_mellitus,
          hepatitis: this.editingPathology.hepatitis,
          hiv: this.editingPathology.hiv,
          hormonal_treatment: this.editingPathology.hormonal_treatment,
          treatment: this.editingPathology.treatment || 0
        };
        
        const response = await authService.updateComorbidPathology(this.editingPathology.id, pathologyData);
        const index = this.pathologies.findIndex(p => p.id === this.editingPathology.id);
        if (index !== -1) {
          this.pathologies[index] = response.data;
        }
        this.showEditModal = false;
        this.editingPathology = null;
      } catch (error) {
        console.error('Error updating pathology:', error);
        this.error = 'Ошибка при обновлении данных о патологиях';
      }
    },

    async createPathology() {
      try {
        const pathologyData = {
          obesity: this.newPathology.obesity,
          diabetes_mellitus: this.newPathology.diabetes_mellitus,
          hepatitis: this.newPathology.hepatitis,
          hiv: this.newPathology.hiv,
          hormonal_treatment: this.newPathology.hormonal_treatment,
          treatment: this.newPathology.treatment || 0,
          patient: this.patientId
        };
        
        const response = await authService.createComorbidPathology(pathologyData);
        this.pathologies.push(response);
        this.showAddModal = false;
        this.newPathology = {
          obesity: false,
          diabetes_mellitus: false,
          hepatitis: false,
          hiv: false,
          hormonal_treatment: false,
          treatment: null
        };
      } catch (error) {
        console.error('Error creating pathology:', error);
        this.error = 'Ошибка при создании данных о патологиях';
      }
    },

    confirmDelete(id) {
      this.pathologyToDelete = id;
      this.showDeleteModal = true;
    },

    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.editingPathology = null;
      this.newPathology = {
        obesity: false,
        diabetes_mellitus: false,
        hepatitis: false,
        hiv: false,
        hormonal_treatment: false,
        treatment: null
      };
    },

    handleSearch: debounce(function() {
      // Поиск уже реализован через computed свойство filteredPathologies
    }, 300),

    clearSearch() {
      this.searchQuery = '';
    },

    goToPatient() {
      this.$router.push('/patients');
    },

    goToProsthesis() {
      this.$router.push(`/patients/${this.patientId}/prosthesis`);
    },

    goToTreatment() {
      this.$router.push(`/patients/${this.patientId}/treatment`);
    },

    goToMicroflora() {
      this.$router.push(`/patients/${this.patientId}/microflora`);
    },

    goToOperations() {
      this.$router.push(`/patients/${this.patientId}/operations`);
    },

    goToAnalysis() {
      this.$router.push(`/patients/${this.patientId}/analysis`);
    },

    goToOutcomes() {
      this.$router.push(`/patients/${this.patientId}/outcomes`);
    },

    goBack() {
      this.$router.go(-1);
    },

    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },

    async deletePathology() {
      try {
        await authService.deleteComorbidPathology(this.pathologyToDelete);
        this.pathologies = this.pathologies.filter(p => p.id !== this.pathologyToDelete);
        this.showDeleteModal = false;
        this.pathologyToDelete = null;
      } catch (error) {
        console.error('Error deleting pathology:', error);
        this.error = 'Ошибка при удалении данных о патологиях';
      }
    }
  },
  async created() {
    await this.loadInitialData();
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

.modal {
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

.form-group {
  margin-bottom: 16px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
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

.cancel-btn {
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}
</style>