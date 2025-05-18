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
        <div class="menu-item">Пациент</div>
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
          <input type="text" placeholder="Введите данные для поиска" class="search-input" />
          <button class="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#666"/>
            </svg>
          </button>
        </div>
        <div class="prosthesis-info-container">
          <div v-if="loading" class="loading">Загрузка данных протеза...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
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
            <!-- Режим просмотра -->
            <div v-if="!isEditing">
              <div class="info-row">
                <div class="info-label">Тип:</div>
                <div class="info-value">{{ prosthesisTypeName(prosthesis?.type) }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Производитель:</div>
                <div class="info-value">{{ prosthesis?.vendor || '' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Партия:</div>
                <div class="info-value">{{ prosthesis?.batch || '' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Дата установки:</div>
                <div class="info-value">{{ formatDate(prosthesis?.date) }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Форма:</div>
                <div class="info-value">{{ prosthesis?.form || '' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Стабильность:</div>
                <div class="info-value">
                  {{ prosthesisStabilityName(prosthesis?.stable) }}
                </div>
              </div>
            </div>
            <!-- Режим редактирования -->
            <form v-else @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label for="type">Тип *</label>
                <select id="type" v-model="editForm.type" required>
                  <option value="" disabled>Выберите тип</option>
                  <option value="1">Uni</option>
                  <option value="2">CR</option>
                  <option value="3">PS</option>
                  <option value="4">VVC</option>
                  <option value="5">Hinge</option>
                  <option value="6">Протез удален</option>
                  <option value="7">Спейсер</option>
                </select>
              </div>
              <div class="form-group">
                <label for="vendor">Производитель</label>
                <input id="vendor" v-model="editForm.vendor" type="text" placeholder="Введите производителя" />
              </div>
              <div class="form-group">
                <label for="batch">Партия</label>
                <input id="batch" v-model="editForm.batch" type="text" placeholder="Введите номер партии" />
              </div>
              <div class="form-group">
                <label for="date">Дата установки *</label>
                <input id="date" v-model="editForm.date" type="date" required />
              </div>
              <div class="form-group">
                <label for="form">Форма</label>
                <input id="form" v-model="editForm.form" type="text" placeholder="Введите форму протеза" />
              </div>
              <div class="form-group">
                <label for="stable">Стабильность *</label>
                <select id="stable" v-model.number="editForm.stable" required>
                  <option value="" disabled>Выберите стабильность</option>
                  <option value="1">Стабилен</option>
                  <option value="2">Нестабилен</option>
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
      required: true,
    },
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
        patient: null,
      }
    };
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    prosthesisTypeName(type) {
      const types = {
        1: 'Uni',
        2: 'CR',
        3: 'PS',
        4: 'VVC',
        5: 'Hinge',
        6: 'Протез удален',
        7: 'Спейсер'
      };
      return types[type] || '';
    },
    
    prosthesisStabilityName(stable) {
      if (stable === 1) return 'Стабилен';
      if (stable === 2) return 'Нестабилен';
      return '';
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    },
    
    async fetchProsthesis() {
      this.loading = true;
      this.error = null;
      try {
        const all = await authService.getProstheses();
        this.prosthesis = all.find(p => String(p.patient) === String(this.patientId)) || null;
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке данных протеза';
      } finally {
        this.loading = false;
      }
    },
    
    startEditing() {
      if (this.prosthesis) {
        this.editForm = {
          ...this.prosthesis,
          date: this.prosthesis.date ? this.prosthesis.date.split('T')[0] : '',
        };
      } else {
        this.editForm = {
          type: '',
          vendor: '',
          batch: '',
          date: '',
          form: '',
          stable: '',
          patient: this.patientId,
        };
      }
      this.isEditing = true;
    },
    
    cancelEditing() {
      this.isEditing = false;
    },
    
    async saveChanges() {
      this.saving = true;
      try {
        const formattedData = {
          ...this.editForm,
          patient: this.patientId,
        };
        
        if (this.prosthesis) {
          await authService.updateProsthesis(this.prosthesis.id, formattedData);
        } else {
          await authService.createProsthesis(formattedData);
        }
        
        await this.fetchProsthesis();
        this.isEditing = false;
        alert('Данные протеза успешно сохранены');
      } catch (error) {
        alert('Ошибка при сохранении данных протеза: ' + (error.message || 'Неизвестная ошибка'));
      } finally {
        this.saving = false;
      }
    },
    
    goBack() {
      this.$router.push('/patients');
    },
    
    logout() {
      this.logoutAction().then(() => {
        this.$router.push('/');
      });
    },
  },
  
  async created() {
    await this.fetchProsthesis();
  },
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
.form-group input[type="text"],
.form-group input[type="tel"],
.form-group input[type="date"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
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