<template>
  <div class="prosthesis-detail-page">
    <div class="header">
      <div class="header-content">
        <img src="@/assets/2025-03-10_18-35-17-picaai-Photoroom-1.png" alt="Logo" class="logo">
        <h1>ЦИФРОВОЙ РЕГИСТР ПАЦИЕНТОВ ЦЕНТРА ИЛИЗАРОВА</h1>
      </div>
      <div class="nav-links">
        <div class="nav-items">
          <router-link to="/patients" class="nav-link">
            <i class="fas fa-users"></i>
            Пациенты
          </router-link>
          <button class="logout-btn" @click="logout">Выход</button>
        </div>
        </div>
    </div>
    
    <div class="content">
      <div class="sidebar">
        <div class="menu-item" @click="goToPatient">Пациент</div>
        <div class="menu-item active">Протез</div>
        <div class="menu-item" @click="goToTreatment">Лечение</div>
        <div class="menu-item" @click="goToComorbidPathologies">Коморбидные патологии</div>
        <div class="menu-item" @click="goToMicroflora">Микрофлора</div>
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
            placeholder="Поиск по типу, производителю, партии или дате" 
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
        
        <div class="prosthesis-actions">
          <button class="add-btn" @click="startAdding">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Добавить протез
          </button>
        </div>
        
        <div v-if="loading" class="loading">Загрузка данных протезов...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="prosthesis-list">
          <div v-if="filteredProstheses.length === 0" class="no-prosthesis">
            <h2 v-if="searchQuery">Ничего не найдено</h2>
            <h2 v-else>Данные о протезах отсутствуют</h2>
            <p v-if="searchQuery">Попробуйте изменить параметры поиска</p>
            <p v-else>Для этого пациента нет информации о протезах.</p>
          </div>
          
          <div 
            v-for="(prosthesis, index) in filteredProstheses" 
            :key="prosthesis.id" 
            class="prosthesis-item"
          >
            <div class="prosthesis-header">
              <h3>Протез №{{ index + 1 }}</h3>
              <div class="prosthesis-actions">
                <button class="edit-btn" @click="startEditing(prosthesis)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  Редактировать
                </button>
                <button class="delete-btn" @click="confirmDelete(prosthesis.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Тип:</div>
              <div class="info-value">{{ getProsthesisTypeName(prosthesis.type) || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Производитель:</div>
              <div class="info-value">{{ getProsthesisVendorName(prosthesis.vendor) || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Партия:</div>
              <div class="info-value">{{ prosthesis.batch || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Дата установки:</div>
              <div class="info-value">{{ formatDate(prosthesis.date) || 'Не указана' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Вид:</div>
              <div class="info-value">{{ getProsthesisFormName(prosthesis.form) || 'Не указано' }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Стабильность:</div>
              <div class="info-value">{{ prosthesisStabilityName(prosthesis.stable) || 'Не указана' }}</div>
            </div>
          </div>
        </div>

        <div v-if="isEditing" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ editingProsthesisId ? 'Редактирование протеза' : 'Добавление нового протеза' }}</h2>
            <div class="form-note">
              Поля, отмеченные звездочкой (*), обязательны для заполнения
            </div>
            <form @submit.prevent="saveChanges" class="edit-form">
              <div class="form-group">
                <label for="type">Тип эндопротеза *</label>
                <div class="select-container">
                  <select 
                    id="type" 
                    v-model="editForm.type" 
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Выберите тип</option>
                    <option v-for="type in prosthesisTypes" 
                            :key="type.id" 
                            :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <button 
                    type="button" 
                    class="add-new-btn" 
                    @click="showNewTypeInput = true"
                  >
                    + Добавить
                  </button>
                </div>
                <input
                  v-if="showNewTypeInput"
                  v-model="newTypeName"
                  type="text"
                  placeholder="Введите название нового типа"
                  class="new-input"
                  @blur="addNewType"
                  @keyup.enter="addNewType"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="vendor">Производитель эндопротеза*</label>
                <div class="select-container">
                  <select 
                    id="vendor" 
                    v-model="editForm.vendor" 
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Выберите производителя</option>
                    <option v-for="vendor in prosthesisVendors" 
                            :key="vendor.id" 
                            :value="vendor.id">
                      {{ vendor.name }}
                    </option>
                  </select>
                  <button 
                    type="button" 
                    class="add-new-btn" 
                    @click="showNewVendorInput = true"
                  >
                    + Добавить
                  </button>
                </div>
                <input
                  v-if="showNewVendorInput"
                  v-model="newVendorName"
                  type="text"
                  placeholder="Введите название нового производителя"
                  class="new-input"
                  @blur="addNewVendor"
                  @keyup.enter="addNewVendor"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="form">Вид эндопротеза *</label>
                <div class="select-container">
                  <select 
                    id="form" 
                    v-model="editForm.form" 
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Выберите вид</option>
                    <option v-for="form in prosthesisForms" 
                            :key="form.id" 
                            :value="form.id">
                      {{ form.name }}
                    </option>
                  </select>
                  <button 
                    type="button" 
                    class="add-new-btn" 
                    @click="showNewFormInput = true"
                  >
                    + Добавить
                  </button>
                </div>
                <input
                  v-if="showNewFormInput"
                  v-model="newFormName"
                  type="text"
                  placeholder="Введите название нового вида"
                  class="new-input"
                  @blur="addNewForm"
                  @keyup.enter="addNewForm"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="batch">Партия эндопротеза *</label>
                <input id="batch" v-model="editForm.batch" type="text" placeholder="Введите номер партии" required>
              </div>
              
              <div class="form-group">
                <label for="date">Дата установки эндопротеза *</label>
                <input id="date" v-model="editForm.date" type="date" required>
              </div>
              
              <div class="form-group">
                <label for="stable">Стабильность эндопротеза *</label>
                <select id="stable" v-model="editForm.stable" required>
                  <option value="" disabled>Выберите стабильность</option>
                  <option :value="true">Стабилен</option>
                  <option :value="false">Нестабилен</option>
                </select>
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
  name: 'PatientProtes',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      prostheses: [],
      loading: true,
      isEditing: false,
      editingProsthesisId: null,
      saving: false,
      searchQuery: '',
      
      // Для добавления новых значений
      showNewTypeInput: false,
      newTypeName: '',
      showNewVendorInput: false,
      newVendorName: '',
      showNewFormInput: false,
      newFormName: '',
      
      editForm: {
        type: '',
        vendor: '',
        batch: '',
        date: '',
        form: '',
        stable: '',
        patient: null
      },
      prosthesisTypes: [],
      prosthesisVendors: [],
      prosthesisForms: []
    };
  },
  computed: {
    filteredProstheses() {
      if (!this.searchQuery) return this.prostheses;
      
      const query = this.searchQuery.toLowerCase();
      return this.prostheses.filter(prosthesis => {
        return (
          (prosthesis.batch && prosthesis.batch.toLowerCase().includes(query)) ||
          (this.getProsthesisTypeName(prosthesis.type) && 
            this.getProsthesisTypeName(prosthesis.type).toLowerCase().includes(query)) ||
          (this.getProsthesisVendorName(prosthesis.vendor) && 
            this.getProsthesisVendorName(prosthesis.vendor).toLowerCase().includes(query)) ||
          (prosthesis.date && this.formatDate(prosthesis.date).toLowerCase().includes(query))
        );
      });
    }
  },
  methods: {
    ...mapActions('auth', { logoutAction: 'logout' }),
    
    async loadReferenceData() {
      try {
        const [types, vendors, forms] = await Promise.all([
          authService.getProsthesisTypes(),
          authService.getProsthesisVendors(),
          authService.getProsthesisForms()
        ]);
        
        this.prosthesisTypes = types;
        this.prosthesisVendors = vendors;
        this.prosthesisForms = forms;
      } catch (error) {
        console.error('Ошибка загрузки справочных данных:', error);
        this.error = 'Ошибка загрузки справочных данных';
      }
    },
    
    async fetchProstheses() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authService.getProstheses();
        this.prostheses = response.filter(p => String(p.patient) === String(this.patientId));
      } catch (error) {
        console.error('Ошибка загрузки данных протезов:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка загрузки данных';
        
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    getProsthesisTypeName(typeId) {
      const type = this.prosthesisTypes.find(t => t.id === typeId);
      return type ? type.name : null;
    },
    
    getProsthesisVendorName(vendorId) {
      const vendor = this.prosthesisVendors.find(v => v.id === vendorId);
      return vendor ? vendor.name : null;
    },
    
    getProsthesisFormName(formId) {
      const form = this.prosthesisForms.find(f => f.id === formId);
      return form ? form.name : null;
    },
    
    prosthesisStabilityName(stable) {
      if (stable === true) return 'Стабилен';
      if (stable === false) return 'Нестабилен';
      return null;
    },
    
    formatDate(dateString) {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    },
    
    async addNewType() {
      if (!this.newTypeName.trim()) {
        this.showNewTypeInput = false;
        return;
      }

      try {
        const existingType = this.prosthesisTypes.find(
          type => type.name.toLowerCase() === this.newTypeName.trim().toLowerCase()
        );

        if (existingType) {
          this.editForm.type = existingType.id;
          this.showNewTypeInput = false;
          this.newTypeName = '';
          return;
        }

        const newType = await authService.createProsthesisType({ 
          name: this.newTypeName.trim() 
        });
        
        this.prosthesisTypes.push(newType);
        this.editForm.type = newType.id;
        this.showNewTypeInput = false;
        this.newTypeName = '';
      } catch (error) {
        console.error('Ошибка при добавлении нового типа:', error);
        this.error = 'Не удалось добавить новый тип';
        this.showNewTypeInput = false;
      }
    },
    
    async addNewVendor() {
      if (!this.newVendorName.trim()) {
        this.showNewVendorInput = false;
        return;
      }

      try {
        const existingVendor = this.prosthesisVendors.find(
          vendor => vendor.name.toLowerCase() === this.newVendorName.trim().toLowerCase()
        );

        if (existingVendor) {
          this.editForm.vendor = existingVendor.id;
          this.showNewVendorInput = false;
          this.newVendorName = '';
          return;
        }

        const newVendor = await authService.createProsthesisVendor({ 
          name: this.newVendorName.trim() 
        });
        
        this.prosthesisVendors.push(newVendor);
        this.editForm.vendor = newVendor.id;
        this.showNewVendorInput = false;
        this.newVendorName = '';
      } catch (error) {
        console.error('Ошибка при добавлении нового производителя:', error);
        this.error = 'Не удалось добавить нового производителя';
        this.showNewVendorInput = false;
      }
    },
    
    async addNewForm() {
      if (!this.newFormName.trim()) {
        this.showNewFormInput = false;
        return;
      }

      try {
        const existingForm = this.prosthesisForms.find(
          form => form.name.toLowerCase() === this.newFormName.trim().toLowerCase()
        );

        if (existingForm) {
          this.editForm.form = existingForm.id;
          this.showNewFormInput = false;
          this.newFormName = '';
          return;
        }

        const newForm = await authService.createProsthesisForm({ 
          name: this.newFormName.trim() 
        });
        
        this.prosthesisForms.push(newForm);
        this.editForm.form = newForm.id;
        this.showNewFormInput = false;
        this.newFormName = '';
      } catch (error) {
        console.error('Ошибка при добавлении новой формы:', error);
        this.error = 'Не удалось добавить новую форму';
        this.showNewFormInput = false;
      }
    },
    
    startAdding() {
      this.editForm = {
        type: '',
        vendor: '',
        batch: '',
        date: '',
        form: '',
        stable: '',
        patient: this.patientId
      };
      this.showNewTypeInput = false;
      this.newTypeName = '';
      this.showNewVendorInput = false;
      this.newVendorName = '';
      this.showNewFormInput = false;
      this.newFormName = '';
      this.editingProsthesisId = null;
      this.isEditing = true;
    },
    
    startEditing(prosthesis) {
      this.editForm = {
        type: prosthesis.type,
        vendor: prosthesis.vendor,
        batch: prosthesis.batch,
        date: prosthesis.date ? prosthesis.date.split('T')[0] : '',
        form: prosthesis.form,
        stable: prosthesis.stable,
        patient: this.patientId
      };
      this.showNewTypeInput = false;
      this.newTypeName = '';
      this.showNewVendorInput = false;
      this.newVendorName = '';
      this.showNewFormInput = false;
      this.newFormName = '';
      this.editingProsthesisId = prosthesis.id;
      this.isEditing = true;
    },
    
    async saveChanges() {

      let hasErrors = false;

      
      if (hasErrors) {
        return;
      }

      this.saving = true;
      this.error = null;

      try {
        const prosthesisData = {
          type: this.editForm.type,
          vendor: this.editForm.vendor,
          batch: this.editForm.batch,
          date: this.editForm.date,
          form: this.editForm.form,
          stable: Boolean(this.editForm.stable),
          patient: this.patientId
        };

        if (this.editingProsthesisId) {
          const updated = await authService.updateProsthesis(this.editingProsthesisId, prosthesisData);
          const index = this.prostheses.findIndex(p => p.id === this.editingProsthesisId);
          this.prostheses.splice(index, 1, updated);
          this.showSuccessMessage('Данные протеза успешно обновлены');
        } else {
          const created = await authService.createProsthesis(prosthesisData);
          this.prostheses.push(created);
          this.showSuccessMessage('Данные протеза успешно сохранены');
        }

        this.isEditing = false;
      } catch (error) {
        console.error('Ошибка сохранения:', error);
        this.error = error.response?.data?.message || error.message || 'Ошибка при сохранении данных';
      } finally {
        this.saving = false;
      }
    },
    
    showSuccessMessage(message) {
      alert(message);
    },
    
    cancelEditing() {
      this.isEditing = false;
      this.showNewTypeInput = false;
      this.newTypeName = '';
      this.showNewVendorInput = false;
      this.newVendorName = '';
      this.showNewFormInput = false;
      this.newFormName = '';
    },
    
    async confirmDelete(id) {
      if (confirm('Вы уверены, что хотите удалить этот протез?')) {
        try {
          await authService.deleteProsthesis(id);
          this.prostheses = this.prostheses.filter(p => p.id !== id);
          this.showSuccessMessage('Протез успешно удален');
        } catch (error) {
          console.error('Ошибка удаления:', error);
          this.error = error.response?.data?.message || error.message || 'Ошибка при удалении';
        }
      }
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
    await this.loadReferenceData();
    await this.fetchProstheses();
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchProstheses();
        }
      }
    }
  }
};
</script>

<style scoped>
.prosthesis-detail-page {
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
  gap: 25px;
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

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
}

.invalid {
  border-color: #ff4444 !important;
}

.form-note {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  font-style: italic;
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

.prosthesis-actions {
  margin-bottom: 30px;
}

.add-btn {
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

.add-btn:hover {
  background: #7fa11e;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #ff4444;
}

.no-prosthesis {
  text-align: center;
  padding: 40px 20px;
}

.no-prosthesis h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-prosthesis p {
  color: #666;
  margin-bottom: 20px;
}

.prosthesis-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.prosthesis-item {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
}

.prosthesis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.prosthesis-header h3 {
  margin: 0;
  color: #333;
}

.prosthesis-actions {
  display: flex;
  gap: 10px;
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #9ac531;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
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
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #cc0000;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-label {
  width: 150px;
  font-weight: 600;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

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
  max-width: 600px;
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
}

.select-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-select {
  flex: 1;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
}

.add-new-btn {
  padding: 10px 12px;
  background: #e6eec6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.add-new-btn:hover {
  background: #d0d9a8;
}

.new-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 8px;
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


.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #9ac531;
  color: white;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s;
}

.nav-link:hover {
  background-color: #7fa11e;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-btn {
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

.logout-btn:hover {
  background: #aa0000;
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