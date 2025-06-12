<template>
  <div class="microflora-page">
    <div class="header">
      <div class="header-content">
        <img src="@/assets/2025-03-10_18-35-17-picaai-Photoroom-1.png" alt="Logo" class="logo">
        <h1>ЦИФРОВОЙ РЕГИСТР ПАЦИЕНТОВ ЦЕНТРА ИЛИЗАРОВА</h1>
      </div>
      <button class="logout-btn" @click="logout">Выход</button>
    </div>
    
    <div class="content">
      <div class="sidebar">
        <div class="menu-item" @click="goToPatient">Пациент</div>
        <div class="menu-item" @click="goToProsthesis">Протез</div>
        <div class="menu-item" @click="goToTreatment">Лечение</div>
        <div class="menu-item" @click="goToComorbidPathologies">Коморбидные патологии</div>
        <div class="menu-item active">Микрофлора</div>
        <div class="menu-item" @click="goToOperations">Операции</div>
        <div class="menu-item" @click="goToAnalysis">Анализы</div>
        <div class="menu-item" @click="goToOutcomes">Итоги лечения</div>
        
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          Назад
        </button>
      </div>
      
      <div class="main-content">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по микрофлоре" 
            class="search-input"
            @input="handleSearch"
          >
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-search-btn"
          >
            ×
          </button>
          <button class="search-btn" @click="handleSearch">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#666"/>
            </svg>
          </button>
        </div>
        
        <div class="microflora-actions">
          <button class="add-btn" @click="startAdding" v-if="!microfloraData">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Добавить данные
          </button>
          <button class="edit-btn" @click="startEditing" v-else>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
            </svg>
            Редактировать
          </button>
          <button class="delete-btn" @click="confirmDelete" v-if="microfloraData">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
            </svg>
            Удалить
          </button>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных о микрофлоре...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="microflora-list">
          <div v-if="!microfloraData" class="no-microflora">
            <h2>Данные о микрофлоре отсутствуют</h2>
            <p>Для этого пациента нет информации о микрофлоре.</p>
          </div>
          
          <div v-else class="microflora-item">
            <div class="info-row">
              <div class="info-label">Микроорганизм:</div>
              <div class="info-value">{{ getMicroorganismName(microfloraData.microorganism) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">MRSE/MRSA:</div>
              <div class="info-value">{{ microfloraData.mrse_mrsa ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Pseudomonas aeruginosa:</div>
              <div class="info-value">{{ microfloraData.pseudomonas_aeruginosa ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Klebsiella pneumoniae:</div>
              <div class="info-value">{{ microfloraData.klebsiella_pneumoniae ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Acinetobacter baumannii:</div>
              <div class="info-value">{{ microfloraData.acinetobacter_baumanii ? 'Да' : 'Нет' }}</div>
            </div>
          </div>
        </div>
        
        <div v-if="isEditing" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingMicrofloraId ? 'Редактирование данных' : 'Добавление данных' }}</h2>
            
            <form @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.mrse_mrsa">
                  MRSE/MRSA
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.pseudomonas_aeruginosa">
                  Pseudomonas aeruginosa
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.klebsiella_pneumoniae">
                  Klebsiella pneumoniae
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.acinetobacter_baumanii">
                  Acinetobacter baumannii
                </label>
              </div>
              
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="cancelEditing">Отмена</button>
                <button type="submit" class="save-btn" :disabled="saving">
                  {{ saving ? 'Сохранение...' : 'Сохранить' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import authService from '@/services/auth.service';
import debounce from 'lodash/debounce';

export default {
  name: 'PatientMicroflora',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      microfloraData: null,
      treatmentId: null,
      loading: true,
      error: null,
      isEditing: false,
      editingMicrofloraId: null,
      saving: false,
      searchQuery: '',
      editForm: {
        microorganism: '',
        mrse_mrsa: false,
        pseudomonas_aeruginosa: false,
        klebsiella_pneumoniae: false,
        acinetobacter_baumanii: false,
        treatment_fk: null
      }
    };
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    getMicroorganismName(value) {
      const names = {
        'mrse_mrsa': 'MRSE/MRSA',
        'pseudomonas_aeruginosa': 'Pseudomonas aeruginosa',
        'klebsiella_pneumoniae': 'Klebsiella pneumoniae',
        'acinetobacter_baumanii': 'Acinetobacter baumannii'
      };
      return names[value] || 'Не указано';
    },
    
    async fetchTreatmentId() {
      try {
        const treatments = await authService.getTreatments();
        const patientTreatment = treatments.find(t => String(t.patient) === String(this.patientId));
        if (patientTreatment) {
          this.treatmentId = patientTreatment.id;
          return patientTreatment.id;
        }
        return null;
      } catch (error) {
        console.error('Ошибка загрузки данных о лечении:', error);
        return null;
      }
    },
    
    async fetchMicrofloraData() {
      this.loading = true;
      this.error = null;
      
      try {
        const treatmentId = await this.fetchTreatmentId();
        if (!treatmentId) {
          this.microfloraData = null;
          return;
        }
        
        const microfloras = await authService.getMicrofloras();
        const patientMicroflora = microfloras.find(m => m.treatment_fk === treatmentId);
        
        this.microfloraData = patientMicroflora || null;
        this.editForm.treatment_fk = treatmentId;
        
        if (patientMicroflora) {
          this.editingMicrofloraId = patientMicroflora.id;
        }
      } catch (error) {
        console.error('Ошибка загрузки данных о микрофлоре:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка загрузки данных';
        
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    startAdding() {
      this.editForm = {
        microorganism: '',
        mrse_mrsa: false,
        pseudomonas_aeruginosa: false,
        klebsiella_pneumoniae: false,
        acinetobacter_baumanii: false,
        treatment_fk: this.treatmentId
      };
      this.editingMicrofloraId = null;
      this.isEditing = true;
    },
    
    startEditing() {
      this.editForm = {
        microorganism: this.microfloraData.microorganism,
        mrse_mrsa: this.microfloraData.mrse_mrsa,
        pseudomonas_aeruginosa: this.microfloraData.pseudomonas_aeruginosa,
        klebsiella_pneumoniae: this.microfloraData.klebsiella_pneumoniae,
        acinetobacter_baumanii: this.microfloraData.acinetobacter_baumanii,
        treatment_fk: this.treatmentId
      };
      this.isEditing = true;
    },
    
    async saveChanges() {
      this.saving = true;
      this.error = null;

      try {
        const microfloraData = {
          microorganism: this.editForm.microorganism,
          mrse_mrsa: Boolean(this.editForm.mrse_mrsa),
          pseudomonas_aeruginosa: Boolean(this.editForm.pseudomonas_aeruginosa),
          klebsiella_pneumoniae: Boolean(this.editForm.klebsiella_pneumoniae),
          acinetobacter_baumanii: Boolean(this.editForm.acinetobacter_baumanii),
          treatment_fk: this.editForm.treatment_fk
        };

        if (!microfloraData.treatment_fk) {
          throw new Error('Необходимо указать лечение пациента');
        }

        if (this.editingMicrofloraId) {
          const updated = await authService.updateMicroflora(this.editingMicrofloraId, microfloraData);
          this.microfloraData = updated;
          this.showSuccessMessage('Данные о микрофлоре успешно обновлены');
        } else {
          const created = await authService.createMicroflora(microfloraData);
          this.microfloraData = created;
          this.editingMicrofloraId = created.id;
          this.showSuccessMessage('Данные о микрофлоре успешно сохранены');
        }

        this.isEditing = false;
      } catch (error) {
        console.error('Ошибка сохранения:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка при сохранении данных';
        
        if (error.response?.data?.details) {
          console.error('Детали ошибки:', error.response.data.details);
        }
      } finally {
        this.saving = false;
      }
    },
    
    async confirmDelete() {
      if (confirm('Вы уверены, что хотите удалить данные о микрофлоре?')) {
        try {
          await authService.deleteMicroflora(this.editingMicrofloraId);
          this.microfloraData = null;
          this.showSuccessMessage('Данные о микрофлоре успешно удалены');
        } catch (error) {
          console.error('Ошибка удаления:', error);
          this.error = error.response?.data?.message || error.message || 'Ошибка при удалении';
        }
      }
    },
    
    showSuccessMessage(message) {
      alert(message);
    },
    
    cancelEditing() {
      this.isEditing = false;
    },
    
    handleSearch: debounce(function() {
    }, 300),
    
    clearSearch() {
      this.searchQuery = '';
    },
    
    goToPatient() {
      this.$router.push({ name: 'PatientDetail', params: { id: this.patientId } });
    },
    
    goToProsthesis() {
      this.$router.push({ name: 'ProsthesisInfo', params: { id: this.patientId } });
    },
    
    goToTreatment() {
      this.$router.push({ name: 'PatientTreatment', params: { id: this.patientId } });
    },
    
    goToComorbidPathologies() {
      this.$router.push({ name: 'PatientComorbidPathologies', params: { id: this.patientId } });
    },
    
    goToOperations() {
      this.$router.push({ name: 'PatientOperations', params: { id: this.patientId } });
    },
    
    goToAnalysis() {
      this.$router.push({ name: 'PatientAnalysis', params: { id: this.patientId } });
    },
    
    goToOutcomes() {
      this.$router.push({ name: 'PatientOutcomes', params: { id: this.patientId } });
    },
    
    goBack() {
      this.$router.push('/patients');
    },
    
    logout() {
      this.logoutAction().then(() => {
        this.$router.push('/');
      });
    }
  },
  async created() {
    await this.fetchMicrofloraData();
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchMicrofloraData();
        }
      }
    }
  }
};
</script>

<style scoped>
.microflora-page {
  font-family: "JetBrains Mono", Helvetica, Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e6eec6;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  height: 40px;
  width: auto;
}

.header h1 {
  font-size: 18px;
  color: #666;
  margin: 0;
  font-weight: normal;
}

.logout-btn {
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
}

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px;
  background-color: #f8f8f8;
  border-right: 1px solid #e6eec6;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #333;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.menu-item.active {
  border-left-color: #9ac531;
  background-color: #f0f0f0;
  font-weight: 600;
}

.back-btn {
  margin-top: auto;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e6eec6;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  color: #333;
}

.back-icon {
  font-size: 18px;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #e6eec6;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  padding-right: 40px;
  border: none;
  outline: none;
  font-size: 16px;
}

.clear-search-btn {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 18px;
  padding: 0 8px;
}

.search-btn {
  background: none;
  border: none;
  padding: 0 16px;
  cursor: pointer;
}

.microflora-actions {
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
}

.add-btn, .edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover, .edit-btn:hover {
  background: #7fa11e;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #cc0000;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #ff4444;
}

.no-microflora {
  text-align: center;
  padding: 40px 20px;
}

.no-microflora h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-microflora p {
  color: #666;
  margin-bottom: 20px;
}

.microflora-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.microflora-item {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-label {
  width: 250px;
  font-weight: 600;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.edit-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.form-group select,
.form-group input[type="text"],
.form-group input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: #f5f5f5;
}

.checkbox-label input {
  width: auto;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn {
  padding: 10px 16px;
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn:hover {
  background: #7fa11e;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>