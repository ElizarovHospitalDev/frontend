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
        <div class="menu-item">Лечение</div>
        <div class="menu-item">Коморбидные патологии</div>
        <div class="menu-item">Микрофлора</div>
        <div class="menu-item">Операции</div>
        <div class="menu-item">Анализы</div>
        <div class="menu-item">Итоги лечения</div>
        
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          Назад
        </button>
      </div>
      
      <div class="main-content">
        <div class="search-bar">
          <input type="text" placeholder="Введите данные для поиска" class="search-input">
          <button class="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#666"/>
            </svg>
          </button>
        </div>
        
        <div class="prosthesis-info-container">
          <div v-if="loading" class="loading">Загрузка данных протеза...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          
          <div v-else-if="!prosthesis && !isEditing" class="no-prosthesis">
            <h2>Данные о протезе отсутствуют</h2>
            <p>Для этого пациента нет информации о протезе.</p>
            <button class="add-btn" @click="startAdding">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
              </svg>
              Добавить данные о протезе
            </button>
          </div>
          
          <div v-else class="prosthesis-info">
            <div class="prosthesis-header">
              <h2>Информация о протезе пациента</h2>
              <button class="edit-btn" @click="startEditing" v-if="!isEditing">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
                Редактировать
              </button>
            </div>
            
            <div v-if="!isEditing">
              <div class="info-row">
                <div class="info-label">Вид:</div>
                <div class="info-value">{{ getProsthesisTypeName(prosthesis?.type) || 'Не указано' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Производитель:</div>
                <div class="info-value">{{ getProsthesisVendorName(prosthesis?.vendor) || 'Не указано' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Партия:</div>
                <div class="info-value">{{ prosthesis?.batch || 'Не указано' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Дата установки:</div>
                <div class="info-value">{{ formatDate(prosthesis?.date) || 'Не указана' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Форма:</div>
                <div class="info-value">{{ getProsthesisFormName(prosthesis?.form) || 'Не указано' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Стабильность:</div>
                <div class="info-value">{{ prosthesisStabilityName(prosthesis?.stable) || 'Не указана' }}</div>
              </div>
            </div>
            
            <form v-else @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label for="type">Вид эндопротеза *</label>
                <select id="type" v-model="editForm.type" required>
                  <option value="" disabled>Выберите вид</option>
                  <option v-for="type in prosthesisTypes" 
                          :key="type.id" 
                          :value="type.name">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="vendor">Производитель</label>
                <input id="vendor" v-model="editForm.vendor" type="text" placeholder="Введите производителя">
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
                <input id="form" v-model="editForm.form" type="text" placeholder="Введите форму протеза">
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
      prosthesis: null,
      loading: true,
      error: null,
      isEditing: false,
      saving: false,
      editForm: {
        type: '',
        vendor: '',
        batch: '',
        date: '',
        form: '',
        stable: '',
        patient: null
      },
      // Список разрешенных типов протезов
      allowedProsthesisTypes: [
        { id: 1, name: 'Uni' },
        { id: 2, name: 'CR' },
        { id: 3, name: 'PS' },
        { id: 4, name: 'VVC' },
        { id: 5, name: 'Hinge' },
        { id: 6, name: 'Протез удален' },
        { id: 7, name: 'Спейсер' }
      ],
      prosthesisTypes: [], // Будет заполнено из сервера
      prosthesisVendors: [],
      prosthesisForms: []
    };
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchProsthesis();
        }
      }
    }
  },
  async created() {
    await this.loadReferenceData();
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    async loadReferenceData() {
      try {
        // Загружаем типы с сервера, но фильтруем по разрешенным
        const [serverTypes, vendors, forms] = await Promise.all([
          authService.getProsthesisTypes(),
          authService.getProsthesisVendors().catch(() => []),
          authService.getProsthesisForms().catch(() => [])
        ]);
        
        // Фильтруем типы по разрешенному списку
        this.prosthesisTypes = serverTypes.filter(type => 
          this.allowedProsthesisTypes.some(allowed => allowed.name === type.name)
        );
        
        // Если на сервере нет нужных типов, используем локальный список
        if (this.prosthesisTypes.length === 0) {
          this.prosthesisTypes = this.allowedProsthesisTypes;
        }
        
        this.prosthesisVendors = vendors || [];
        this.prosthesisForms = forms || [];
        
      } catch (error) {
        console.error('Ошибка загрузки справочных данных:', error);
        this.error = 'Ошибка загрузки справочных данных';
        // Используем локальный список как fallback
        this.prosthesisTypes = this.allowedProsthesisTypes;
      }
    },
    
    async fetchProsthesis() {
      this.loading = true;
      this.error = null;
      
      try {
        const tokenValid = await this.checkToken();
        if (!tokenValid) {
          this.error = 'Ошибка авторизации. Пожалуйста, войдите снова.';
          return;
        }
        
        const response = await authService.getProstheses();
        
        if (!Array.isArray(response)) {
          throw new Error('Некорректный формат данных протезов');
        }
        
        this.prosthesis = response.find(p => String(p.patient) === String(this.patientId)) || null;
      } catch (error) {
        console.error('Ошибка загрузки данных протеза:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка загрузки данных';
        
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    async saveChanges() {
      // Проверка обязательных полей
      if (!this.editForm.type || !this.editForm.date || this.editForm.stable === '') {
        this.error = 'Заполните все обязательные поля (Тип, Дата установки, Стабильность)';
        return;
      }

      // Проверка, что выбран разрешенный тип
      const allowedTypeNames = this.allowedProsthesisTypes.map(t => t.name);
      if (!allowedTypeNames.includes(this.editForm.type)) {
        this.error = `Выбран недопустимый тип протеза. Разрешены только: ${allowedTypeNames.join(', ')}`;
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
          stable: this.editForm.stable,
          patient: this.patientId
        };

        if (this.prosthesis?.id) {
          // Обновляем существующий протез
          const updated = await authService.saveProsthesis(prosthesisData, this.prosthesis.id);
          this.prosthesis = { ...this.prosthesis, ...updated };
          this.showSuccessMessage('Данные протеза успешно обновлены');
        } else {
          // Создаем новый протез
          const created = await authService.saveProsthesis(prosthesisData);
          this.prosthesis = created;
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
      // Можно заменить на красивый toast или alert
      alert(message);
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
      this.isEditing = true;
    },
    
    startEditing() {
      this.editForm = {
        type: this.getProsthesisTypeName(this.prosthesis.type),
        vendor: this.getProsthesisVendorName(this.prosthesis.vendor),
        batch: this.prosthesis.batch,
        date: this.prosthesis.date ? this.prosthesis.date.split('T')[0] : '',
        form: this.getProsthesisFormName(this.prosthesis.form),
        stable: this.prosthesis.stable,
        patient: this.patientId
      };
      this.isEditing = true;
    },
    
    getProsthesisTypeName(typeId) {
      // Ищем сначала в загруженных с сервера типах
      const type = this.prosthesisTypes.find(t => t.id === typeId) || 
                   this.allowedProsthesisTypes.find(t => t.id === typeId);
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
    
    async checkToken() {
      try {
        return await authService.checkAndRefreshToken();
      } catch (error) {
        console.error('Ошибка проверки токена:', error);
        this.error = 'Ошибка авторизации. Пожалуйста, войдите снова.';
        this.logout();
        return false;
      }
    },
    
    cancelEditing() {
      this.isEditing = false;
    },
    
    goToPatient() {
      this.$router.push({ name: 'PatientDetail', params: { id: this.patientId } });
    },
    
    goBack() {
      this.$router.push('/patients');
    },
    
    logout() {
      this.logoutAction().then(() => {
        this.$router.push('/');
      });
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
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-btn {
  background: none;
  border: none;
  padding: 0 16px;
  cursor: pointer;
}

.prosthesis-info-container {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
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
  margin: 0 auto;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #7fa11e;
}

.prosthesis-info h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
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

.prosthesis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
.suggestions {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #e6eec6;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  width: calc(100% - 2px); /* Учитываем границу */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.suggestions div {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestions div:hover {
  background-color: #f0f0f0;
}

.form-group {
  position: relative;
}
</style>