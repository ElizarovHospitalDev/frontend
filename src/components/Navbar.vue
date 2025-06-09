<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/" class="brand-link">
        <span class="brand-name">Медицинская система</span>
      </router-link>
    </div>
    
    <div class="nav-links">
      <router-link to="/patients" class="nav-link">
        <i class="fas fa-users"></i>
        Пациенты
      </router-link>
      <router-link to="/arthroplasty-types" class="nav-link">
        <i class="fas fa-list"></i>
        Формы артропластики
      </router-link>
      <button v-if="isAuthenticated" @click="logout" class="nav-link logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        Выйти
      </button>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NavigationBar',
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    ...mapActions('auth', ['logout'])
  }
};
</script>

<style scoped>
.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.brand-name {
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #666;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-link.router-link-active {
  background: #9ac531;
  color: white;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
}

.logout-btn:hover {
  color: #ff4444;
}
</style>