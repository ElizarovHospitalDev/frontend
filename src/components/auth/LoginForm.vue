<template>
  <div class="login-form">
    <div class="form-container">
      <h2 class="form-title">Вход в личный кабинет</h2>
      <div class="divider"></div>
      
      <div class="form-group">
        <label class="input-label">Логин</label>
        <input 
          type="text" 
          class="form-input"
          placeholder="Введите ваш логин"
          v-model="login"
        />
      </div>
      
      <div class="form-group">
        <label class="input-label">Пароль</label>
        <div class="password-input">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            class="form-input"
            placeholder="Введите ваш пароль"
            v-model="password"
          />
          <button 
            class="toggle-password" 
            @click="togglePasswordVisibility"
            type="button"
            :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
          >
            <img 
              class="eye-icon" 
              alt="Eye icon" 
              :src="showPassword ? eyeOpen : eyeClosed" 
            />
          </button>
        </div>
      </div>
      
      <button class="login-button" @click="handleLogin">Войти</button>
      
      <router-link to="/forgot-password" class="forgot-password">
        Забыли пароль?
      </router-link>
    </div>
  </div>
</template>

<script>
import eyeOpen from "@/assets/eye open_.svg";
import eyeClosed from "@/assets/eye closed_.svg";

export default {
  name: "LoginForm",
  data() {
    return {
      eyeOpen,
      eyeClosed,
      showPassword: false,
      password: "",
      login: ""
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleLogin() {
      this.$emit('login', { username: this.login, password: this.password });
    }
  }
};
</script>

<style scoped>
.login-form {
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

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  height: 24px;
  width: 24px;
  transition: opacity 0.2s;
}

.toggle-password:hover .eye-icon {
  opacity: 0.8;
}

.login-button {
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

.login-button:hover {
  background-color: #88b32a;
}

.forgot-password {
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

.forgot-password:hover {
  color: #000000;
}

@media (max-width: 768px) {
  .form-container {
    padding: 25px;
  }
  
  .login-button {
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
  
  .login-button {
    height: 50px;
    font-size: 24px;
  }
}
</style> 