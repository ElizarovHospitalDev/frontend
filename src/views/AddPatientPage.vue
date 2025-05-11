<template>
  <div class="add-patient-page">
    <div class="page-header">
      <h1>Добавление нового пациента</h1>
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#333"/>
        </svg>
        Назад
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="patient-form">
      <div v-if="errors.general" class="error-message">
        {{ errors.general }}
      </div>

      <div class="form-group">
        <label for="lastName">Фамилия *</label>
        <input 
          id="lastName"
          v-model="form.last_name"
          type="text"
          required
          placeholder="Введите фамилию"
          :class="{ 'error': errors.last_name }"
        >
        <span v-if="errors.last_name" class="error-text">{{ errors.last_name }}</span>
      </div>

      <div class="form-group">
        <label for="firstName">Имя *</label>
        <input 
          id="firstName"
          v-model="form.first_name"
          type="text"
          required
          placeholder="Введите имя"
          :class="{ 'error': errors.first_name }"
        >
        <span v-if="errors.first_name" class="error-text">{{ errors.first_name }}</span>
      </div>

      <div class="form-group">
        <label for="middleName">Отчество</label>
        <input 
          id="middleName"
          v-model="form.middle_name"
          type="text"
          placeholder="Введите отчество"
        >
      </div>

      <div class="form-group">
        <label for="birthday">Дата рождения *</label>
        <input 
          id="birthday"
          v-model="form.birthday"
          type="date"
          required
          :class="{ 'error': errors.birthday }"
        >
        <span v-if="errors.birthday" class="error-text">{{ errors.birthday }}</span>
      </div>

      <div class="form-group">
        <label for="phone">Телефон *</label>
        <input 
          id="phone"
          v-model="form.mobile_phone"
          type="tel"
          required
          placeholder="+7 (___) ___-__-__"
          :class="{ 'error': errors.mobile_phone }"
        >
        <span v-if="errors.mobile_phone" class="error-text">{{ errors.mobile_phone }}</span>
      </div>

      <div class="form-group">
        <label>Пол *</label>
        <div class="radio-group">
          <label class="radio-label">
            <input 
              type="radio" 
              v-model="form.sex" 
              value="M"
              required
            >
            Мужской
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              v-model="form.sex" 
              value="F"
              required
            >
            Женский
          </label>
        </div>
        <span v-if="errors.sex" class="error-text">{{ errors.sex }}</span>
      </div>

      <div class="form-group">
        <label for="address">Адрес</label>
        <textarea 
          id="address"
          v-model="form.address"
          placeholder="Введите адрес"
          rows="3"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="goBack">Отмена</button>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import authService from '@/services/auth.service';

export default {
  name: 'AddPatientPage',
  data() {
    return {
      loading: false,
      form: {
        first_name: '',
        last_name: '',
        middle_name: '',
        birthday: '',
        mobile_phone: '',
        sex: '',
        address: ''
      },
      errors: {}
    };
  },
  methods: {
    goBack() {
      this.$router.push('/dashboard');
    },
    formatPhoneNumber(value) {
      // Удаляем все нецифровые символы
      const numbers = value.replace(/\D/g, '');
      
      // Форматируем номер телефона
      if (numbers.length <= 1) return numbers;
      if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
      if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
      if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
      return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      // Проверка обязательных полей
      if (!this.form.first_name.trim()) {
        this.errors.first_name = 'Имя обязательно для заполнения';
        isValid = false;
      }
      if (!this.form.last_name.trim()) {
        this.errors.last_name = 'Фамилия обязательна для заполнения';
        isValid = false;
      }
      if (!this.form.birthday) {
        this.errors.birthday = 'Дата рождения обязательна для заполнения';
        isValid = false;
      }
      if (!this.form.mobile_phone) {
        this.errors.mobile_phone = 'Телефон обязателен для заполнения';
        isValid = false;
      }
      if (!this.form.sex) {
        this.errors.sex = 'Выберите пол';
        isValid = false;
      }

      // Проверка формата телефона
      const phoneNumbers = this.form.mobile_phone.replace(/\D/g, '');
      if (phoneNumbers.length !== 11) {
        this.errors.mobile_phone = 'Неверный формат телефона';
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      try {
        // Форматируем данные перед отправкой
        const patientData = {
          ...this.form,
          mobile_phone: this.form.mobile_phone.replace(/\D/g, '') // Убираем все нецифровые символы
        };
        
        await authService.createPatient(patientData);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error creating patient:', error);
        if (error.response?.data) {
          this.errors = error.response.data;
        } else {
          this.errors = { general: 'Произошла ошибка при создании пациента' };
        }
      } finally {
        this.loading = false;
      }
    }
  },
  watch: {
    'form.mobile_phone'(value) {
      this.form.mobile_phone = this.formatPhoneNumber(value);
    }
  }
};
</script>

<style scoped>
.add-patient-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
}

.patient-form {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="tel"],
.form-group input[type="date"],
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e6eec6;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background: #fafcf6;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #9ac531;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
}

.cancel-btn {
  padding: 12px 24px;
  border: 1px solid #e6eec6;
  border-radius: 8px;
  background: #fff;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

.submit-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #9ac531;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #7fa11e;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-text {
  color: #c62828;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #c62828;
}
</style> 