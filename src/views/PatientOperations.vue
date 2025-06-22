<template>
  <div class="operations-page">
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
        <div class="menu-item active">Операции</div>
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
            placeholder="Поиск по дате операции или характеру раны" 
            class="search-input"
          >
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-search-btn"
          >
            ×
          </button>
          <button class="search-btn" >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#666"/>
            </svg>
          </button>
        </div>
        



        <div class="operations-actions">
          <button 
            class="add-btn"
            @click="startAdding"
          >
            Добавить операцию
          </button>

          <div v-if="showCreateTreatmentBtn" class="alert alert-warning mt-3">
            <p>Лечение не найдено</p>
            <button @click="goToTreatment" class="btn-create-treatment">
              Создать лечение
            </button>
          </div>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных об операциях...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="operations-list">
          <div v-if="filteredOperations.length === 0" class="no-operation">
            <h2 v-if="searchQuery">Ничего не найдено</h2>
            <h2 v-else>Данные об операциях отсутствуют</h2>
            <p v-if="searchQuery">Попробуйте изменить параметры поиска</p>
            <p v-else>Для этого пациента нет информации об операциях.</p>
          </div>
          
          <div 
            v-for="(operation, index) in filteredOperations" 
            :key="operation.id" 
            class="operation-item"
          >
            <div class="operation-header">
              <h3>Операция №{{ index + 1 }}</h3>
              <div class="operation-actions">
                <button class="edit-btn" @click="startEditing(operation)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  Редактировать
                </button>
                <button class="delete-btn" @click="confirmDelete(operation.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <div class="info-section">
              <h4>Данные по оперативному вмешательству</h4>
              
              <div class="stage-section">
                <h5>1) Операция I этап</h5>
                <div class="info-row">
                  <div class="info-label">Дата операции:</div>
                  <div class="info-value">{{ formatDate(operation.operation_date) || 'Не указана' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Длительность(мин):</div>
                  <div class="info-value">{{operation.duration_stage1 || 'Не указана' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Кровопотеря(мл):</div>
                  <div class="info-value">{{ operation.blood_loss_stage1 || 'Не указана' }}</div>
                </div>
              </div>
              
              <div class="stage-section">
                <h5>2) Операция II этап</h5>
                <div class="info-row">
                  <div class="info-label">Дата операции:</div>
                  <div class="info-value">{{ formatDate(operation.operation_date_stage2) || 'Не указана' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Длительность(мин):</div>
                  <div class="info-value">{{ operation.duration_stage2 || 'Не указана' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Кровопотеря(мл):</div>
                  <div class="info-value">{{ operation.blood_loss_stage2 || 'Не указана' }}</div>
                </div>
              </div>
              
              <div class="common-section">
                <div class="info-row">
                  <div class="info-label">Характер раны:</div>
                  <div class="info-value">{{ operation.wound_character || 'Не указан' }}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Дренирование:</div>
                  <div class="info-value">{{ operation.drainage || 'Не указано' }}</div>
                </div>
                <div class="info-row" v-if="operation.complications">
                  <div class="info-label">Осложнения:</div>
                  <div class="info-value">{{ operation.complications }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="isEditing" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingOperationId ? 'Редактирование операции' : 'Добавление операции' }}</h2>
            <div class="form-note">
              Поля, отмеченные звездочкой (*), обязательны для заполнения
            </div>
            <form @submit.prevent="saveChanges" class="edit-form">
              <div class="form-section">
                <h4>1) Операция I этап</h4>
                <div class="form-group">
                  <label for="operation_date">Дата операции *</label>
                  <input 
                    id="operation_date" 
                    v-model="editForm.operation_date" 
                    type="date" 
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="duration_stage1">Длительность(минут) *</label>
                  <input 
                    id="duration_stage1" 
                    v-model="editForm.duration_stage1" 
                    type="number" 
                    min="0"
                    required
                    placeholder="Введите длительность операции"
                  >
                </div>
                
                <div class="form-group">
                  <label for="blood_loss_stage1">Кровопотеря(мл) *</label>
                  <input 
                    id="blood_loss_stage1" 
                    v-model="editForm.blood_loss_stage1" 
                    type="number" 
                    min="0"
                    required
                    placeholder="Введите объем кровопотери"
                  >
                </div>
              </div>
              
              <div class="form-section">
                <h4>2) Операция II этап</h4>
                <div class="form-group">
                  <label for="operation_date_stage2">Дата операции</label>
                  <input 
                    id="operation_date_stage2" 
                    v-model="editForm.operation_date_stage2" 
                    type="date"
                  >
                </div>
                
                <div class="form-group">
                  <label for="duration_stage2">Длительность(минут)</label>
                  <input 
                    id="duration_stage2" 
                    v-model="editForm.duration_stage2" 
                    type="number" 
                    min="0"
                    placeholder="Введите длительность операции"
                  >
                </div>
                
                <div class="form-group">
                  <label for="blood_loss_stage2">Кровопотеря(мл)</label>
                  <input 
                    id="blood_loss_stage2" 
                    v-model="editForm.blood_loss_stage2" 
                    type="number" 
                    min="0"
                    placeholder="Введите объем кровопотери"
                  >
                </div>
              </div>
              
              <div class="form-section">
                <h4>Общие данные</h4>
                <div class="form-group">
                  <label for="wound_character">Характер раны *</label>
                  <input 
                    id="wound_character" 
                    v-model="editForm.wound_character" 
                    type="text" 
                    placeholder="Введите характер раны"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="drainage">Дренирование *</label>
                  <input 
                    id="drainage" 
                    v-model="editForm.drainage" 
                    type="text" 
                    placeholder="Введите информацию о дренировании"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="complications">Осложнения</label>
                  <textarea 
                    id="complications" 
                    v-model="editForm.complications" 
                    placeholder="Опишите осложнения, если они были"
                    rows="3"
                  ></textarea>
                </div>
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

export default {
  name: 'PatientOperations',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      showCreateTreatmentBtn: false,
      operations: [],
      loading: true,
      error: null,
      isEditing: false,
      editingOperationId: null,
      saving: false,
      searchQuery: '',
      operationStages: [],
      editForm: {
        treatment: null,
        operation_stage: null,
        operation_date: '',
        operation_date_stage2: '',
        duration_stage1: '',
        duration_stage2: '',
        blood_loss_stage1: '',
        blood_loss_stage2: '',
        wound_character: '',
        drainage: '',
        complications: ''
      }
    };
  },
  computed: {

    filteredOperations() {
      if (!this.searchQuery) return this.operations;
      
      const query = this.searchQuery.toLowerCase();
      return this.operations.filter(operation => {
        return (
          (operation.operation_date && this.formatDate(operation.operation_date).toLowerCase().includes(query)) ||
          (operation.operation_date_stage2 && this.formatDate(operation.operation_date_stage2).toLowerCase().includes(query)) ||
          (operation.wound_character && operation.wound_character.toLowerCase().includes(query)) ||
          (operation.drainage && operation.drainage.toLowerCase().includes(query)) ||
          (operation.complications && operation.complications.toLowerCase().includes(query))
        );
      });
    }
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    async fetchOperationStages() {
      try {
        const response = await authService.getOperationStages();
        if (response && response.length > 0) {
          this.operationStages = response;
          this.editForm.operation_stage = response[0].id; // Устанавливаем первый этап по умолчанию
        } else {  
          console.error('Список этапов операций пуст');
          this.error = 'Не удалось загрузить этапы операций';
        }
      } catch (error) {
        console.error('Ошибка загрузки этапов операции:', error);
        this.error = 'Ошибка при загрузке этапов операций';
      }
    },



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
    
    async fetchOperations() {
      this.loading = true;
      this.error = null;
      
      try {
        const treatmentId = await this.fetchTreatmentId();
        if (!treatmentId) {
          this.operations = [];
          return;
        }
        
        const response = await authService.getSurgicalInterventions();
        this.operations = response.filter(op => op.treatment === treatmentId);
      } catch (error) {
        console.error('Ошибка загрузки данных об операциях:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка загрузки данных';
        
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return null;
      return new Date(dateString).toLocaleDateString('ru-RU');
    },
    
  
    async startAdding() {
      try {
        console.log('2. Получаем treatmentId');
        const treatmentId = await this.fetchTreatmentId();

        if (!treatmentId) {
          this.error = 'Для добавления операции сначала создайте лечение';
          this.showCreateTreatmentBtn = true; // Показываем кнопку создания
          return;
        }

        // Проверяем наличие этапов операций
        if (this.operationStages.length === 0) {
          this.error = 'Нет доступных этапов операций';
          return;
        }

        this.editForm = {
          treatment: treatmentId,
          operation_stage: this.operationStages[0].id,
          operation_date: '',
          operation_date_stage2: '',
          duration_stage1: '',
          duration_stage2: '',
          blood_loss_stage1: '',
          blood_loss_stage2: '',
          wound_character: '',
          drainage: '',
          complications: ''
        };

        this.editingOperationId = null;
        this.isEditing = true;

      } catch (error) {
        console.error('Ошибка при создании операции:', error);
        this.error = 'Не удалось начать создание операции';
        }
    },
    
    startEditing(operation) {
      this.editForm = {
        treatment: operation.treatment,
        operation_stage: operation.operation_stage,
        operation_date: operation.operation_date ? operation.operation_date.split('T')[0] : '',
        operation_date_stage2: operation.operation_date_stage2 ? operation.operation_date_stage2.split('T')[0] : '',
        duration_stage1: operation.duration_stage1 || '',
        duration_stage2: operation.duration_stage2 || '',
        blood_loss_stage1: operation.blood_loss_stage1 || '',
        blood_loss_stage2: operation.blood_loss_stage2 || '',
        wound_character: operation.wound_character || '',
        drainage: operation.drainage || '',
        complications: operation.complications || ''
      };
      this.editingOperationId = operation.id;
      this.isEditing = true;
    },
    
    async saveChanges() {
      // Проверка обязательных полей
      if (!this.editForm.treatment) {
        this.error = 'Не найдено активное лечение для этого пациента. Сначала создайте лечение.';
        return;
      }

      if (!this.editForm.operation_stage) {
        this.error = 'Не выбран этап операции. Пожалуйста, выберите этап.';
        return;
      }

      // Преобразуем числовые значения
      const duration1 = parseInt(this.editForm.duration_stage1) || 0;
      const bloodLoss1 = parseInt(this.editForm.blood_loss_stage1) || 0;
      const duration2 = parseInt(this.editForm.duration_stage2) || null;
      const bloodLoss2 = parseInt(this.editForm.blood_loss_stage2) || null;

      if (!this.editForm.operation_date || !this.editForm.duration_stage1 || !this.editForm.blood_loss_stage1) {
        this.error = 'Заполните все обязательные поля для I этапа операции (Дата, Длительность, Кровопотеря)';
        return;
      }

      this.saving = true;
      this.error = null;

      try {
        const operationData = {
          treatment: this.editForm.treatment,
          operation_stage: this.editForm.operation_stage,
          operation_date: this.editForm.operation_date,
          operation_date_stage2: this.editForm.operation_date_stage2 || null,
          duration_stage1: duration1,
          duration_stage2: duration2,
          blood_loss_stage1: bloodLoss1,
          blood_loss_stage2: bloodLoss2,
          wound_character: this.editForm.wound_character || null,
          drainage: this.editForm.drainage || null,
          complications: this.editForm.complications || null
        };

        console.log('Отправляемые данные:', operationData); // Для отладки

        if (this.editingOperationId) {
          const updated = await authService.updateSurgicalIntervention(this.editingOperationId, operationData);
          const index = this.operations.findIndex(op => op.id === this.editingOperationId);
          this.operations.splice(index, 1, updated);
          this.showSuccessMessage('Данные операции успешно обновлены');
        } else {
          const created = await authService.createSurgicalIntervention(operationData);
          this.operations.push(created);
          this.showSuccessMessage('Данные операции успешно сохранены');
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
      if (confirm('Вы уверены, что хотите удалить эту операцию?')) {
        try {
          await authService.deleteSurgicalIntervention(id);
          this.operations = this.operations.filter(op => op.id !== id);
          this.showSuccessMessage('Операция успешно удалена');
        } catch (error) {
          console.error('Ошибка удаления:', error);
          this.error = error.response?.data?.message || error.message || 'Ошибка при удалении';
        }
      }
    },
    
    
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
      this.$router.push({
        name: 'PatientTreatment',
        params: { id: this.patientId },
        query: { from: 'operations' }
      });
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

    await this.fetchOperationStages();
    console.log('Загруженные этапы операций:', this.operationStages); // Для отладки

    // Проверяем, вернулись ли мы после создания лечения
    if (this.$route.query.from === 'treatment') {
      await this.fetchTreatmentId(); // Обновляем данные о лечении
      this.showCreateTreatmentBtn = false; // Скрываем кнопку
    }
  
    // Загружаем остальные данные
    await this.fetchOperationStages();
    await this.fetchTreatmentId();
    await this.fetchOperations();
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchOperations();
        }
      }
    }
  }
};
</script>

<style scoped>
.operations-page {
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

.operations-actions {
  margin-bottom: 30px;
}

.stage-section, .common-section {
  margin-bottom: 10px; 
}


.info-section h4 {
  margin: 30px 0 20px 0; 
  font-size: 18px;
}

.stage-section h5 {
  margin: 20px 0 15px 0; 
  font-size: 15px;
}

.form-section h4 {
  margin: 20px 0 20px 0; 
  color: #333;
  font-size: 16px;
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

.no-operation {
  text-align: center;
  padding: 40px 20px;
}

.no-operation h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-operation p {
  color: #666;
  margin-bottom: 20px;
}

.operations-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.operation-item {
  border: 1px solid #e6eec6;
  border-radius: 12px;
  padding: 25px;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.operation-header h3 {
  margin: 0;
  color: #333;
  font-size: 20px; /* Увеличили размер шрифта */
}

.operation-actions {
  display: flex;
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
  margin-bottom: 8px;
}

.info-label {
  width: 140px;
  font-weight: 600;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

/* Модальное окно */
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
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.btn-create-treatment {
  margin-top: 10px;
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.alert {
  padding: 15px;
  background: #fff8e6;
  border-radius: 8px;
  margin-top: 15px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e6eec6;
  border-radius: 12px;
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