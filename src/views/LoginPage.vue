<template>
  <div class="login-page">
    <div class="centered-container">
      <div class="content-wrapper">
        <AppHeader />
        <LoginForm 
          @login="handleLogin" 
          :isLoading="isLoading"
          :error="errorMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: "LoginPage",
  components: {
    AppHeader,
    LoginForm
  },
  data() {
    return {
      errorMessage: '',
      timeoutDuration: 3000 // 3 seconds timeout
    };
  },
  computed: {
    ...mapState('auth', ['loading']),
    isLoading() {
      return this.loading;
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin(credentials) {
      console.log('Login attempt started:', { credentials });
      
      if (this.isLoading) {
        console.log('Login already in progress, ignoring request');
        return;
      }
      
      this.errorMessage = '';
      
      try {
        console.log('Creating timeout promise');
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            console.log('Timeout reached');
            reject(new Error('Превышено время ожидания ответа от сервера'));
          }, this.timeoutDuration);
        });

        console.log('Starting login request');
        // Race between login and timeout
        const result = await Promise.race([
          this.login(credentials),
          timeoutPromise
        ]);
        
        console.log('Login successful:', result);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login error details:', {
          error,
          message: error.message,
          response: error.response,
          status: error.response?.status
        });
        this.errorMessage = this.getErrorMessage(error);
      }
    },
    getErrorMessage(error) {
      console.log('Processing error message:', error);
      
      if (error.message.includes('timeout')) {
        return 'Сервер не отвечает. Пожалуйста, попробуйте позже.';
      }
      if (error.response?.status === 401) {
        return 'Неверный логин или пароль';
      }
      if (error.response?.status === 0) {
        return 'Нет соединения с сервером. Проверьте подключение к интернету.';
      }
      return error.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.';
    }
  }
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

@media (max-width: 480px) {
  .content-wrapper {
    gap: 30px;
  }
}
</style> 