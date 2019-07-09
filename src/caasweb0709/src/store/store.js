import Vue from 'vue';
import Vuex from 'vuex';
import types from '../types/mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    permission: []
  },
  getters: {
    loadingStatus(state) {
      return state.loading;
    },
    permission(state) {
      return state.permission
    }
  },
  mutations: {
    [types.CHANGE_LOADING](state, status) {
      this.state.loading = status;
    },
    [types.SET_PERMISSION](state, status) {
      this.state.permission = status;
    }
  },
  actions: {
    LOADING_ACTION({
      commit,
    }, {
      status,
    }) {
      commit('CHANGE_LOADING', status);
    },
  },
});
