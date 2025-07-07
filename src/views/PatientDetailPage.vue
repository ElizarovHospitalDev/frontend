<template>
  <div class="patient-detail-page">
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
        <div class="menu-item active">Пациент</div>
        <div class="menu-item" @click="goToProsthesis">Протез</div>
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
        
        
        <div class="patient-info-container">
          <div v-if="loading" class="loading">Загрузка данных пациента...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          
          <div v-else-if="!patient" class="no-patient">
            <h2>Пациент не найден</h2>
            <button class="add-btn" @click="goBack">
              Вернуться к списку пациентов
            </button>
          </div>
          
          <div v-else class="patient-info">
            <div class="patient-header">
              <h2>{{ getFullName(patient) }}</h2>
              <div class="header-actions">
                <button class="edit-btn" @click="startEditing" v-if="!isEditing">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  Редактировать
                </button>
                <button class="delete-btn" @click="confirmDelete">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <div v-if="!isEditing">
              <div class="info-row">
                <div class="info-label">Дата рождения:</div>
                <div class="info-value">{{ formatDate(patient.birthday) }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Телефон:</div>
                <div class="info-value">{{ formatPhone(patient.mobile_phone) }}</div>
              </div>
              <div class="info-row" v-if="patient.address">
                <div class="info-label">Адрес:</div>
                <div class="info-value">{{ patient.address }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Пол:</div>
                <div class="info-value">{{ patient.sex === 'M' ? 'Мужской' : 'Женский' }}</div>
              </div>
              
              
            </div>
            
            <form v-else @submit.prevent="saveChanges" class="edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="lastName">Фамилия *</label>
                  <input 
                    id="lastName"
                    v-model="editForm.last_name"
                    type="text"
                    required
                    placeholder="Введите фамилию"
                  >
                </div>
                
                <div class="form-group">
                  <label for="firstName">Имя *</label>
                  <input 
                    id="firstName"
                    v-model="editForm.first_name"
                    type="text"
                    required
                    placeholder="Введите имя"
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="middleName">Отчество</label>
                <input 
                  id="middleName"
                  v-model="editForm.middle_name"
                  type="text"
                  placeholder="Введите отчество"
                >
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="birthday">Дата рождения *</label>
                  <input 
                    id="birthday"
                    v-model="editForm.birthday"
                    type="date"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="phone">Телефон *</label>
                  <input 
                    id="phone"
                    v-model="editForm.mobile_phone"
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__"
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label>Пол *</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      v-model="editForm.sex" 
                      value="M"
                      required
                    >
                    Мужской
                  </label>
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      v-model="editForm.sex" 
                      value="W"
                      required
                    >
                    Женский
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="address">Адрес *</label>
                <textarea 
                  id="address"
                  v-model="editForm.address"
                  placeholder="Введите адрес"
                  rows="3"
                  required
                ></textarea>
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
  name: 'PatientDetailPage',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      patient: null,
      loading: true,
      error: null,
      isEditing: false,
      saving: false,
      searchQuery: '',
      editForm: {
        first_name: '',
        last_name: '',
        middle_name: '',
        birthday: '',
        mobile_phone: '',
        sex: '',
        address: ''
      }
    };
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    getFullName(patient) {
      return `${patient.last_name} ${patient.first_name} ${patient.middle_name || ''}`.trim();
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Не указана';
      return new Date(dateString).toLocaleDateString('ru-RU');
    },
    
    formatPhone(phone) {
      if (!phone) return 'Не указан';
      // Форматирование телефона в читаемый вид
      return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
    },

    formatPhoneInput(value) {
      // Удаляем все нецифровые символы
      let numbers = value.replace(/\D/g, '');
      if (!numbers.startsWith('7')) {
        numbers = '7' + numbers;
      }
      numbers = numbers.slice(0, 11); // максимум 11 цифр
      let formatted = '+7';
      if (numbers.length > 1) {
        formatted += ' (' + numbers.slice(1, 4);
      }
      if (numbers.length >= 4) {
        formatted += ') ' + numbers.slice(4, 7);
      }
      if (numbers.length >= 7) {
        formatted += '-' + numbers.slice(7, 9);
      }
      if (numbers.length >= 9) {
        formatted += '-' + numbers.slice(9, 11);
      }
      return formatted;
    },
    
    async fetchPatientDetails() {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.getPatient(this.id);
        this.patient = response;
      } catch (error) {
        console.error('Ошибка загрузки данных пациента:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка при загрузке данных';
        
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    startEditing() {
      this.editForm = { 
        ...this.patient,
        birthday: this.patient.birthday ? new Date(this.patient.birthday).toISOString().split('T')[0] : ''
      };
      this.isEditing = true;
    },
    
    cancelEditing() {
      this.isEditing = false;
    },
    
    async saveChanges() {
      this.saving = true;
      let hasErrors = false;
      if (hasErrors) {
        return;
      }
      try {
        const formattedData = {
          first_name: this.editForm.first_name,
          last_name: this.editForm.last_name,
          middle_name: this.editForm.middle_name || "",
          birthday: this.editForm.birthday,
          mobile_phone: this.editForm.mobile_phone.replace(/\D/g, ''),
          sex: this.editForm.sex,
          address: this.editForm.address || ""
        };
        
        const updated = await authService.updatePatient(this.id, formattedData);
        this.patient = updated;
        this.isEditing = false;
        this.showSuccessMessage('Данные пациента успешно обновлены');
      } catch (error) {
        console.error('Ошибка обновления пациента:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка при обновлении данных';
      } finally {
        this.saving = false;
      }
    },
    
    showSuccessMessage(message) {
      alert(message);
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
    
    goToMicroflora() {
      this.$router.push(`/patients/${this.patientId}/microflora`);
    },
    
    goBack() {
      this.$router.push('/patients');
    },
    
    handleSearch: debounce(function() {
      // Логика поиска может быть реализована здесь
    }, 300),
    
    clearSearch() {
      this.searchQuery = '';
    },
    
    logout() {
      this.logoutAction().then(() => {
        this.$router.push('/');
      });
    },
    async confirmDelete() {
      if (confirm('Вы уверены, что хотите удалить этого пациента? Это действие нельзя отменить.')) {
        try {
          console.log('Patient object:', this.patient);
          console.log('Patient ID type:', typeof this.id);
          console.log('Patient ID value:', this.id);
          const response = await authService.deletePatient(this.id);
          console.log('Delete response:', response);
          this.$router.push('/patients');
        } catch (error) {
          console.error('Error deleting patient:', error);
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          }
          alert('Ошибка при удалении пациента: ' + (error.message || 'Неизвестная ошибка'));
        }
      }
    }
  },
  async created() {
    await this.fetchPatientDetails();
  },
  watch: {
    id: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchPatientDetails();
        }
      }
    },
    'editForm.mobile_phone': {
      handler(value) {
        if (!value) return;
        const formatted = this.formatPhoneInput(value);
        if (formatted !== value) {
          this.editForm.mobile_phone = formatted;
        }
      },
      immediate: false
    }
  }
};
</script>

<style scoped>
.patient-detail-page {
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

.patient-info-container {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #ff4444;
}

.no-patient {
  text-align: center;
  padding: 40px 20px;
}

.no-patient h2 {
  color: #333;
  margin-bottom: 10px;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
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

.patient-info h2 {
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

.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.edit-btn, .delete-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.edit-btn {
  background: #9ac531;
}

.edit-btn:hover {
  background: #7fa11e;
}

.delete-btn {
  background: #ff4444;
}

.delete-btn:hover {
  background: #cc0000;
}

.edit-form {
  margin-top: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
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

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
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