<template>
  <div class="login-page">
    <div class="centered-container">
      <div class="content-wrapper">
        <AppHeader />
        <LoginForm @login="handleLogin" />
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { mapActions } from 'vuex';

export default {
  name: "LoginPage",
  components: {
    AppHeader,
    LoginForm
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin(credentials) {
      try {
        await this.login(credentials);
        this.$router.push('/dashboard'); // Redirect to dashboard after successful login
      } catch (error) {
        // Error is already handled by the store
        console.error('Login failed:', error);
      }
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