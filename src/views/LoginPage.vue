<template>
  <div class="login-page">
    <div class="centered-container">
      <div class="content-wrapper">
        <AppHeader />
        <LoginForm 
          @login="handleLogin"
          :isLoading="isLoading"
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
      if (this.isLoading) return;
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('timeout'));
          }, this.timeoutDuration);
        });
        await Promise.race([
          this.login(credentials),
          timeoutPromise
        ]);
        this.$router.push('/patients');
      } catch (error) {
        // Ошибки теперь обрабатываются только в LoginForm.vue
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