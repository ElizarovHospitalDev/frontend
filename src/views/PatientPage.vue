<template>
  <div class="dashboard-page">
    <DashboardHeader />
    
    <div class="search-section">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск по ФИО..." 
          class="search-input"
          @input="handleSearch"
        />
        <button class="search-btn">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#666"/>
          </svg>
        </button>
      </div>
      <button class="add-patient-btn" @click="addNewPatient">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#fff"/>
        </svg>
        Добавить пациента
      </button>
    </div>

    <div class="results-section">
      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredPatients.length === 0" class="no-results">
        Пациенты не найдены
      </div>
      <div v-else class="patients-list">
        <div v-for="patient in filteredPatients" :key="patient.id" class="patient-card">
          <div class="patient-info">
            <h3>{{ getFullName(patient) }}</h3>
            <p>Дата рождения: {{ formatDate(patient.birthday) }}</p>
            <p>Телефон: {{ patient.mobile_phone }}</p>
            <p v-if="patient.address">Адрес: {{ patient.address }}</p>
          </div>
          <button class="select-patient-btn" @click="selectPatient(patient)">
            Выбрать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.patient-info {
  flex: 1;
}

.patient-card h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.patient-card p {
  margin: 0;
  color: #666;
}

.select-patient-btn {
  background: #9ac531;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.select-patient-btn:hover {
  background: #7fa11e;
}
</style>

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
    },
    selectPatient(patient) {
      console.log('Выбран пациент:', patient);
      this.$router.push(`/patients/${patient.id}`);
    }
  },
  created() {
    this.fetchPatients();
  }
};
</script>