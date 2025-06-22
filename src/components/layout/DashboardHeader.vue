<template>
  <header class="dashboard-header">
    <img class="dashboard-logo" :src="logo" alt="Logo" />
    <h1 class="dashboard-title">ЦИФРОВОЙ РЕГИСТР ПАЦИЕНТОВ ЦЕНТРА ИЛИЗАРОВА</h1>
    <button class="logout-button" @click="$emit('logout')">Выход</button>
  </header>
</template>

<script>
import logo from '@/assets/2025-03-10_18-35-17-picaai-Photoroom-1.png';
export default {
  name: 'DashboardHeader',
  data() {
    return { logo };
  }
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 32px;
  height: 70px;
  box-sizing: border-box;
}
.dashboard-logo {
  height: 60px;
  width: auto;
  flex-shrink: 0;
}
.dashboard-title {
  flex: 1;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #7a7a7a;
  letter-spacing: 2px;
  margin: 0;
}
.logout-button {
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

.logout-button:hover {
  background: #aa0000;
}
@media (max-width: 600px) {
  .dashboard-header {
    flex-direction: column;
    height: auto;
    padding: 12px;
    gap: 10px;
  }
  .dashboard-title {
    font-size: 16px;
    letter-spacing: 1px;
  }
  .dashboard-logo {
    height: 40px;
  }
  .logout-button {
    font-size: 15px;
    padding: 6px 16px;
    margin-left: 0;
  }
}
</style> 