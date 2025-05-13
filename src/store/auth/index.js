import authService from '@/services/auth.service';

const state = {
  user: null,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken')
};

const getters = {
  isAuthenticated: state => !!state.accessToken,
  isLoading: state => state.loading,
  error: state => state.error,
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken
};

const actions = {
  async login({ commit }, credentials) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.login(credentials);
      commit('setTokens', {
        access: response.access,
        refresh: response.refresh
      });
      commit('setUser', response.user);
      return response;
    } catch (error) {
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async requestPasswordReset({ commit }, email) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async confirmPasswordReset({ commit }, data) {
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.confirmPasswordReset(data);
      return response;
    } catch (error) {
      commit('setError', error.message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async refreshToken({ commit, state }) {
    if (!state.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    commit('setLoading', true);
    commit('clearError');
    
    try {
      const response = await authService.refreshToken(state.refreshToken);
      commit('setTokens', {
        access: response.access,
        refresh: response.refresh || state.refreshToken
      });
      if (response.user) {
        commit('setUser', response.user);
      }
      return response;
    } catch (error) {
      commit('setError', error.message);
      commit('clearTokens');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  logout({ commit }) {
    commit('clearTokens');
    commit('setUser', null);
    commit('clearError');
  }
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setTokens(state, { access, refresh }) {
    state.accessToken = access;
    state.refreshToken = refresh;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
  clearTokens(state) {
    state.accessToken = null;
    state.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  },
  clearError(state) {
    state.error = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 