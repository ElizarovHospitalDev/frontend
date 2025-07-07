<template>
  <div class="outcomes-page">
    <div class="header">
      <div class="header-content">
        <img src="@/assets/2025-03-10_18-35-17-picaai-Photoroom-1.png" alt="Logo" class="logo">
        <h1>ЦИФРОВОЙ РЕГИСТР ПАЦИЕНТОВ ЦЕНТРА ИЛИЗАРОВА</h1>
      </div>
      <div class="nav-links">
        <div class="nav-items">
          <router-link to="/patients" class="nav-link">
            <i class="fas fa-users"></i>
            Пациенты
          </router-link>
          <button class="logout-btn" @click="logout">Выход</button>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="sidebar">
        <div class="menu-item" @click="goToPatient">Пациент</div>
        <div class="menu-item" @click="goToProsthesis">Протез</div>
        <div class="menu-item" @click="goToTreatment">Лечение</div>
        <div class="menu-item" @click="goToComorbidPathologies">Коморбидные патологии</div>
        <div class="menu-item" @click="goToMicroflora">Микрофлора</div>
        <div class="menu-item" @click="goToOperations">Операции</div>
        <div class="menu-item" @click="goToAnalysis">Анализы</div>
        <div class="menu-item active">Итоги лечения</div>
        
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
            placeholder="Поиск по результату или дате" 
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
        
        <div class="outcomes-actions">
          <button class="add-btn" @click="startAdding">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Добавить итоги лечения
          </button>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных об итогах лечения...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="outcomes-list">
          <div v-if="filteredOutcomes.length === 0" class="no-outcomes">
            <h2 v-if="searchQuery">Ничего не найдено</h2>
            <h2 v-else>Данные об итогах лечения отсутствуют</h2>
            <p v-if="searchQuery">Попробуйте изменить параметры поиска</p>
            <p v-else>Для этого пациента нет информации об итогах лечения.</p>
          </div>
          
          <div 
            v-for="(outcome, index) in filteredOutcomes" 
            :key="outcome.id" 
            class="outcome-item"
          >
            <div class="outcome-header">
              <h3>Итоги лечения №{{ index + 1 }}</h3>
              <div class="outcome-actions">
                <button class="edit-btn" @click="startEditing(outcome)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  Редактировать
                </button>
                <button class="delete-btn" @click="confirmDelete(outcome.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Результат лечения:</div>
              <div class="info-value">{{ outcome.result || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Артодез:</div>
              <div class="info-value">{{ outcome.artodesis || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Повторная ревизия:</div>
              <div class="info-value">{{ outcome.re_audit || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Исход:</div>
              <div class="info-value">{{ formatOutcome(outcome.outcome) }}</div>
            </div>
          </div>
        </div>

        <div v-if="isEditing" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingOutcomeId ? 'Редактирование данных' : 'Добавление данных' }}</h2>
            
            <form @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label for="result">Результат лечения *</label>
                <select 
                  id="result" 
                  v-model="editForm.result" 
                  required
                >
                  <option value="" disabled>Выберите результат</option>
                  <option value="купирование">Купирование</option>
                  <option value="рецидив">Рецидив</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="artodesis">Артодез</label>
                <select 
                  id="artodesis" 
                  v-model="editForm.artodesis" 
                >
                  <option value="" disabled>Выберите вариант</option>
                  <option value="есть сращение">Есть сращение</option>
                  <option value="нет сращения">Нет сращения</option>
                  <option value="нет данных">Нет данных</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="re_audit">Повторная ревизия *</label>
                <select 
                  id="re_audit" 
                  v-model="editForm.re_audit" 
                  required
                >
                  <option value="" disabled>Выберите вариант</option>
                  <option value="нет">Нет</option>
                  <option value="дебридмент">Дебридмент</option>
                  <option value="одноэтапное">Одноэтапное</option>
                  <option value="двухэтапное">Двухэтапное</option>
                  <option value="артродез">Артродез</option>
                  <option value="ампутация">Ампутация</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="outcome">Исход *</label>
                <select 
                  id="outcome" 
                  v-model="editForm.outcome" 
                  required
                >
                  <option value="" disabled>Выберите исход</option>
                  <option value="ВСЕ ОК">Лечение прошло успешно</option>
                  <option value="смерть на фоне СЕПСИСА">Смерть на фоне сепсиса</option>
                  <option value="смерть на фоне ДРУГИХ проблем">Смерть на фоне других проблем</option>
                  <option value="нет связи с больным">Нет связи с больным</option>
                  <option value="ампутация по месту жительства">Ампутация по месту жительства</option>
                  <option value="рецидив">Рецидив</option>
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
  name: 'PatientOutcomes',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      outcomes: [],
      loading: true,
      error: null,
      isEditing: false,
      editingOutcomeId: null,
      saving: false,
      searchQuery: '',
      editForm: {
        result: '',
        artodesis: '',
        re_audit: '',
        outcome: '',
        treatment: null
      }
    };
  },
  computed: {
    filteredOutcomes() {
      if (!this.searchQuery) return this.outcomes;
      
      const query = this.searchQuery.toLowerCase();
      return this.outcomes.filter(outcome => {
        return (
          (outcome.result && outcome.result.toLowerCase().includes(query)) ||
          (outcome.artodesis && outcome.artodesis.toLowerCase().includes(query)) ||
          (outcome.re_audit && outcome.re_audit.toLowerCase().includes(query)) ||
          (outcome.outcome && outcome.outcome.toLowerCase().includes(query))
        );
      });
    }
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    formatOutcome(value) {
      if (!value) return 'Не указано';
      if (value === 'ВСЕ ОК') return 'Лечение прошло успешно';
      return value;
    },
    
    async fetchTreatmentId() {
      try {
        const treatments = await authService.getTreatments();
        const patientTreatment = treatments.find(t => String(t.patient) === String(this.patientId));
        if (patientTreatment) {
          return patientTreatment.id;
        }
        return null;
      } catch (error) {
        console.error('Ошибка загрузки данных о лечении:', error);
        return null;
      }
    },
    
    async fetchOutcomes() {
      this.loading = true;
      this.error = null;
      
      try {
        const treatmentId = await this.fetchTreatmentId();
        if (!treatmentId) {
          this.outcomes = [];
          return;
        }
        
        const response = await authService.getTreatmentOutcomes();
        this.outcomes = response.filter(o => o.treatment === treatmentId);
        this.editForm.treatment = treatmentId;
      } catch (error) {
        console.error('Ошибка загрузки данных об итогах лечения:', error);
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
        result: '',
        artodesis: '',
        re_audit: '',
        outcome: '',
        treatment: this.editForm.treatment
      };
      this.editingOutcomeId = null;
      this.isEditing = true;
    },
    
    startEditing(outcome) {
      this.editForm = {
        result: outcome.result,
        artodesis: outcome.artodesis,
        re_audit: outcome.re_audit,
        outcome: outcome.outcome,
        treatment: outcome.treatment
      };
      this.editingOutcomeId = outcome.id;
      this.isEditing = true;
    },
    
    async saveChanges() {
      if (!this.editForm.result || !this.editForm.re_audit || !this.editForm.outcome) {
        this.error = 'Заполните все обязательные поля';
        return;
      }

      this.saving = true;
      this.error = null;

      try {
        const outcomeData = {
          result: this.editForm.result,
          artodesis: this.editForm.artodesis || null,
          re_audit: this.editForm.re_audit,
          outcome: this.editForm.outcome,
          treatment: this.editForm.treatment
        };

        if (!outcomeData.treatment) {
          throw new Error('Необходимо указать лечение пациента');
        }

        if (this.editingOutcomeId) {
          const updated = await authService.updateTreatmentOutcome(this.editingOutcomeId, outcomeData);
          const index = this.outcomes.findIndex(o => o.id === this.editingOutcomeId);
          this.outcomes.splice(index, 1, updated);
          this.showSuccessMessage('Данные об итогах лечения успешно обновлены');
        } else {
          const created = await authService.createTreatmentOutcome(outcomeData);
          this.outcomes.push(created);
          this.showSuccessMessage('Данные об итогах лечения успешно сохранены');
        }

        this.isEditing = false;
      } catch (error) {
        console.error('Ошибка сохранения:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка при сохранении данных';
      } finally {
        this.saving = false;
      }
    },
    
    async confirmDelete(id) {
      if (confirm('Вы уверены, что хотите удалить данные об итогах лечения?')) {
        try {
          await authService.deleteTreatmentOutcome(id);
          this.outcomes = this.outcomes.filter(o => o.id !== id);
          this.showSuccessMessage('Данные об итогах лечения успешно удалены');
        } catch (error) {
          console.error('Ошибка удаления:', error);
          this.error = error.response?.data?.message || error.message || 'Ошибка при удалении';
        }
      }
    },
    
    showSuccessMessage(message) {
      alert(message);
    },
    
    cancelEditing() {
      this.isEditing = false;
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
    await this.fetchOutcomes();
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchOutcomes();
        }
      }
    }
  }
};
</script>

<style scoped>
.outcomes-page {
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

.outcomes-actions {
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

.no-outcomes {
  text-align: center;
  padding: 40px 20px;
}

.no-outcomes h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-outcomes p {
  color: #666;
  margin-bottom: 20px;
}

.outcome-item {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.outcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.outcome-header h3 {
  margin: 0;
  color: #333;
}

.outcome-actions {
  display: flex;
  gap: 10px;
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
  width: 250px;
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

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #9ac531;
  color: white;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s;
}

.nav-link:hover {
  background-color: #7fa11e;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-btn {
  padding: 8px 16px;
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #aa0000;
}
</style>