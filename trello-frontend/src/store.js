import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    quadros: [],
    colecoes: [],
    quadroAtual: null,
  },
  mutations: {
    SET_QUADROS(state, quadros) {
      state.quadros = quadros;
    },
    SET_COLECOES(state, colecoes) {
      state.colecoes = colecoes;
    },
    SET_QUADRO_ATUAL(state, quadro) {
      state.quadroAtual = quadro;
    },
  },
  actions: {
    async fetchQuadros({ commit }) {
      const response = await axios.get('/api/pegarQuadros');
      commit('SET_QUADROS', response.data);
    },
    async fetchColecoes({ commit }) {
      const response = await axios.get('/api/colecoes');
      commit('SET_COLECOES', response.data);
    },
    async fetchQuadroDetalhes({ commit }, quadroId) {
      const response = await axios.get(`/api/quadros/${quadroId}`);
      commit('SET_QUADRO_ATUAL', response.data);
    },
  },
});

export default store;
