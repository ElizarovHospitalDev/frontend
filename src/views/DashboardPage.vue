<template>
  <div class="dashboard-page">
    <DashboardHeader @logout="logout" />
    <div class="search-section">
      <div class="search-container">
        <input
          class="search-input"
          type="text"
          placeholder="Введите ФИО пациента"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="#9ac531" stroke-width="2" fill="none"/><line x1="14" y1="14" x2="19" y2="19" stroke="#9ac531" stroke-width="2"/></svg>
        </button>
      </div>
      <button class="add-patient-btn" @click="addNewPatient">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <line x1="10" y1="4" x2="10" y2="16" stroke="#fff" stroke-width="2"/>
          <line x1="4" y1="10" x2="16" y2="10" stroke="#fff" stroke-width="2"/>
        </svg>
        Добавить пациента
      </button>
    </div>
    <div class="results-section">
      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="patients.length === 0" class="no-results">Пациенты не найдены</div>
      <div v-else class="patients-list">
        <div v-for="patient in filteredPatients" :key="patient.id" class="patient-card">
          <h3>{{ getFullName(patient) }}</h3>
          <p>Дата рождения: {{ formatDate(patient.birthday) }}</p>
          <p>Телефон: {{ patient.mobile_phone }}</p>
          <p>Пол: {{ patient.sex === 'M' ? 'Мужской' : 'Женский' }}</p>
          <p>Адрес: {{ patient.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardHeader from '@/components/layout/DashboardHeader.vue';
import { mapActions } from 'vuex';
import authService from '@/services/auth.service';

export default {
  name: 'DashboardPage',
  components: { DashboardHeader },
  data() {
    return {
      searchQuery: '',
      patients: [],
      loading: false,
      error: null
    };
  },
  computed: {
    filteredPatients() {
      if (!this.searchQuery) return this.patients;
      const query = this.searchQuery.toLowerCase();
      return this.patients.filter(patient => {
        const fullName = this.getFullName(patient).toLowerCase();
        const phone = patient.mobile_phone?.toLowerCase() || '';
        const address = patient.address?.toLowerCase() || '';
        
        return fullName.includes(query) || 
               phone.includes(query) || 
               address.includes(query);
      });
    }
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    getFullName(patient) {
      return `${patient.last_name} ${patient.first_name} ${patient.middle_name}`.trim();
    },
    async fetchPatients() {
      this.loading = true;
      this.error = null;
      try {
        this.patients = await authService.getPatients();
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке пациентов';
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      console.log('Searching for:', this.searchQuery);
    },
    addNewPatient() {
      this.$router.push('/add-patient');
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('ru-RU');
    },
    logout() {
      this.logoutAction().then(() => {
        this.$router.push('/');
      });
    }
  },
  created() {
    this.fetchPatients();
  }
};
</script>

<style scoped>
.dashboard-page {
  background: #fff;
  min-height: 100vh;
  font-family: "JetBrains Mono", Helvetica;
  padding: 0;
}
.dashboard-header-actions {
  display: flex;
  justify-content: flex-end;
  padding: 10px 30px 0 0;
}
.logout-button {
  background: #9ac531;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 8px 24px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-button:hover {
  background: #7fa11e;
}
.search-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 20px 0 20px;
  gap: 20px;
}
.search-container {
  display: flex;
  align-items: center;
  flex: 1;
  border: 1px solid #e6eec6;
  border-radius: 12px;
  padding: 8px 16px;
  background: #fafcf6;
  max-width: 800px;
}
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  color: #333;
  outline: none;
  padding: 8px 0;
}
.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 8px;
  display: flex;
  align-items: center;
}
.add-patient-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #9ac531;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.add-patient-btn:hover {
  background: #7fa11e;
}
.add-patient-btn svg {
  width: 20px;
  height: 20px;
}
.results-section {
  margin: 20px;
  border: 1px solid #e6eec6;
  border-radius: 12px;
  min-height: 400px;
  background: #fff;
}
.loading, .error, .no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #ff4444;
}

.patients-list {
  padding: 20px;
}

.patient-card {
  background: #fafcf6;
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.patient-card h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.patient-card p {
  margin: 0;
  color: #666;
}
</style> 