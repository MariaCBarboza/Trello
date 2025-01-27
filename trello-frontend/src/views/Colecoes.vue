<template>
    <div>
      <h1>Coleções</h1>
      <button @click="adicionarColecao">Nova Coleção</button>
      <div v-for="colecao in colecoes" :key="colecao._id" class="colecao">
        <h3>{{ colecao.titulo }}</h3>
        <button @click="removerColecao(colecao._id)">Remover Coleção</button>
        <div>
          <h4>Quadros:</h4>
          <ul>
            <li v-for="quadro in colecao.quadros" :key="quadro._id">
              {{ quadro.titulo }}
              <button @click="removerQuadroDaColecao(colecao._id, quadro._id)">Remover da Coleção</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        colecoes: [],
      };
    },
    methods: {
      async fetchColecoes() {
        const response = await axios.get('/api/colecoes');
        this.colecoes = response.data;
      },
      async adicionarColecao() {
        const titulo = prompt('Digite o título da coleção');
        if (titulo) {
          await axios.post('/api/colecoes', { titulo });
          this.fetchColecoes();
        }
      },
      async removerColecao(colecaoId) {
        await axios.delete(`/api/colecoes/${colecaoId}`);
        this.fetchColecoes();
      },
      async removerQuadroDaColecao(colecaoId, quadroId) {
        await axios.delete(`/api/colecoes/${colecaoId}/removerQuadro/${quadroId}`);
        this.fetchColecoes();
      },
    },
    created() {
      this.fetchColecoes();
    },
  };
  </script>
  