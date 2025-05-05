<template>
  <div class="forgot-password-form">
    <div class="form-container">
      <h2 class="form-title">Восстановление пароля</h2>
      <div class="divider"></div>
      
      <div class="form-group">
        <label class="input-label">Email (Логин)</label>
        <input 
          type="email" 
          class="form-input"
          placeholder="Введите ваш email"
          v-model="email"
        />
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
      
      <button class="submit-button" @click="handleSubmit" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Отправить' }}
      </button>
      
      <router-link to="/" class="back-to-login">
        Вернуться к входу
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: "ForgotPasswordForm",
  data() {
    return {
      email: ""
    };
  },
  computed: {
    ...mapState('auth', ['loading', 'error'])
  },
  methods: {
    ...mapActions('auth', ['requestPasswordReset']),
    async handleSubmit() {
      if (!this.email) {
        return;
      }
      try {
        await this.requestPasswordReset(this.email);
        // Show success message or redirect
        this.$router.push('/reset-password-sent');
      } catch (error) {
        // Error is already handled by the store
        console.error('Password reset request failed:', error);
      }
    }
  }
};
</script>

<style scoped>
.forgot-password-form {
  width: 100%;
  display: flex;
  justify-content: center;
}

.form-container {
  background-color: #ffffff;
  border: 4px solid rgba(154, 197, 49, 0.24);
  border-radius: 20px;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 40px;
  width: 100%;
  max-width: 666px;
}

.form-title {
  color: rgba(0, 0, 0, 0.7);
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 20px 0;
}

.divider {
  height: 1px;
  background-color: #000000;
  margin: 0 auto 40px;
  width: 100%;
  max-width: 462px;
}

.form-group {
  margin-bottom: 40px;
}

.input-label {
  color: #898989;
  font-size: 20px;
  font-weight: 300;
  display: block;
  margin-bottom: 8px;
  text-align: left;
}

.form-input {
  border: 1px solid #000000;
  border-radius: 8px;
  width: 100%;
  height: 68px;
  padding: 0 15px;
  font-size: 18px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #9ac531;
}

.submit-button {
  background-color: #9ac531;
  border: none;
  border-radius: 12px;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  width: 269px;
  height: 57px;
  display: block;
  margin: 40px auto 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #88b32a;
}

.back-to-login {
  color: #363636;
  font-size: 18px;
  font-weight: 200;
  text-decoration: underline;
  display: block;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.back-to-login:hover {
  color: #000000;
}

@media (max-width: 768px) {
  .form-container {
    padding: 25px;
  }
  
  .submit-button {
    width: 100%;
    max-width: 269px;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 20px;
  }
  
  .form-title {
    font-size: 26px;
  }
  
  .input-label, .form-input {
    font-size: 16px;
  }
  
  .form-input {
    height: 56px;
  }
  
  .submit-button {
    height: 50px;
    font-size: 24px;
  }
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  margin-top: 5px;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 