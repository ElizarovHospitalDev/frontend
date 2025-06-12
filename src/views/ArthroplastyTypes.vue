<template>
  <div class="arthroplasty-types">
    <div class="container">
      <div class="header">
        <h1>Формы артропластики</h1>
        <button class="add-btn" @click="startAdding">
          <i class="fas fa-plus"></i>
          Добавить форму
        </button>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск по названию..."
          class="search-input"
        >
      </div>

      <div v-if="loading" class="loading">
        Загрузка...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else-if="!filteredTypes.length" class="no-data">
        <h2>Нет данных</h2>
        <p>Добавьте новый вид артропластики</p>
      </div>

      <div v-else class="types-list">
        <div v-for="type in filteredTypes" :key="type.id" class="type-item">
          <div class="type-info">
            <h3>{{ type.name }}</h3>
          </div>
          <div class="type-actions">
            <button class="edit-btn" @click="startEditing(type)">
              <i class="fas fa-edit"></i>
              Редактировать
            </button>
            <button class="delete-btn" @click="confirmDelete(type.id)">
              <i class="fas fa-trash"></i>
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div v-if="isEditing" class="modal-overlay">
        <div class="modal-content">
          <h2>{{ editingTypeId ? 'Редактирование вида' : 'Добавление вида' }}</h2>
          
          <form @submit.prevent="saveChanges" class="edit-form">
            <div class="form-group">
              <label for="name">Название *</label>
              <input 
                id="name" 
                v-model="editForm.name" 
                type="text" 
                required
                :class="{ 'error-field': errors.name }"
                placeholder="Введите название вида артропластики"
              >
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
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
</template>

<script>
import { mapActions } from 'vuex';
import authService from '@/services/auth.service';

export default {
  name: 'ArthroplastyTypes',
  data() {
    return {
      types: [],
      loading: true,
      error: null,
      isEditing: false,
      editingTypeId: null,
      saving: false,
      searchQuery: '',
      errors: {},
      editForm: {
        name: ''
      }
    };
  },
  computed: {
    filteredTypes() {
      if (!this.searchQuery) return this.types;
      
      const query = this.searchQuery.toLowerCase();
      return this.types.filter(type => 
        type.name.toLowerCase().includes(query)
      );
    }
  },
  created() {
    this.fetchTypes();
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    async fetchTypes() {
      this.loading = true;
      this.error = null;
      try {
        this.types = await authService.getArthroplastyTypes();
      } catch (error) {
        this.handleApiError(error);
      } finally {
        this.loading = false;
      }
    },
    
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.editForm.name) {
        this.errors.name = 'Введите название вида артропластики';
        isValid = false;
      }

      return isValid;
    },
    
    async saveChanges() {
      if (!this.validateForm()) return;

      this.saving = true;
      try {
        const typeData = {
          name: this.editForm.name
        };

        if (this.editingTypeId) {
          const updated = await authService.updateArthroplastyType(this.editingTypeId, typeData);
          const index = this.types.findIndex(t => t.id === this.editingTypeId);
          this.types.splice(index, 1, updated);
          this.showSuccessMessage('Вид артропластики успешно обновлен');
        } else {
          const created = await authService.createArthroplastyType(typeData);
          this.types.push(created);
          this.showSuccessMessage('Вид артропластики успешно добавлен');
        }

        this.isEditing = false;
      } catch (error) {
        this.handleApiError(error);
      } finally {
        this.saving = false;
      }
    },
    
    handleApiError(error) {
      if (error.response?.status === 401) {
        this.logout();
      } else {
        this.error = error.response?.data?.message || error.message || 'Ошибка запроса';
      }
    },
    
    startAdding() {
      this.editForm = {
        name: ''
      };
      this.editingTypeId = null;
      this.isEditing = true;
      this.errors = {};
    },
    
    startEditing(type) {
      this.editForm = {
        name: type.name
      };
      this.editingTypeId = type.id;
      this.isEditing = true;
      this.errors = {};
    },
    
    cancelEditing() {
      this.isEditing = false;
      this.errors = {};
    },
    
    async confirmDelete(id) {
      if (confirm('Вы уверены, что хотите удалить этот вид артропластики?')) {
        try {
          await authService.deleteArthroplastyType(id);
          await this.fetchTypes();
          this.showSuccessMessage('Вид артропластики успешно удален');
        } catch (error) {
          this.handleApiError(error);
        }
      }
    },
    
    showSuccessMessage(message) {
      alert(message);
    }
  }
};
</script>

<style scoped>
.arthroplasty-types {
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #333;
}

.add-btn {
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

.add-btn:hover {
  background: #7fa11e;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #ff4444;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
}

.no-data h2 {
  color: #333;
  margin-bottom: 10px;
}

.no-data p {
  color: #666;
  margin-bottom: 20px;
}

.types-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.type-item {
  border: 1px solid #e6eec6;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-info h3 {
  margin: 0;
  color: #333;
}

.type-actions {
  display: flex;
  gap: 10px;
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

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e6eec6;
  border-radius: 6px;
  font-size: 14px;
}

.error-field {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
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