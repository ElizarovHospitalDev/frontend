<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import authService from '@/services/auth.service';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  async mounted() {
    // Check token on app initialization
    await authService.checkAndRefreshToken();
  }
};
</script>

<style>
#app {
  font-family: "JetBrains Mono", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}
</style>