<template>
  <div class="login-page">
    <div class="centered-container">
      <div class="content-wrapper">
        <div class="header-group">
          <div class="logo-section">
            <img class="logo" alt="Logo" :src="PicaaiPhotoroom1" />
            <div class="header-text">
              <h1 class="title">
                ЦИФРОВОЙ РЕГИСТР ПАЦИЕНТОВ<br />
                ЦЕНТРА ИЛИЗАРОВА
              </h1>
              <p class="institution-info">
                Федеральное государственное бюджетное учреждение<br />
                «Национальный медицинский исследовательский центр<br />
                травматологии и ортопедии имени академика Г.А. Илизарова»<br />
                Министерства здравоохранения Российской Федерации
              </p>
            </div>
          </div>
        </div>

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
            
            <a href="#" class="forgot-password">Забыли пароль?</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PicaaiPhotoroom1 from "@/assets/2025-03-10_18-35-17-picaai-Photoroom-1.png";
import eyeOpen from "@/assets/eye open_.svg";
import eyeClosed from "@/assets/eye closed_.svg";

export default {
  name: "LoginPage",
  data() {
    return {
      PicaaiPhotoroom1,
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
      // Здесь будет логика входа
      console.log("Логин:", this.login, "Пароль:", this.password);
    }
  },
};
</script>

<style scoped>
.login-page {
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "JetBrains Mono", Helvetica;
  padding: 20px;
}

.centered-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.header-group {
  width: 100%;
  display: flex;
  justify-content: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 30px;
  max-width: 900px;
  flex-wrap: wrap;
  justify-content: center;
}

.logo {
  height: 230px;
  width: auto;
  margin-left: 15px;
}

.header-text {
  text-align: center;
  max-width: 600px;
}

.title {
  color: rgba(0, 0, 0, 0.7);
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.institution-info {
  color: #000000;
  font-size: 16px;
  font-weight: 100;
  line-height: 1.5;
  margin: 0;
}

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
  .logo-section {
    flex-direction: column;
    text-align: center;
  }
  
  .logo {
    height: 180px;
    margin-bottom: 20px;
    
  }
  
  .form-container {
    padding: 25px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .institution-info {
    font-size: 14px;
  }
  
  .login-button {
    width: 100%;
    max-width: 269px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    gap: 30px;
  }
  
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